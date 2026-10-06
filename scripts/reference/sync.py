"""Regenerate the class reference pages from the DreamGUI plugin's own reference.

`Docs/Reference/*.md` in the plugin is printed from reflection by the `DreamGUIReferenceDocs`
commandlet, so it cannot fall behind the headers. This copies it into the site:

  * one page per class, `content/docs/reference/<name>.mdx` (Chinese) and `<name>.en.mdx`
    (English) — the reference itself stays English on both, because it is the headers'
    own comments; the Chinese page says so at the top;
  * the index page and the sidebar order (`meta.json`), grouped as the plugin's index groups them.

Markdown that MDX reads differently is rewritten on the way: the generator's HTML comment is
dropped, indented code becomes a fenced block, `<` `{` `}` in prose are escaped, the wide member
tables get a scroll container, and links between pages become site routes.

    python scripts/reference/sync.py --plugin <path to Plugins/DreamGUI>

Do not hand-edit the generated pages; regenerate them. To change what a page says, change the
header comment and run the commandlet again.
"""

import argparse
import io
import json
import os
import re
import sys

SITE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(SITE, "content", "docs", "reference")
DEFAULT_PLUGIN = r"I:\UnrealProject_Moon\DEV_58\DevTest\Plugins\DreamGUI"

# The plugin index's groups, in its order, with the Chinese sidebar label for each.
GROUP_ZH = {
    "Controls": "控件",
    "Panels and slots": "面板与插槽",
    "Widgets": "控件基类与用户控件",
    "Function libraries": "函数库",
    "Styles": "样式",
}

FENCE = re.compile(r"^(```|~~~)")
LINK = re.compile(r"\]\(([A-Za-z0-9_]+)\.md(#[^)]*)?\)")
INLINE_CODE = re.compile(r"(`+)(.+?)\1")


def slug(name: str) -> str:
    return name.lower()


def escape_prose(line: str) -> str:
    """Escape what MDX would read as JSX or an expression, outside inline code spans."""
    out = []
    last = 0
    for m in INLINE_CODE.finditer(line):
        out.append(_escape(line[last:m.start()]))
        out.append(m.group(0))
        last = m.end()
    out.append(_escape(line[last:]))
    return "".join(out)


def _escape(text: str) -> str:
    text = text.replace("{", "\\{").replace("}", "\\}")
    # `<` before a letter, `/` or `!` opens a tag in MDX; elsewhere it is harmless, but an
    # entity is always safe.
    return re.sub(r"<", "&lt;", text)


def convert_body(lines, locale):
    """The page body: fences kept, indented code fenced, prose escaped, tables wrapped."""
    prefix = "/en/docs/reference/" if locale == "en" else "/docs/reference/"
    out = []
    in_fence = False
    in_indented = False
    in_table = False
    prev_blank = True

    def relink(text):
        return LINK.sub(lambda m: "](%s%s%s)" % (prefix, slug(m.group(1)), (m.group(2) or "").lower()), text)

    for raw in lines:
        line = raw.rstrip("\n")

        if FENCE.match(line.strip()):
            in_fence = not in_fence
            out.append(line.strip())
            prev_blank = False
            continue
        if in_fence:
            out.append(line)
            continue

        # An indented block after a blank line (not a list continuation) is code in Markdown.
        is_indented = line.startswith("    ") and line.strip() != ""
        if in_indented:
            if is_indented or line.strip() == "":
                out.append(line[4:] if is_indented else "")
                continue
            # close: drop trailing blank lines inside the fence
            while out and out[-1] == "":
                out.pop()
            out.append("```")
            out.append("")
            in_indented = False
        elif is_indented and prev_blank and not (out and re.match(r"^\s*([-*]|\d+\.)\s", out[-2] if len(out) > 1 else "")):
            out.append("```text")
            out.append(line[4:])
            in_indented = True
            continue

        if "<!--" in line:
            prev_blank = line.strip() == ""
            continue

        is_table = line.lstrip().startswith("|")
        if is_table and not in_table:
            # the member tables are six columns of long text: give them their own scroll
            if line.count("|") >= 6:
                out.append("<Wide>")
                out.append("")
                in_table = "wide"
            else:
                in_table = "plain"
        elif not is_table and in_table:
            if in_table == "wide":
                out.append("")
                out.append("</Wide>")
            in_table = False

        out.append(relink(escape_prose(line)))
        prev_blank = line.strip() == ""

    if in_indented:
        while out and out[-1] == "":
            out.pop()
        out.append("```")
    if in_table == "wide":
        out.append("")
        out.append("</Wide>")
    return out


def first_sentence(lines):
    """The class's one-line summary: the first prose paragraph's first sentence."""
    for line in lines:
        t = line.strip()
        if not t or t.startswith(("#", "<!--", "|", "-", "Inherits", "Declared", "```")):
            continue
        t = re.sub(r"`([^`]*)`", r"\1", t)
        t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t)
        m = re.match(r"(.+?[.!?])(\s|$)", t)
        return (m.group(1) if m else t)[:200]
    return ""


def yaml_string(text: str) -> str:
    return json.dumps(text, ensure_ascii=False)


def write(path, text):
    with io.open(path, "w", encoding="utf-8", newline="\n") as h:
        h.write(text)


