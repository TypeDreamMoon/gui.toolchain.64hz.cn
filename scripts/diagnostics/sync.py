"""Regenerate the diagnostics pages from the DreamGUI plugin's own code table.

The generated half of every code comes from the plugin:

  * `Source/DreamGUI/Public/Text/DreamUIDiagnostics.h` — the `EDreamUIDiagnosticCode` enum: every
    code, its name, its doc comment, and the family headings between them;
  * `Docs/DuiLanguage.md`, "## Diagnostics" — the one-line meaning of each code, as users read it;
  * `Source/**/*.cpp` — whether a code is raised through `AddError` or `AddWarning` (both, for some).

The prose half lives here, one file per locale: `scripts/diagnostics/zh.md` and `en.md`. Each has
an intro (everything before the first `## DUInnnn`, shown on the index page) and one section per
code — a one-sentence meaning, then how it happens and how to fix it. A code in the enum with no
section in a locale's file is a hard error, so a new code cannot quietly ship without its prose.

    python scripts/diagnostics/sync.py --plugin <path to Plugins/DreamGUI>

`content/docs/diagnostics/*.mdx` is generated: do not hand-edit it.
"""

import argparse
import io
import json
import os
import re
import sys

SITE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(SITE, "content", "docs", "diagnostics")
DEFAULT_PLUGIN = r"I:\UnrealProject_Moon\DEV_58\DevTest\Plugins\DreamGUI"

FAMILIES = [
    ("1", "词法", "Lexer", "一串字符构不成任何记号。", "A character sequence that is not a token."),
    ("2", "语法", "Parser", "记号拼不成语法。", "Tokens that do not form the grammar."),
    ("3", "语义", "Meaning", "语法没错，但这棵树对不上：重复的 id、未知的类型。", "Grammatical, but the tree does not hold together: a duplicate id, an unknown type."),
    ("4", "取值", "Values", "值和它写在的属性对不上。", "A value that does not fit the property it is written on."),
    ("5", "构建", "Building the tree", "反射拒绝了写入，或者目标对象不存在。", "Reflection refused the write, or the target object does not exist."),
    ("6", "编译", "Compiling", ".dui 挂不到它的 Blueprint 上。", "The .dui could not be attached to its Blueprint."),
    ("7", "写回", "Write-back", "设计器的改动没法写回文本。", "The designer's edit could not be put into the text."),
]

ENUM_ENTRY = re.compile(r"/\*\*(.*?)\*/\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(\d+)\s*,", re.S)
TABLE_ROW = re.compile(r"^\|\s*DUI(\d{4})\s*\|\s*([A-Za-z0-9_]+)\s*\|\s*(.+?)\s*\|\s*$")
SECTION = re.compile(r"^## DUI(\d{4})\s*$", re.M)
RAISE = re.compile(r"Add(Error|Warning)\(\s*EDreamUIDiagnosticCode::([A-Za-z_][A-Za-z0-9_]*)")
INLINE_CODE = re.compile(r"(`+)(.+?)\1")
FENCE = re.compile(r"^\s*(```|~~~)")


def read(path):
    return io.open(path, encoding="utf-8-sig").read()


def write(path, text):
    with io.open(path, "w", encoding="utf-8", newline="\n") as h:
        h.write(text.rstrip() + "\n")


def clean_comment(text):
    lines = [re.sub(r"^\s*\*\s?", "", l).rstrip() for l in text.strip().splitlines()]
    return " ".join(l for l in lines if l).strip()


def _escape(text):
    return re.sub(r"<", "&lt;", text.replace("{", "\\{").replace("}", "\\}"))


def escape_prose(markdown):
    """Escape `<` `{` `}` outside code spans and fences, so prose cannot open JSX."""
    out = []
    in_fence = False
    for line in markdown.splitlines():
        if FENCE.match(line):
            in_fence = not in_fence
            out.append(line)
            continue
        if in_fence:
            out.append(line)
            continue
        pieces, last = [], 0
        for m in INLINE_CODE.finditer(line):
            pieces.append(_escape(line[last:m.start()]))
            pieces.append(m.group(0))
            last = m.end()
        pieces.append(_escape(line[last:]))
        out.append("".join(pieces))
    return "\n".join(out)


def parse_prose(path):
    """(intro, {code: (sentence, rest)}) from zh.md / en.md."""
    text = read(path)
    parts = SECTION.split(text)
    intro = parts[0].strip()
    sections = {}
    for i in range(1, len(parts), 2):
        code = int(parts[i])
        body = parts[i + 1].strip()
        paras = body.split("\n\n", 1)
        sections[code] = (paras[0].strip(), paras[1].strip() if len(paras) > 1 else "")
    return intro, sections


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plugin", default=DEFAULT_PLUGIN)
    args = ap.parse_args()

    header = read(os.path.join(args.plugin, "Source", "DreamGUI", "Public", "Text", "DreamUIDiagnostics.h"))
    body = header[header.index("enum class EDreamUIDiagnosticCode"):]
    body = body[: body.index("};")]
    codes = []
    for m in ENUM_ENTRY.finditer(body):
        number = int(m.group(3))
        if number == 0:
            continue
        codes.append((number, m.group(2), clean_comment(m.group(1))))
    if not codes:
        raise SystemExit("no codes found in the enum")

    meanings = {}
    language = read(os.path.join(args.plugin, "Docs", "DuiLanguage.md"))
    for line in language.splitlines():
        m = TABLE_ROW.match(line)
        if m:
            meanings[int(m.group(1))] = m.group(3).strip()

    raised = {}
    for root, dirs, files in os.walk(os.path.join(args.plugin, "Source")):
        for f in files:
            if f.endswith((".cpp", ".h")) and "Tests" not in root:
                for sev, name in RAISE.findall(read(os.path.join(root, f))):
                    raised.setdefault(name, set()).add(sev.lower())

    prose = {}
    missing = []
    for locale in ("zh", "en"):
        path = os.path.join(HERE, locale + ".md")
        if not os.path.exists(path):
            raise SystemExit("missing %s" % path)
        prose[locale] = parse_prose(path)
        for number, name, _ in codes:
            if number not in prose[locale][1]:
                missing.append("%s: DUI%04d %s" % (locale, number, name))
    if missing:
        raise SystemExit("codes with no prose:\n  " + "\n  ".join(missing))

    def severity(number, name, comment):
        found = raised.get(name, set())
        if not found:
            text = (meanings.get(number, "") + " " + comment).lower()
            found = {"warning"} if "a warning" in text else {"error"}
        return sorted(found)

    os.makedirs(OUT, exist_ok=True)
    for name in os.listdir(OUT):
        if name.endswith(".mdx"):
            os.remove(os.path.join(OUT, name))

    for locale in ("zh", "en"):
        intro, sections = prose[locale]
        docs = "/en/docs/diagnostics/" if locale == "en" else "/docs/diagnostics/"
        index_rows = []
        for digit, zh_name, en_name, zh_desc, en_desc in FAMILIES:
            family = [c for c in codes if str(c[0]).startswith(digit)]
            if not family:
                continue
            slug = "dui%sxxx" % digit
            label = zh_name if locale == "zh" else en_name
            title = "DUI%sxxx · %s" % (digit, label)
            desc = zh_desc if locale == "zh" else en_desc
            lines = ["---", "title: " + json.dumps(title, ensure_ascii=False),
                     "description: " + json.dumps(desc, ensure_ascii=False), "---", ""]
            if locale == "zh":
                lines += ["本页由 `scripts/diagnostics/sync.py` 从插件的码表（`EDreamUIDiagnosticCode`）生成，"
                          "卡片里的枚举名就是测试断言用的那个名字。", ""]
            else:
                lines += ["Generated by `scripts/diagnostics/sync.py` from the plugin's code table "
                          "(`EDreamUIDiagnosticCode`); the name on each card is the one the tests assert.", ""]
            for number, name, comment in family:
                sentence, rest = sections[number]
                sev = severity(number, name, comment)
                msg = sentence if locale == "zh" else (meanings.get(number) or sentence)
                msg = msg.replace("`", "")
                lines.append("## DUI%04d" % number)
                lines.append("")
                lines.append('<Dui sev="%s" msg={%s} raised="%s" />' % (
                    sev[0], json.dumps(msg, ensure_ascii=False), name))
                lines.append("")
                if len(sev) > 1:
                    lines.append("<Sev s=\"warning\" /> " + ("既可能是错误，也可能是警告，取决于出现的位置。" if locale == "zh"
                                                          else "Raised as an error or as a warning, depending on where it occurs."))
                    lines.append("")
                if rest:
                    lines.append(escape_prose(rest))
                    lines.append("")
                index_rows.append((number, name, sev, sentence if locale == "zh" else (meanings.get(number) or sentence), slug))
            write(os.path.join(OUT, slug + (".en.mdx" if locale == "en" else ".mdx")), "\n".join(lines))

        sev_label = {"error": "错误" if locale == "zh" else "error", "warning": "警告" if locale == "zh" else "warning"}
        idx = ["---",
               "title: " + json.dumps("诊断码" if locale == "zh" else "Diagnostics", ensure_ascii=False),
               "description: " + json.dumps("每一条 DUInnnn 诊断：它说的是什么、怎么会出现、怎么改。" if locale == "zh"
                                            else "Every DUInnnn diagnostic: what it means, how it happens, how to fix it.",
                                            ensure_ascii=False),
               "---", "", escape_prose(intro), ""]
        idx.append("## " + ("七个家族" if locale == "zh" else "The seven families"))
        idx.append("")
        idx.append("| | " + (" | ".join(["阶段", "说明", "码数"]) if locale == "zh" else " | ".join(["Stage", "Meaning", "Codes"])) + " |")
        idx.append("| --- | --- | --- | --- |")
        for digit, zh_name, en_name, zh_desc, en_desc in FAMILIES:
            count = len([c for c in codes if str(c[0]).startswith(digit)])
            if count:
                idx.append("| [DUI%sxxx](%sdui%sxxx) | %s | %s | %d |" % (
                    digit, docs, digit, zh_name if locale == "zh" else en_name,
                    _escape(zh_desc if locale == "zh" else en_desc), count))
        idx.append("")
        idx.append("## " + ("全部诊断码" if locale == "zh" else "Every code"))
        idx.append("")
        idx.append("<Wide>")
        idx.append("")
        idx.append("| " + (" | ".join(["码", "枚举名", "级别", "含义"]) if locale == "zh" else " | ".join(["Code", "Name", "Severity", "Meaning"])) + " |")
        idx.append("| --- | --- | --- | --- |")
        for number, name, sev, meaning, slug in index_rows:
            idx.append("| [DUI%04d](%s%s#dui%04d) | `%s` | %s | %s |" % (
                number, docs, slug, number, name, " / ".join(sev_label[s] for s in sev),
                escape_prose(meaning).replace("|", "\\|")))
        idx.append("")
        idx.append("</Wide>")
        write(os.path.join(OUT, "index.en.mdx" if locale == "en" else "index.mdx"), "\n".join(idx))

    print("%d codes, %d raised directly -> %s" % (len(codes), sum(1 for c in codes if c[1] in raised), OUT))
    return 0


if __name__ == "__main__":
    sys.exit(main())