def parse_index(text):
    """[(group, [(class, file stem)])] from the plugin's index.md."""
    groups = []
    for line in text.splitlines():
        h = re.match(r"^## (.+)$", line)
        if h:
            groups.append((h.group(1).strip(), []))
            continue
        m = re.match(r"^- \[([^\]]+)\]\(([A-Za-z0-9_]+)\.md\)", line)
        if m and groups:
            groups[-1][1].append((m.group(1), m.group(2)))
    return groups


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plugin", default=DEFAULT_PLUGIN)
    args = ap.parse_args()
    ref = os.path.join(args.plugin, "Docs", "Reference")
    if not os.path.isdir(ref):
        raise SystemExit("no Docs/Reference under %s" % args.plugin)

    os.makedirs(OUT, exist_ok=True)
    for name in os.listdir(OUT):
        if name.endswith(".mdx") or name.startswith("meta"):
            os.remove(os.path.join(OUT, name))

    groups = parse_index(io.open(os.path.join(ref, "index.md"), encoding="utf-8").read())
    listed = {stem for _, items in groups for _, stem in items}
    stems = sorted(f[:-3] for f in os.listdir(ref) if f.endswith(".md") and f != "index.md")
    unlisted = [s for s in stems if s not in listed]
    if unlisted:
        groups.append(("Other", [("U" + s, s) for s in unlisted]))

    summaries = {}
    for stem in stems:
        lines = io.open(os.path.join(ref, stem + ".md"), encoding="utf-8").read().splitlines()
        title = lines[0][2:].strip() if lines and lines[0].startswith("# ") else stem
        body_lines = lines[1:]
        summary = first_sentence(body_lines)
        summaries[stem] = (title, summary)
        for locale in ("zh", "en"):
            body = convert_body(body_lines, locale)
            head = ["---", "title: " + yaml_string(title), "description: " + yaml_string(summary or title), "---", ""]
            if locale == "zh":
                head += [
                    '<Callout type="info">',
                    "  本页由 `DreamGUIReferenceDocs` commandlet 从反射生成，正文是头文件注释的原文（英文），所以不翻译——"
                    "这样它永远和代码一致。概念讲解见[核心概念](/docs/concepts/widgets)。",
                    "</Callout>",
                    "",
                ]
            name = slug(stem) + (".en.mdx" if locale == "en" else ".mdx")
            write(os.path.join(OUT, name), "\n".join(head + body).rstrip() + "\n")

    # the index pages and the sidebar
    for locale in ("zh", "en"):
        prefix = "/en/docs/reference/" if locale == "en" else "/docs/reference/"
        if locale == "zh":
            text = [
                "---",
                "title: 类参考",
                "description: DreamGUI 每个公开类的属性、函数与事件，由反射生成，并附与 UMG 的对照。",
                "---",
                "",
                "这里每一页对应一个类：它的属性（类型、分类、是否出现在细节面板、蓝图怎么读写）、可调用的函数、"
                "事件，以及页尾和对应 UMG 类的命名对照。页面由插件的 `DreamGUIReferenceDocs` commandlet "
                "从反射打印出来，所以永远不会落后于头文件：",
                "",
                "```powershell",
                "UnrealEditor-Cmd.exe <project>.uproject -run=DreamGUIReferenceDocs",
                "```",
                "",
                "命名为什么和 UMG 一致、哪些成员刻意不同，见 [与 UMG 的命名对照](/docs/controls/umg-parity)。",
                "",
            ]
        else:
            text = [
                "---",
                "title: Class reference",
                "description: Every public DreamGUI class's properties, functions and events, printed from reflection, with its UMG comparison.",
                "---",
                "",
                "One page per class: its properties (type, category, whether the details panel shows it, how a "
                "Blueprint reads and writes it), the functions it offers, its events, and at the end how its "
                "names compare with the UMG class it corresponds to. The pages are printed from reflection by the "
                "plugin's `DreamGUIReferenceDocs` commandlet, so they cannot fall behind the headers:",
                "",
                "```powershell",
                "UnrealEditor-Cmd.exe <project>.uproject -run=DreamGUIReferenceDocs",
                "```",
                "",
                "Why the names follow UMG's, and which members differ on purpose: "
                "[UMG parity](/en/docs/controls/umg-parity).",
                "",
            ]
        for group, items in groups:
            text.append("## " + (GROUP_ZH.get(group, group) if locale == "zh" else group))
            text.append("")
            text.append("| | |")
            text.append("| --- | --- |")
            for cls, stem in items:
                summary = escape_prose(summaries.get(stem, (cls, ""))[1].replace("|", "\\|"))
                text.append("| [`%s`](%s%s) | %s |" % (cls, prefix, slug(stem), summary))
            text.append("")
        write(os.path.join(OUT, "index.en.mdx" if locale == "en" else "index.mdx"), "\n".join(text).rstrip() + "\n")

        pages = ["index"]
        for group, items in groups:
            label = GROUP_ZH.get(group, group) if locale == "zh" else group
            pages.append("---%s---" % label)
            pages += [slug(stem) for _, stem in items]
        meta = {"title": "类参考" if locale == "zh" else "Reference", "pages": pages}
        write(os.path.join(OUT, "meta.en.json" if locale == "en" else "meta.json"),
              json.dumps(meta, ensure_ascii=False, indent=2) + "\n")

    print("%d classes in %d groups -> %s" % (len(stems), len(groups), OUT))
    return 0


if __name__ == "__main__":
    sys.exit(main())
