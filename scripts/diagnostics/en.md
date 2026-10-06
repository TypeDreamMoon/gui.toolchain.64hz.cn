Every message DreamGUI gives about a `.dui` carries a code, `DUInnnn`, and is printed as `File.dui(line,col): error DUI3001: …`: the file, the line and the column (both counted from 1), the severity, the code, and one sentence that names the offending text -- `Settings.dui(12,5): error DUI3001: 'Title' is already the id of the node on line 4`, for example. When a Blueprint compiles, they appear in its compiler results. The code is the stable half: one code per cause, the same cause reached from two places keeps one code, and tests assert the code rather than the wording, so the wording stays free to improve; a retired code stays retired and is never given to anything else. The first digit says which stage refused: 1 the lexer (characters that are not a token), 2 the parser (tokens that do not form the grammar), 3 meaning (grammatical, but the tree does not hold together -- a duplicate id, an unknown type), 4 values (a value that does not fit the property it is written on), 5 building the tree (reflection refused the write, or the object to write does not exist), 6 compiling into the Blueprint (the `.dui` could not be attached to its Blueprint), 7 writing back (the designer could not put an edit into the text).

Severity is decided where a diagnostic is raised, not by its range. Most codes are errors, and an error fails the compile -- a file that does not parse leaves the Blueprint's previous hierarchy where it was rather than blanking it. A few are warnings -- DUI3008, DUI3013, DUI3023, DUI5007, DUI6003 -- where the file compiles and something is still worth a look. The VS Code extension reports the same codes with the same wording: what one file settles on its own (the lexer, brackets, duplicate names and so on) it checks as you type, and the rest reaches its Problems panel through `DUI/.dui-diagnostics.json` after the Unreal editor compiles; the compiler stays the authority.

## DUI1001

A character that cannot begin any token.

**How it happens**: the lexer meets a character no token of the grammar starts with: a single quote, `$`, `?`, `[`, `]`, a backtick, or a lone `&` or `|` (only `&&` and `||` are operators). A run of them is reported once, so a Source File aimed at something that is not a `.dui` at all gives you one message rather than thousands burying every other problem.

```dui
Text Title {
    Text = 'Settings'
}
```

**How to fix**: quote strings with double quotes; if the whole file is noise, check what the Blueprint's Source File points at.

## DUI1002

A string that reaches the end of its line without its closing quote.

**How it happens**: a string cannot span lines, so a `"` with no unescaped `"` after it before the end of the line is this code. Usually the closing quote is missing, or a quote inside the string was not written `\"`.

```dui
Text Title {
    Text = "Settings
}
```

**How to fix**: add the closing quote; write a quote inside a string as `\"` and a line break as `\n`.

## DUI1003

A `/*` that never reaches `*/`.

**How it happens**: a block comment runs from `/*` to the first `*/`; with none before the end of the file, the whole rest of the file is the comment.

```dui
/* Settings page
Widget Root {
    Text Title { Text = "Settings" }
}
```

**How to fix**: close the comment where it should end; `//` for a single line is harder to get wrong.

## DUI1004

A number that cannot be read: two decimal points, a trailing dot, a unit glued on (`24px`).

**How it happens**: something starts like a number and carries what no number has: `1.2.3`, `3.`, an exponent with no digits (`1e`), a minus with nothing after it, or letters stuck to it, such as the `24px` a CSS habit writes. All of it is swallowed into one token before it is reported, so a leftover `px` is not read as a node header and reported a second time as something unrelated.

```dui
Text Title {
    FontSize = 24px
}
```

**How to fix**: write a plain number -- `-12`, `0.95`, `1e-45`; leave units out, the value is read in the property's own unit.

## DUI1005

A colour whose digit count is not 3, 4, 6 or 8.

**How it happens**: a colour is `#RGB`, `#RGBA`, `#RRGGBB` or `#RRGGBBAA`, read as sRGB. Any other count (a digit short, as in `#FF660`), or a character after `#` that is not a hex digit, is this code.

```dui
Text Note {
    Color = #FF660
}
```

**How to fix**: write the full count, `#FF6600`; for alpha, write eight digits, `#FF6600CC`.

## DUI1006

A name longer than an `FName` holds.

**How it happens**: every name the language writes down -- a node id, a property, a handler, a loop variable -- ends up as an `FName` somewhere, and an `FName` handed an over-long string (more than the 1023 characters `NAME_SIZE` allows) does not return an error: it asserts and takes the editor with it. So the lexer stops it at the token, one rule for every position a word can appear in. The id the parser makes for an unnamed node raises the same code when it would be too long.

**How to fix**: shorten the name; for a made-up id, give the node, or a node above it, an id of its own.

## DUI1007

An asset path longer than an `FName` holds.

**How it happens**: a load splits the path into names -- the package's, the object's -- and an `FName` that is too long stops the editor rather than fail (see DUI1006). A path written bare is caught by the lexer, one written as a string by the builder.

**How to fix**: check whether the path was assembled wrongly or pasted twice; no real asset path is this long.

## DUI2001

A token where the grammar wants something else; the message names both.

**How it happens**: the parser's general refusal: a name expected and something else found, nothing after `->`, a `for`, an `each` or a `slot` at the top of the file, an annotation other than `@key` after a value, and so on. The message's "expected" half says what was missing.

```dui
for Item in GetItems() {
    Text Cell { Text <- Item.Name }
}

Widget Root { }
```

**How to fix**: write what the message expected; here, move the loop inside a node.

## DUI2002

A `{` with no matching `}`.

**How it happens**: the blocks of nodes, `style`, `resources`, `props`, `events`, `timeline` and `rows` all close. The diagnostic points at the opening brace rather than the end of the file, because "the file ended here" is the least useful true thing a parser can say.

```dui
Widget Root {
    Text Title {
        Text = "Settings"
}
```

**How to fix**: add the `}` where the reported `{` should close; the editor's folding and bracket highlighting find it.

## DUI2003

A `(` with no matching `)`.

**How it happens**: a tuple value (a vector, a margin, a rotator) may span lines, so the parser looks on for its `)`; reaching a `}` or the end of the file first is this code, and the search stops there instead of eating the rest of the enclosing node. An unclosed parenthesis in a binding expression is DUI2011.

```dui
Text Label {
    @slot Padding = (0, 4, 0, 4
}
```

**How to fix**: add the `)`.

## DUI2004

A node with neither an id nor a block, or an unnamed node with `(was: …)`.

**How it happens**: a node nothing refers to by name may leave its id out, as long as a block or a style clause follows the type (`HorizontalBox { … }`, `Text : Caption`). A type alone on a line (`Text`) is still an error: it is as likely a property whose `=` went missing. `(was: …)` renames a node, and a node with no id has nothing to be renamed to; it needs the new id written.

```dui
Widget Root {
    Text
    Text (was: Heading) { Text = "Settings" }
}
```

**How to fix**: give the node an id (`Text Title`) or a block (`Text { … }`); if a property was meant, add its `= value`.

## DUI2005

A property with no `=` or arrow, or nothing after it.

**How it happens**: a property line is `Name = value`, `Name <- expression`, `Name <-> variable` or `Name -> Handler`. A dotted name or a `@slot` line followed straight by a value, or an `=` with nothing after it before the end of the line, is this code.

```dui
Text Title {
    FontSize =
    AnchorData.SizeDelta (400, 240)
}
```

**How to fix**: add the `=` and the value, or write `<- Function()`.

## DUI2006

No root node in a file compiled into a class, or more than one.

**How it happens**: a file compiled into a Blueprint has exactly one root node. A second one is reported where it stands (the first is kept), so you see which tree is the intruder. A file with no root is a library: it can be `use`d and cannot be compiled, so a library set as a Blueprint's Source File gets "no root node".

```dui
Widget Root { }
Widget Footer { }
```

**How to fix**: move the second tree into the first; if the file is a library, do not make it a Source File -- `use` it from another file.

## DUI2007

`class` twice, with an empty path, or inside a node.

**How it happens**: `class /Game/UI/WBP_Settings` is a top-level statement, at most one per file: it says which Blueprint the file is the source of, and its path is the namespace of every localized string in the file.

```dui
class /Game/UI/WBP_Settings
class /Game/UI/WBP_Options

Widget Root { }
```

**How to fix**: keep one `class` line, at the top level, followed by the full asset path.

## DUI2008

`(was: …)` holding something other than one id.

**How it happens**: a rename clause is `(was: OldId)`, one identifier after the colon; empty, two words, or a string is this code.

```dui
Text Title (was: Old Title) { }
```

**How to fix**: write `(was: OldTitle)`, the id the node had before the rename.

## DUI2009

`@key(…)` holding something other than one string, or after a value that is not a string.

**How it happens**: `@key("Dialog.Confirm")` gives a string the key it is localized under. The parentheses hold exactly one non-empty quoted string, and the annotation follows only a quoted string, the one value that gets localized -- after a number it would be a setting that looks applied and does nothing.

```dui
Text Confirm {
    Text = "OK" @key(Dialog.Confirm)
    FontSize = 14 @key("Dialog.Size")
}
```

**How to fix**: write `Text = "OK" @key("Dialog.Confirm")`; drop `@key` from a value that is not a string.

## DUI2010

A `for` / `each` header that is not `<keyword> Var in Source` or `Source()`.

**How it happens**: a loop header is the keyword, the loop variable, `in`, and the source: a variable name (`Options`) or a call with no arguments (`GetOptions()`). A missing `in`, a source that is not a name, or arguments in the call is this code.

```dui
VerticalBox Options {
    for Option GetOptions() {
        Text { Text <- Option.Label }
    }
}
```

**How to fix**: write `for Option in GetOptions()`; a source that needs arguments becomes a no-argument function that passes them itself.

## DUI2011

The right side of `<-`, `<->` or an `emit`'s arguments that do not parse.

**How it happens**: the right side is a function call, a variable, a literal, or operators combining them. A stray token, an unclosed parenthesis or call, `@` with no resource name, `.` with no member name, or `<->` followed by something other than a variable name is this code. There is no `/` -- it belongs to paths and comments -- and no `? :`.

```dui
Widget Panel {
    RenderOpacity <- Fade() *
    Shown <- (HasDetail()
}
```

**How to fix**: complete the expression; put division and choices in a function and bind that.

## DUI2012

A `use` that could not be honoured: no such file, unreadable, does not parse, or a cycle.

**How it happens**: `use` takes a quoted path, or a class path and `as Name`. A path with no readable file under any `DUI/` root, an imported file with parse errors of its own, a file importing itself, or an import chain that comes back to a file already being imported is reported on the `use` line.

```dui
use "UI/Libary.dui"

Widget Root { }
```

**How to fix**: check the spelling and which `DUI/` root the path is relative to; when the imported file has errors, compile it directly to see them; break a cycle by moving what both share into a third file.

## DUI2013

Blocks or parentheses nested deeper than 256.

**How it happens**: a recursive-descent parser answers a file that nests a thousand deep by exhausting the stack, and a stack overflow is not a diagnostic -- it is the editor disappearing with the author's unsaved work. The limit is far above anything a hand-written or generated `.dui` reaches, so meeting it means a file that is malformed or hostile rather than merely deep; nothing below that level is read.

**How to fix**: check the tool that generated the file; a real screen splits deep structure into components.

## DUI2014

A `timeline` block or line that is not the grammar.

**How it happens**: one code for the whole block, with the message naming the part: a header with no name; `external` followed by a block, or neither a block nor `external`; `duration` or `loop` with no value, or a `loop` other than `Once`, `Loop` or `PingPong`; a track line with no `:`, or a node path with no property; a key with no `=`; a negative time; `ease` with no curve name; `@time` with no `->` and event name.

```dui
timeline Pulse {
    duration = 0.6
    loop     = Forever
    Icon.RenderScale 0.0 = (1, 1, 1), 0.3 = (1.25, 1.25, 1)
}

Widget Root {
    Image Icon
}
```

**How to fix**: write the shapes the docs show: a track line is `NodePath.Property : time = value ease Curve, …`, an event key is `@0.3 -> Landed`.

## DUI2015

`use … as` without a name, a keyword as the name, or a class path without `as`.

**How it happens**: the word after `as` is the whole name, so nothing may follow it, and a reserved keyword cannot be it. A class path such as `use /Game/UI/WBP_Row` has nothing to offer but the class, so without a name the line does nothing, and `as` is required.

```dui
use "UI/Components/Row.dui" as
use /Game/UI/WBP_Slider

Widget Root { }
```

**How to fix**: write `use "UI/Components/Row.dui" as Row`, `use /Game/UI/WBP_Slider as Slider`.

## DUI2016

A `props` line that is not `Type Name` or `Type Name = value`, or `props` inside a node.

**How it happens**: a `props` block declares one property per line: a type, a name, and optionally `= default`, with an `Enum` type followed by the enum's path before the name. A missing name, an `=` with no value, or two names on one line is this code; so is a `props` block inside a node, since it declares what the file's class has and belongs at the top level.

```dui
props {
    Text
    Number Count =
}

Widget Root { }
```

**How to fix**: write `Text Label` and `Number Count = 0`, and keep the `props` block at the top of the file.

## DUI2017

An `events` entry that is not `Name` or `Name(Type Param, …)`, or `events` inside a node.

**How it happens**: each event is a name, optionally followed by a parenthesised parameter list of type-and-name pairs separated by `,` and closed by `)`; an entry ends at a line break or a `;`. A parameter with no name, the wrong separator, something after the entry, or an `events` block inside a node is this code.

```dui
events {
    Picked(Number)
}

Widget Root { }
```

**How to fix**: write `Picked(Number Index)`, and keep the `events` block at the top of the file.

## DUI2018

An `if` without its condition or block, an `else` with no `if`, or a branch holding something other than widgets.

**How it happens**: `if` goes inside a node, followed by a binding expression as its condition and a `{ … }` block; `else` is followed by a block, or by `if` and another condition. A branch holds widgets only: a property, a `@slot` line, a `+` block, a `slot` or a loop in one is this code, and so is an `if` at the top of the file. A widget in a branch cannot write `Shown <->` either: the branch decides `Shown`, and a mirror would write that back into the variable.

```dui
Widget Root {
    if HasSave() {
        RenderOpacity = 0.5
        Text Continue { Text = "Continue" }
    }
}
```

**How to fix**: put the property on a widget inside the branch; complete the condition or the block; put `else` on the line the `}` closed or on the next one.

## DUI2019

A slot with `default` twice, or a block that both declares and fills.

**How it happens**: `slot Name { … }` in a component file is a declaration -- its block holds components, properties and `@slot` lines that lay the hole out; `slot Name { … }` in a host is a fill -- its block holds widgets only. A block holding both, a fill carrying `default`, a style or `(was: …)`, or a fill block with properties is this code.

```dui
Widget Root {
    slot Footer default default
    slot Detail {
        + VerticalBox { Spacing = 15 }
        Text Note { Text = "A length of wire." }
    }
}
```

**How to fix**: keep widgets out of a declaration and everything else out of a fill; `default`, a style and a rename go on the declaration.

## DUI2020

A `rows` table that does not read: a column list that is not names, a column twice, a row with the wrong number of values.

**How it happens**: the header is `rows Type : Style (Column, Column)`, the columns property names, each written once (compared without case, since two columns differing only in case name one property); each row's values match the columns one for one, separated by commas. A value too few means the author left something out, a value too many has nowhere to go -- both are guesses, so a row that does not read makes no widget.

```dui
VerticalBox Menu {
    rows Text (Text, FontSize) {
        "City Ruins", 18
        "Desert Zone"
    }
}
```

**How to fix**: give every row as many values as there are columns; for what one row needs beyond the columns, end its line with a block.

## DUI2021

A `viewmodels` line that does not read, or a `viewmodels` block inside a node.

**How it happens**: each line of a `viewmodels` block declares one view model: `Type Name`, optionally followed by `= new`, `= global`, `= global "Name"`, `= parent` or `= parent "Name"`. A missing name, something after `=` that is none of those sources, or a second declaration on the line is this. So is an empty name such as `global ""`: it names nothing, which is not the same as no name, "by class alone". A block written inside a node is this too: view models are what the class holds, so the block belongs at the top of the file, like `props` and `events`.

```dui
viewmodels {
    PlayerVM Player = global ""
    SettingsVM = new
}
```

**How to fix**: write each line as `Type Name` with an optional source; to take the object from the registry by its class alone, write `global` by itself; move the block to the top of the file.

## DUI3001

Two nodes share an id.

**How it happens**: the id is the node's identity -- its guid, its class member variable, its binding key and its localization key at once -- and ids are compared without case, since each becomes an `FName`. A duplicate is never silently renamed to `OkBtn_1`: that would quietly repoint whichever of the two your bindings meant. Slots share the namespace with widgets, so two slots of one name, or a slot named like a widget, are this code too; a host's `slot Detail { … }` filling a component's slot is not counted.

```dui
Widget Root {
    Text Title { Text = "Settings" }
    Text title { Text = "Audio" }
}
```

**How to fix**: rename one of them; if a rename caused the collision, use `(was: …)` so the next compile moves the references.

## DUI3002

An id that is not an identifier, starts with a digit, or is a keyword.

**How it happens**: an id is a C++ identifier -- letters, digits and `_`, not starting with a digit (characters outside ASCII are letters, so an id may be Chinese). `2ndPanel` is refused because the generated class would declare `_2ndPanel`, and every binding written against the name in the file would resolve to nothing. `class`, `style`, `resources`, `slot`, `for`, `each`, `in`, `was`, `use`, `timeline`, `external` and `ease` are keywords and cannot be a node id or a slot name; an id longer than an `FName` holds is this code as well.

```dui
Widget Root {
    Text 2ndLine { }
    Text external { }
}
```

**How to fix**: choose an id that starts with a letter or `_` and is not a keyword, such as `SecondLine`.

## DUI3003

A type that is no tag, container, alias, registered widget or path.

**How it happens**: a node's type is resolved in order: a built-in tag (`Text`, `Image`, …), a layout container (`VerticalBox`, …), a component alias given by `use … as`, a registry tag (`Native.Button`, …), an asset path (starting with `/`). Matching none is this code; for a scoped or namespaced name the message lists what is there.

```dui
Widget Root {
    Txt Title { Text = "Settings" }
}
```

**How to fix**: fix the spelling; bring a component in with `use "…" as Name` first, or write its full asset path.

## DUI3004

`: Name` naming no style this file sees.

**How it happens**: a node's style clause, or a style's base, names a style this file neither declares nor brought in with `use`. A style may be declared below the node that wears it; order does not matter. A namespaced name (`nier.Label`) whose namespace is not declared is DUI3021 instead.

```dui
style Caption { FontSize = 14 }
Text Note : Captoin { Text = "Ready" }
```

**How to fix**: fix the style's name, or `use` the library that declares it.

## DUI3005

Two styles of one name in one file.

**How it happens**: a local style may shadow an imported one of the same name, but with two local styles of one name the builder and the write-back could disagree about which lines a node got, so the second is refused.

```dui
style Caption { FontSize = 14 }
style Caption { FontSize = 12 }

Text Note : Caption { Text = "Ready" }
```

**How to fix**: merge them or rename one; for a variant of a style, inherit it: `style Small : Caption`.

## DUI3006

`+ Name` naming nothing a widget can carry.

**How it happens**: the class after `+` is looked up with the plugin's prefixes tried (`UIButton` and `Button` both find the button behaviour), or written as a full `/Script/Module.Class` path; resolving to no behaviour, layout container or layout-self object is this code. A style's `+` lines are held to the same rule.

```dui
Widget Confirm {
    + UIButon { TransitionType = None }
}
```

**How to fix**: fix the class name, or write its full `/Script/…` path.

## DUI3007

Retired and never raised; two slots of one name are DUI3001.

## DUI3008

A loop variable that hides an enclosing loop's (a warning).

**How it happens**: a nested `for` or `each` uses the variable name of the loop around it. It is a warning because shadowing cannot change the tree that gets built. Loops do not nest anyway: the build refuses the inner one with DUI5021 or DUI5012.

```dui
VerticalBox Groups {
    for Item in GetGroups() {
        VerticalBox Group {
            for Item in GetEntries() {
                Text Entry { Text <- Item.Name }
            }
        }
    }
}
```

**How to fix**: rename the inner variable; more to the point, move the inner loop into a component whose own file has it, and hand it its list through a `props` entry.

## DUI3009

A parent that will not take this child: a full content widget, a named slot filled twice.

**How it happens**: the node is fine and the parent is fine; only the pair is not. `SizeBox`, `ScaleBox`, `SafeZone` and `Border` hold one child; a named slot holds one widget, and the same slot cannot be filled twice; circular nesting is refused too. Attaching drops the extra child silently, so without this code you would get a tree quietly missing a subtree you can see in your own file.

```dui
SizeBox Box {
    Text A { Text = "One" }
    Text B { Text = "Two" }
}
```

**How to fix**: put the children in one container (`VerticalBox { … }`, for example) and put that in; for a slot that should hold several widgets, give its declaration a layout container.

## DUI3010

`(was: X)` while X is still an id in the file.

**How it happens**: you renamed a node away from X and then made a new node called X. "Move everything that pointed at X" would move it away from a node that exists and wants it, so it is refused -- and the whole file's migration with it, because a half-migrated file is worse than an unmigrated one: the next compile no longer starts from what the author wrote.

```dui
Widget Root {
    Text Title (was: Heading) { Text = "Settings" }
    Text Heading { Text = "Audio" }
}
```

**How to fix**: rename the other node first, or drop the `(was: Heading)`.

## DUI3011

Two nodes claim `(was: X)`.

**How it happens**: one old name cannot become two new ones, and nothing can decide which node inherits X's references, so the file's migration does not run.

```dui
Widget Root {
    Text Title (was: Heading) { }
    Text Subtitle (was: Heading) { }
}
```

**How to fix**: keep the clause on the node that inherits the references and delete the other.

## DUI3012

`(was: X)` on the node called X.

**How it happens**: a rename clause says what a node used to be called; a node already called that has nothing to migrate, and it is almost certainly a typo. The file's migration does not run.

```dui
Text Title (was: Title) { Text = "Settings" }
```

**How to fix**: delete the `(was: …)`; for a rename, write the new id after the type and the old one in `(was: …)`.

## DUI3013

The old id is also another member's name, so graph references are not moved (a warning).

**How it happens**: references in Blueprint graphs resolve by name. If the old name is also a variable this Blueprint declares, a member of its parent class, or a local inside some function, rewriting every reference to it would silently repoint code that has nothing to do with the widget, so the graph leg does not run. The binding and animation legs are unambiguous and still run.

**How to fix**: repoint the graph references by hand, or rename the other thing of that name.

## DUI3014

Two resource entries of one name.

**How it happens**: entries accumulate over several `resources` blocks; with one name declared twice the first wins everywhere, so the second is refused.

```dui
resources {
    Color Accent = #FF6600
    Color Accent = #E05A47
}

Text Note { Color = @Accent }
```

**How to fix**: delete or rename one of them.

## DUI3015

A style that inherits itself through its bases.

**How it happens**: `style A : B`, and following the bases comes back to A. Nothing of it applies, and the node that wears it reports this code.

```dui
style Caption : Warning { FontSize = 14 }
style Warning : Caption { Color = #E05A47 }

Text Note : Warning { Text = "Unsaved changes" }
```

**How to fix**: break the cycle: make one of them stop inheriting the other.

## DUI3016

Two timelines of one name.

**How it happens**: a timeline's name is both the animation's display name and a class member variable (the compiler declares one per animation, as UMG does for `UWidgetAnimation`), so two of them is a variable nobody can address -- refused the same way as two styles of one name.

```dui
timeline Pulse external
timeline Pulse { duration = 0.6 }

Widget Root { }
```

**How to fix**: rename one of them.

## DUI3017

Two `use … as` lines give one name.

**How it happens**: the first wins everywhere and the second is refused, so a type name never changes meaning because of a line nowhere near it.

```dui
use "UI/Components/Row.dui" as Row
use "UI/Components/NieR_Row.dui" as Row

Widget Root { }
```

**How to fix**: give the second one another name.

## DUI3018

A `use … as` name that is a tag or a container.

**How it happens**: a node's type asks the built-in tags and the layout containers before any alias, so an alias called `Text` or `VerticalBox` could never be written: an alias cannot change what `Text` means.

```dui
use "UI/Components/Label.dui" as Text

Widget Root { }
```

**How to fix**: choose a name that is not a tag or a container, such as `Label`.

## DUI3019

Two `props` lines declare one name.

**How it happens**: one name is one property; the first line is kept and the second refused.

```dui
props {
    Text   Label
    String Label
}

Widget Root { }
```

**How to fix**: delete or rename one of the lines.

## DUI3020

Two `events` entries of one name, or one parameter twice.

**How it happens**: each event becomes an event dispatcher, so its name is unique; the parameter names of one event are unique too.

```dui
events {
    Picked(Number Index, Number Index)
    Closed
    Closed
}

Widget Root { }
```

**How to fix**: delete or rename the duplicate.

## DUI3021

`ns.Name` whose `ns` no `use … as ns` declares.

**How it happens**: styles, resources and component aliases may be qualified by a namespace (`: nier.Label`, `@nier.Ink`, `nier.Row`), and the namespace has to come from a `use "…" as nier`. This is the only code reported for it -- not a second "no such style" on top, which would send you looking for a misspelling that is not the mistake.

```dui
Text Note : nier.Label { Text = "Ready" }
```

**How to fix**: add `use "UI/NieR_Common.dui" as nier`, or fix the prefix's spelling.

## DUI3022

More than one `slot … default` in one file.

**How it happens**: content nested without a slot name has one place to go. The first keeps the default role, so the hosts compiled against it still agree.

```dui
Widget Root {
    slot Rows default
    slot Footer default
}
```

**How to fix**: write `default` on one slot only.

## DUI3023

Two rows of a `rows` table whose first values make the same id, so the second's id moves with the order (a warning).

**How it happens**: each row's id comes from its first value (`Page_0__Row_City_Ruins`), so inserting or reordering rows leaves every other row's id and localization keys alone. When two rows' keys make the same id, or one makes an id the file already uses, the later row gets a suffix such as `_1` -- and that number, with its localization keys, moves when the rows are reordered, which is exactly the instability a key column exists to avoid.

```dui
VerticalBox Menu {
    rows Text (Text) {
        "Audio"
        "Audio"
    }
}
```

**How to fix**: give the rows distinct first values; a row code needs by name is written as a node of its own.

## DUI3024

Two `viewmodels` entries of one name.

**How it happens**: each entry becomes a variable of the class, and two entries of one name can only be one variable. Names compare without regard to case: `Player` and `player` are one variable. The first is kept.

```dui
viewmodels {
    PlayerVM Player
    PlayerVM player = global
}
```

**How to fix**: rename one of them, or remove the extra line.

## DUI4001

No property of that name; the nearest one is suggested.

**How it happens**: a bare property name is looked for on the widget, then its visual, then -- on a container-typed node -- its layout container, then its behaviours; the first that has it takes it, and none having it is this code. `Width`, `Height`, `AnchorLeft` and the like are labels the details panel shows, not property names, and the message says what to write instead.

```dui
Text Title {
    FontSzie = 14
    Width = 400
}
```

**How to fix**: take the suggestion; write a size as `AnchorData.SizeDelta = (w, h)` and anchors as `AnchorData.AnchorMin` and `AnchorData.AnchorMax`.

## DUI4002

A dotted path whose head resolves and whose tail does not.

**How it happens**: in `A.B`, `A` is a property but not a struct, so there is no field to step into; or it is a struct with no field `B`, and the message suggests the nearest field.

```dui
Widget Panel {
    AnchorData.Size = (400, 240)
}
```

**How to fix**: take the suggested field name, `AnchorData.SizeDelta` here.

## DUI4003

A value whose shape cannot be the property's type.

**How it happens**: the literal's kind does not fit the property's type -- a string on a number, an unquoted word on an `FText`; an asset path that loads something of a class the property cannot hold; a node id, written as a value, whose node lacks the part the property takes (a visual, for example) or is another widget class; a string too long for an `FName` property; a timeline key whose value cannot be read as the property's type.

```dui
Text Title {
    FontSize = "large"
    Text = Settings
}
```

**How to fix**: write the value the property's type takes: text always quoted, an object property a path that loads the right class.

## DUI4004

A tuple with the wrong number of elements.

**How it happens**: a tuple is read against its destination struct: two values for a 2D vector, three for a 3D vector and a rotator, four for a margin.

```dui
Widget Panel {
    AnchorData.SizeDelta = (400, 240, 0)
}
```

**How to fix**: write as many values as the struct has, `(400, 240)` or `(0, 8, 0, 0)`.

## DUI4005

A word the property's enum does not declare.

**How it happens**: a word on an enum property that is not one of the enum's values (the nearest is suggested), or a number that matches none of its values. A flags enum has no `|`; write a combination as the number its flags add up to.

```dui
Widget Panel {
    Visibility = Invisible
}
```

**How to fix**: take the suggestion, `Collapsed` or `Hidden` here.

## DUI4006

A property text cannot write: transient, deprecated, part of the object graph, a delegate.

**How it happens**: the property exists, and writing it from a `.dui` means nothing: a transient property (one with no native setter) would not survive being saved; a deprecated one takes no new values; instanced references such as `Visual` and `LayoutContainer` are the object graph itself, authored by nesting and by `+`, not assigned; a delegate has no text form, and events are routed with `->`.

```dui
Widget Panel {
    LayoutContainer = None
}
```

**How to fix**: write a container with `+ VerticalBox { … }` or a container-typed node, route events with `->`; otherwise set a property that can be written.

## DUI4007

`@Name` naming no resource entry.

**How it happens**: `@Accent` stands for the `resources` entry called `Accent` -- this file's, or one a `use` brought in; with none, this code. A node type written `@Name` is held to the same rule, and needs an `Asset` entry.

```dui
resources {
    Color Accent = #FF6600
}

Text Note {
    Color = @Accnet
}
```

**How to fix**: fix the name, or declare the entry in a `resources` block.

## DUI4008

A resource whose value is not its declared type, or a non-`Asset` resource used as a node type.

**How it happens**: a resource's type is one of `Color`, `Number`, `Vector2`, `String` and `Asset`, and its value must be of that type; a type name that is none of the five is this code too. An entry used as a node type through `@Name` must be an `Asset` naming a widget class.

```dui
resources {
    Color Accent = 8
}

Text Note { Color = @Accent }
```

**How to fix**: make the value fit the type (`Color Accent = #FF6600`), or correct the declared type.

## DUI5001

An asset or class path that does not load.

**How it happens**: an asset path written as a node type or a property value fails to load: misspelt, moved or deleted, or in a plugin that is not enabled.

```dui
Widget Root {
    /Game/UI/WBP_Rwo Audio { }
}
```

**How to fix**: copy the asset's path from the Content Browser again; if the asset moved, update the path.

## DUI5002

A property of a visual the node's type does not create.

**How it happens**: the name is not found on the node, and it is a property of some tag's visual -- `FontSize` on a `Widget`, for example, which belongs to the text visual a `Text` node creates. The message names the tag that has it, so the fix is usually one word.

```dui
Widget Title {
    FontSize = 14
}
```

**How to fix**: change the node's type to the tag the message names (`Text Title` here), or move the line onto such a node.

## DUI5003

A slot line on a node whose parent lays out no panel.

**How it happens**: `@slot` and `@fill` set the panel slot -- how the parent's container places this child. A parent with no layout container (a plain `Widget`), or a node that is the root, has no panel slot to write; slot lines a style brings count too.

```dui
Widget Root {
    Text Label {
        @slot Padding = (0, 4, 0, 4)
    }
}
```

**How to fix**: give the parent a layout container (`VerticalBox Root`, or `+ VerticalBox { }`), or drop the slot lines and place the node with `AnchorData`.

## DUI5004

A bound function the class does not have, or one that takes parameters.

**How it happens**: a binding that only calls a function, `Text <- GetTitle()`, binds that function directly, so it must be a function of this Blueprint (or its parent) that takes no arguments and returns the bound property's type. A function name longer than an `FName` holds is this code too.

```dui
Text Title {
    Text <- GetTitel()
}
```

**How to fix**: fix the name or add the function to the Blueprint; for arguments, write a no-argument function that passes them.

## DUI5005

A bound property with no setter.

**How it happens**: a binding writes through the property's setter at run time: `Set` and the property's name (a bool's `b` dropped, so `bUseKerning` is set by `SetUseKerning`), one parameter, no return value. A property with no such function cannot be driven. A component's own `props` are the one exception: Blueprint variables with no setter, which a host may still bind one way with `<-`.

**How to fix**: set the property from a function instead; on a C++ class of your own, give it a setter of that shape.

## DUI5006

A node typed by a class that is not a concrete DreamUI user widget.

**How it happens**: a node typed by a class (an alias, `@Name`, a registry tag, an asset path) is an instance of a component, its contents that class's, so the class must be a `UDreamUserWidget` subclass that is neither abstract nor deprecated. A texture, a plain UMG widget or any other asset is this code.

```dui
Widget Root {
    /Game/UI/T_Icon Icon { }
}
```

**How to fix**: write an asset as a property's value (an `Image`'s `Brush.ResourceObject`, for example); type nodes only by DreamGUI widget Blueprints or native DreamUI user widget classes.

## DUI5007

A loop built by a caller with nowhere to record it, and skipped (a warning).

**How it happens**: a `for` or an `each` is recorded as a compiled loop binding, and the builder needs its caller to offer somewhere to record it. A Blueprint compile always does; a caller that builds a tree from a raw AST (most tests, a C++ tool of your own) may not, and then the loop and everything under it is skipped while the rest of the file builds.

**How to fix**: compile the file through its Blueprint; when calling the builder yourself, give it somewhere to record loop bindings.

## DUI5008

A binding on something no binding can name: a slot, a container, a field of a struct.

**How it happens**: a binding can name the widget, its visual and its behaviours (`EDreamWidgetBindingTarget`), and whole properties only. A `@slot` property, a container's property on a container-typed node, or a struct field such as `AnchorData.SizeDelta` has nowhere to be recorded whatever setters it has. It is apart from DUI5005 precisely because writing a setter would not help here.

```dui
VerticalBox Column {
    Spacing <- GetGap()
    AnchorData.SizeDelta <- GetSize()
}
```

**How to fix**: bind a whole property (an `FVector2D` one, say), or set these values from a function of the Blueprint.

## DUI5009

The tree had no root; the parser said why.

**How it happens**: the AST handed to the builder carries no root node. The parser has already reported the cause (usually DUI2006); this states the outcome.

**How to fix**: deal with the earlier diagnostic of the same compile.

## DUI5010

`X -> …` where X is not an event of the destination.

**How it happens**: the left side of `->` is an event of the widget, its visual or a behaviour: a `BlueprintAssignable` dynamic multicast delegate, or an editable `DreamUIEventDelegate`. A name that is an ordinary property, a path into a struct, or found on none of them is this code; so is a handler name longer than an `FName` holds.

```dui
Text Title {
    OnClick -> HandleClick
}
```

**How to fix**: write the route where the event lives, in the button behaviour's block for example: `+ UIButton { OnClick -> HandleClick }`.

## DUI5011

An expression the compiler cannot turn into a function.

**How it happens**: a `<-` expression richer than a bare call is compiled into a generated Blueprint function. A name that is neither a variable nor a function of the class (as of the previous compile), the wrong number of arguments, a function that returns nothing, an operator with no meaning between its operand types, a type with no conversion to the one needed, a resource in an expression that is not a `Number` or a `String`, or an item binding in a loop body that reads more than one member deep (`Item.A.B`) is this code; the message names which.

```dui
Widget Panel {
    RenderOpacity <- Fadee() * 0.8
    Shown <- GetName() * 2
}
```

**How to fix**: fix the expression; when the logic gets rich, move it into a real function and bind that.

## DUI5012

An `each` at the root, nested, without a list view, or without exactly one template.

**How it happens**: an `each` fills the list view of the widget it is written in, so its host needs a `+ UIListView` (or a recyclable scroll view); it is not the root, does not sit in another `for` or `each`, and its body is exactly one widget, the template repeated per item.

```dui
Widget Inventory {
    each Item in GetItems() {
        Text Cell { Text <- Item.Name }
    }
}
```

**How to fix**: add `+ UIListView { }` to the host; wrap several widgets in one container; write a nested list as a component whose own file has the inner loop.

## DUI5013

A node id written as a value that names no node in the file.

**How it happens**: a property that holds a widget, a visual or a behaviour may be given a node id, meaning the node of that id in this file; an id that does not exist is this code, with the nearest id suggested. A node that exists and is not the kind of thing the property holds is DUI4003.

```dui
Widget Confirm {
    + UIButton { TransitionTarget = Bakground }
    Image Background { }
}
```

**How to fix**: fix the id, or declare the node.

## DUI5014

An expression or a `<->` inside a loop body, or a route there to another object.

**How it happens**: a generated binding function belongs to the class, and a name in a loop body is known only to an iteration, so the body supports two shapes, recorded cell by cell: the single hop `Item.Member` as a binding, and a route to a function of the item itself — `Event -> Item.Func` (handing it what the event sends) or `Event -> Item.Func()` (calling it with nothing). Anything richer used to be dropped: the file compiled and the property was never driven. A route to another object (`Settings.Apply()`), one more than a hop deep (`Item.Owner.Use`), or one with arguments is this too. The expression is fine and the place is not, which is why it is not DUI5011.

```dui
VerticalBox Options {
    for Option in GetOptions() {
        Text { Text <- Option.Label + "!" }
    }
}
```

**How to fix**: move the logic into the item's own class (have it offer a ready member), or bind outside the loop.

## DUI5015

A track path that names no node.

**How it happens**: a track line's path is a chain of node ids (`Row/Title`), the same display-name path an animation binding resolves through; a path this file's tree does not have is this code. A node that exists without the property is DUI5016.

```dui
timeline Pulse {
    duration = 0.6
    Iocn.RenderScale : 0.0 = (1, 1, 1), 0.3 = (1.25, 1.25, 1)
}

Widget Root {
    Image Icon
}
```

**How to fix**: fix the ids in the path; a track with no path drives the widget the animation lives on.

## DUI5016

A track property no animation track can drive.

**How it happens**: the property does not exist on the node, its visual or its behaviours; or it is not marked `Interp`, so the animation editor does not offer it either; or its type has no track -- a timeline drives numbers, 2- to 4-component vectors and colours, and anything else belongs in an `external` timeline.

```dui
timeline Swap {
    Title.Text : 0.0 = "A", 1.0 = "B"
}

Widget Root {
    Text Title
}
```

**How to fix**: drive a property the animation editor shows; animate anything else in an `external` timeline edited in Sequencer.

## DUI5017

An `ease` name the tween library does not have.

**How it happens**: curve names are `EDreamTweenEase`'s (`Linear`, `InOutQuad`, `OutCubic`, `OutBack`, …) minus `CurveFloat`, which names an asset, and a timeline key has nowhere to put one.

```dui
timeline Pulse {
    Icon.RenderScale : 0.0 = (1, 1, 1), 0.3 = (1.25, 1.25, 1) ease InOutQuadratic
}

Widget Root {
    Image Icon
}
```

**How to fix**: use a name `EDreamTweenEase` declares, `InOutQuad` here.

## DUI5018

An alias that names no class: no `class` line and no Blueprint for the file, or a path that loads nothing.

**How it happens**: `use "…" as Row` names the class that file compiles into -- the one its `class` line names, or the Blueprint whose Source File it is. A file with no `class` line that no Blueprint uses yet, no editor to ask (in a commandlet, say), a `class` line naming a Blueprint that does not exist yet, or a `use /Game/… as` path that loads no class is this code.

```dui
use "UI/Components/Row.dui" as Row

VerticalBox Root {
    Row Audio { Label = "Audio" }
}
```

**How to fix**: give the component file a `class` line, or compile it into a Blueprint first; for a class path, fix the path.

## DUI5019

`slot Name { … }` filling a slot under a node that is not a component instance.

**How it happens**: a `slot Name { … }` holding widgets fills a named slot of a component, so it belongs inside a component instance; at the root, or inside a plain widget or a container, there is no slot to fill.

```dui
VerticalBox Page {
    slot Detail {
        Text Note { Text = "A length of wire." }
    }
}
```

**How to fix**: nest the content directly; if you are writing a component and meant to declare a slot, write `slot Detail` with no widgets.

## DUI5020

A fill naming a slot the component does not declare.

**How it happens**: the slot a `slot Name { … }` fills inside a component instance must be one that component declares; the message lists the slots it has.

```dui
ListPage Page_2 {
    slot Detials {
        Text Note { Text = "A length of wire." }
    }
}
```

**How to fix**: fix the slot's name; content nested without a slot name goes to the component's default slot.

## DUI5021

A `for` at the root, in another loop, in a host with fixed room, or without exactly one template.

**How it happens**: a `for` makes one copy of its template per item inside the widget it is written in, so the host must take any number of children: a `SizeBox` and the others that hold one cannot. It is not the root, does not sit in another `for` or `each`, and its body is exactly one widget.

```dui
SizeBox Box {
    for Option in GetOptions() {
        Text { Text <- Option.Label }
    }
}
```

**How to fix**: put a container such as `VerticalBox` inside and the `for` in that; wrap several widgets in one container; write nested repetition as a component whose own file has the inner loop, given its list through one of its props.

## DUI5022

A second layout container on one node.

**How it happens**: a widget arranges its children one way. A node whose type is already a container (`VerticalBox Column`) with a `+ HorizontalBox` on it, or a container from its own `+` lines and another from its style's, is this code. The second container used to replace the first without a word, taking its values with it.

```dui
VerticalBox Column {
    + HorizontalBox { Spacing = 8 }
}
```

**How to fix**: write the container's properties on the node itself; for another arrangement, nest a child widget.

## DUI5023

A member path segment its class does not have, or does not show to Blueprint.

**How it happens**: a path such as `Player.Name` starts at a variable of the class — a `viewmodels` entry, a prop or a Blueprint variable, as of the previous compile — and every later segment is a member of the class the segment before it holds. A segment that does not exist, or exists where a graph cannot reach it — a property that is not `BlueprintReadOnly` / `BlueprintReadWrite`, a function that is not `BlueprintCallable` / `BlueprintPure` — is this, and the message names the segment and the class. An UnrealSharp property is visible to Blueprint only when its `[UProperty]` says `BlueprintReadOnly` or `BlueprintReadWrite`.

```dui
viewmodels {
    PlayerVM Player
}

VerticalBox Root {
    Text Name { Text <- Player.Nmae }
}
```

**How to fix**: correct the member's name; give a C++ property `BlueprintReadOnly`, a C++ function `BlueprintCallable` or `BlueprintPure`.

## DUI5024

A member path that goes on past a value that is not an object.

**How it happens**: every segment of a path is read off the **object** the segment before it holds. In `Player.Health.Max`, `Health` is a float, which has no members to read. A struct is no different: a path goes through object references only.

```dui
viewmodels {
    PlayerVM Player
}

VerticalBox Root {
    Text Hp { Text <- Player.Health.Max }
}
```

**How to fix**: end the path at the value; have the view model offer what is derived from it as a member of its own (`MaxHealth`).

## DUI5025

A route operator the event cannot honour: `+=` on a single-cast delegate, or `=` on a multicast event.

**How it happens**: `+=` adds a listener beside the others, so it takes only an event that holds several (a `BlueprintAssignable` multicast delegate, a `DreamUIEventDelegate`); `=` makes this the event's one listener, so it takes only a single-cast delegate — on a multicast event it would have to drop the listeners the control and the Blueprint graph added. `->` takes either kind and is never this. The route is not recorded: bound the other way, it would do something the line does not say.

```dui
VerticalBox Root {
    Native.Button Apply { OnClicked = HandleApply }
}
```

**How to fix**: `+=` for a multicast event, `=` for a single-cast delegate — or `->` for either.

## DUI6001

The Blueprint's Source File does not exist or cannot be read.

**How it happens**: the compile looks the `.dui` up from the Source File: a relative path is searched under the project's `DUI/` root and then each plugin's, a `Plugin.Name:` prefix names one plugin's `DUI/`, and an absolute path is used as written. The message gives the path you wrote, where it looked, and the roots it searched; a `Plugin.Name:` naming no enabled plugin with a `DUI/` directory is said as such.

**How to fix**: put the file under a `DUI/` root (not `Content/`), or correct the Blueprint's Source File.

## DUI6002

The file parsed and produced no tree.

**How it happens**: the builder handed back no hierarchy. The cause -- a node type nothing resolves, say -- was reported earlier in the same compile; this reports the outcome: there is nothing to compile into the class.

**How to fix**: deal with the earlier diagnostics of the same compile.

## DUI6003

The `class` line names another Blueprint than the one compiling (a warning).

**How it happens**: the file's `class` line names an asset other than the Blueprint being compiled -- a copied file whose `class` line was left as it was, for example. It is a warning: the line's job is a stable localization namespace, so a wrong one drifts keys rather than breaking the build, and the localization keys keep using the name in the file.

```dui
class /Game/UI/WBP_Settings

Widget Root { }
```

**How to fix**: point the `class` line at the Blueprint being compiled; for a file deliberately shared across subclasses, the warning can stand.

## DUI6004

`-> Handler` naming a function the class does not have.

**How it happens**: the handler lives on the class this compile is building, which the builder cannot look into ahead of time, so the compiler checks it: this Blueprint has no function of that name. A wrong event, the other half of a route, is DUI5010.

```dui
Widget Confirm {
    + UIButton { OnClick -> HandleConfrm }
}
```

**How to fix**: fix the name, or add the function to the Blueprint.

## DUI6005

A handler whose parameters are not the event's.

**How it happens**: the function exists, and its parameters are not the ones the event sends, in count or type.

**How to fix**: give the function the event's signature, or route to one that has it.

## DUI6006

A loop source the class has neither as a function nor as a variable.

**How it happens**: `in GetOptions()` needs a no-argument function of that name on the class, `in Options` an array variable of that name. The source lives on the class this compile is building, so the compile checks it.

```dui
VerticalBox Options {
    for Option in GetOptions() {
        Text { Text <- Option.Label }
    }
}
```

**How to fix**: declare the function or the variable in the Blueprint, or fix the name.

## DUI6007

A loop source that is not an array of objects.

**How it happens**: the source exists and does not supply an array of objects. The item bindings read `Item.Member` off each element by reflection, which needs an element with members to read: `TArray<UMyRow*>` works, `TArray<FMyRow>` and `TArray<int32>` do not. The name is right and the type is wrong, which is why it is not DUI6006.

**How to fix**: have the source return an array of objects -- make each row a `UObject` subclass, for example.

## DUI6008

A `props` or `events` type with no Blueprint pin.

**How it happens**: the type of a prop or an event parameter is one of `Text`, `String`, `Number`, `Integer`, `Bool`, `Color`, `Vector2`, `Asset`, `Class`, or `Enum` followed by the enum's path. A misspelt type, `Enum` with no path, a path with no enum at it, or an enum that is not `BlueprintType` is this code.

```dui
props {
    Float Speed = 1
}

Widget Root { }
```

**How to fix**: use one of the types above (`Number` here); an enum must be usable as a Blueprint type.

## DUI6009

A `props` name another member already has with another type, or a widget's id.

**How it happens**: each prop becomes a variable of the class, and its name must be free: not a widget's id (every widget has a class variable of its name), a resource entry, a member this Blueprint declares, or a function of the parent. A C++ parent's property of the same name and type is used instead of declaring one; of another type, it is this code.

```dui
props {
    Text Title
}

VerticalBox Root {
    Text Title { Text <- Title }
}
```

**How to fix**: rename one of them; to use the parent's property, declare it with that property's type.

## DUI6010

`emit Name` of an event this file does not declare.

**How it happens**: `emit` raises an event of its own file's `events` block; a name the block does not declare, or a file with no `events` block, is this code.

```dui
events {
    Picked(Number Index)
}

Widget Row {
    + UIButton { OnClick -> emit Pickd(0) }
}
```

**How to fix**: fix the event's name, or declare it in the `events` block.

## DUI6011

`emit` arguments that are not the event's parameters.

**How it happens**: `emit Name(…)` passes as many arguments as the event declares parameters, each of a type the matching parameter can take.

```dui
events {
    Picked(Number Index)
}

Widget Row {
    + UIButton { OnClick -> emit Picked() }
}
```

**How to fix**: pass what the event declares, `emit Picked(ValueIndex)` for example.

## DUI6012

An `emit` where no handler can be generated: in a loop body, or for an event Blueprints cannot carry.

**How it happens**: `-> emit` is compiled into a generated handler. The widgets of a `for` or `each` body are the loop's copies, not the class's, so no such handler can stand there; and an event whose parameters no Blueprint function can take (an `FDreamUIEventDelegate` of a width Blueprints have no pin for) cannot have one either. It is said rather than dropped, so the route is never silently missing.

```dui
events {
    Picked(Number Index)
}

VerticalBox Options {
    for Option in GetOptions() {
        Widget {
            + UIButton { OnClick -> emit Picked(0) }
        }
    }
}
```

**How to fix**: route the event to a function of the class and raise the event from there, or use an event whose parameters a Blueprint can take.

## DUI6013

A `props` default its type cannot hold.

**How it happens**: a default must fit the prop's type: a quoted string for `Text` and `String`, a whole number for `Integer`, `true` or `false` for `Bool`, a hex colour for `Color`, a pair for `Vector2`, a value the enum declares, an asset that is there, a `@Name` naming a resource entry. The default is dropped, since a variable that would fail every binding and every host line reading it is worse than none.

```dui
props {
    Integer Count = 1.5
}

Widget Root { }
```

**How to fix**: give a default of the declared type, `Integer Count = 1`.

## DUI6014

An `events` name another member of the class already answers to.

**How it happens**: each event becomes an event dispatcher, and its name must not already belong to a prop, a widget, a resource, a variable or function of this Blueprint, or a parent's member that is not a dispatcher of the same parameters. A parent's dispatcher of the same name and parameters is used as it is.

```dui
events {
    Title
}

VerticalBox Root {
    Text Title { Text = "Settings" }
}
```

**How to fix**: rename the event or the other member.

## DUI6015

A `viewmodels` type that names no class, or two.

**How it happens**: the type is a class's reflected name (`PlayerVM` for a C++ `UPlayerVM`), a full path (`/Script/MyGame.PlayerVM`, `/Game/UI/BP_PlayerVM`), or a name a `use … as` gave. A short name that matches no class — misspelt, its module not loaded, the Blueprint not there yet — is this; so is one that two modules each have a class of, since the compiler does not pick for you.

```dui
viewmodels {
    PlayrVM Player
}
```

**How to fix**: correct the class name; when it is ambiguous, write the full path, or `use /Script/MyGame.PlayerVM as PlayerVM` and the name it gives.

## DUI6016

A `viewmodels` name another member of the class already answers to.

**How it happens**: each entry becomes a variable of the class, so its name must not already belong to a widget, a prop, a resource, an event, or a variable or function of this Blueprint. A parent's member of that name is one of two things. When the parent is a C++ class and the member is an object reference of this very class, the line describes that property — where its object comes from — rather than declaring a second one. When the parent's own `.dui` already declares the entry, or the member is not a reference to this class, it is this.

```dui
viewmodels {
    PlayerVM Title
}

VerticalBox Root {
    Text Title { Text = "Status" }
}
```

**How to fix**: rename the entry or the other member; to use the entry a parent's `.dui` declares, remove the line — a subclass reads it as it is.

## DUI6017

A source that cannot be honoured: `= new` of an abstract class.

**How it happens**: `= new` has the widget make one when it was given none, and an abstract class has nothing to make. `UDreamViewModel` itself is abstract; name a subclass of it. The entry still becomes a variable of the class, and bindings through it still compile; the run time is just never asked to fill it. (An empty name such as `global ""` is already DUI2021 when the file is parsed.)

```dui
viewmodels {
    DreamViewModel State = new
}
```

**How to fix**: name a concrete class, or leave the source out and have the host hand the object over.

## DUI6018

`-> Path.Func` whose function the object's class does not have, or does not let Blueprint call.

**How it happens**: the path on the right of a route reaches an object, and its last segment is a function of that object's class. A function that does not exist, is not `BlueprintCallable`, or is `BlueprintPure` — which only returns a value, so an event has nothing to call it for — is this.

```dui
viewmodels {
    SettingsVM Settings
}

VerticalBox Root {
    Native.Button Apply { OnClicked += Settings.Aply() }
}
```

**How to fix**: correct the function's name; make a C++ function `UFUNCTION(BlueprintCallable)`.

## DUI6019

`-> Path.Func` whose arguments do not fit the function.

**How it happens**: with parentheses, they hold the arguments — expressions over the class, with the event's own parameters in scope by name — and their count and types must match the function's parameters. Without them, the function must take nothing or exactly what the event sends.

```dui
viewmodels {
    SettingsVM Settings
}

VerticalBox Root {
    Native.Slider Volume { OnValueChanged += Settings.SetVolume(Value, 1) }
}
```

**How to fix**: pass the arguments the function takes, or drop the parentheses and let it take what the event sends.

## DUI6020

`<-> Path.Member` whose member cannot be written back.

**How it happens**: `<->` writes the control's changes back into the member: through the object's `BlueprintCallable` `Set<Member>` (one parameter of the member's type) when the class has one, otherwise by writing the property and announcing it on that object. A property read-only to graphs (`BlueprintReadOnly`) with no such setter leaves neither way open — the slider would move and spring back — so the compiler refuses it.

```dui
viewmodels {
    SettingsVM Settings
}

VerticalBox Root {
    Native.Slider Volume { Value <-> Settings.MasterVolume }
}
```

Here `MasterVolume` is `BlueprintReadOnly` and `SettingsVM` has no `SetMasterVolume`.

**How to fix**: give the class a `BlueprintCallable` `SetMasterVolume(float)`, make the property `BlueprintReadWrite`, or bind it one way with `<-`.

## DUI6021

`Item.Member` that the loop source's element class does not have.

**How it happens**: when the source is an array of a concrete class (`TArray<UItemVM*>`), the compiler knows what each item is and checks `Item.Member` against it. With a `TArray<UObject*>` the class is known only at run time, which checks the line then and, as it always did, skips a copy it does not fit.

```dui
viewmodels {
    InventoryVM Inventory
}

VerticalBox Root {
    for Item in Inventory.Items {
        Text { Text <- Item.Nmae }
    }
}
```

**How to fix**: correct the member's name, or add the member to the element class.

## DUI6022

`-> Item.Func` in a loop body that the element class does not have, or whose parameters fit neither nothing nor the event.

**How it happens**: when the element class is known, `Event -> Item.Func` and `Event -> Item.Func()` need the function on it, taking nothing or exactly what the event sends.

```dui
viewmodels {
    InventoryVM Inventory
}

VerticalBox Root {
    for Item in Inventory.Items {
        Native.Button { OnClicked += Item.Equip() }
    }
}
```

Here the element class `ItemVM` has no `Equip`.

**How to fix**: correct the function's name or parameters; when it needs more, have the element class offer a version that takes nothing.

## DUI7001

A designer edit with no home in the file: an unknown node, a bound property, a slot with no block.

**How it happens**: the designer has a change to write into the text and no place to write it: no node, style or resource of that name in the file; a property bound with `<-` or decided by a `Shown <-`, whose binding a written value would silently replace or be overwritten by; a `slot Name` with no block to hold a property; a node to insert whose id already exists; the root, or a loop's template, to remove or move; a file that did not parse into a tree at all. Nothing is written.

**How to fix**: make the change in the text, as the message says -- give the slot a `{ }`, or remove the binding before editing in the designer.

## DUI7002

The file changed under a pending edit; nothing was written.

**How it happens**: a designer edit is planned against the tree last parsed from the file, and before writing, the text on disk no longer matches that tree (you edited the file in another editor, for example), or two edits landed on the same characters. The designer never writes over a file changed on disk.

**How to fix**: let the editor read the file again (saving it recompiles), then make the change in the designer again.

## DUI7003

A value the language cannot spell (a non-finite number); its line is left alone.

**How it happens**: the printer spells a non-finite float the way printf does, and `inf` lexes as an identifier, so a file written with one parses and then refuses on the next compile, on a line nobody touched -- so the write is refused instead. An enum byte the enum does not declare is refused the same way. Nothing is wrong with the file, which is why this does not borrow the lexer's DUI1004.

**How to fix**: give the property a finite value in the designer, or write it in the text.

## DUI7004

An edit to something no line spells: a visibility an `if` decides, a shorthand that cannot be rewritten.

**How it happens**: some values are not written on a line of their own but made when the file is read, and the designer does not invent a line where the author wrote none: the visibility of a widget in an `if` branch; a `SizeRule` other than Fill on `@fill 2`, or a weight `@fill` cannot be written with; anything on a row of a `rows` table but a column's value or a line of the row's own block (a row is not removed, moved, named or given a `+` block from the designer).

```dui
Widget Root {
    if HasSave() {
        Text Continue { Text = "Continue" }
    }
}
```

**How to fix**: edit the text: change the `if`'s condition or move the widget out of the branch; replace `@fill 2` with `@slot SizeRule = …` and `@slot FillWeight = 2`; edit a row in its table.

## DUI7005

An edit to a value a style's `+` line gives the node; add the line to the node or change the style.

**How it happens**: the node takes the value from a `+ Component { … }` line of its style and writes no `+` line of that class itself. The value has two homes and the write-back takes neither: the style is shared, so writing there would move every node that wears it, and a `+` block of the node's own is a change to the file's shape the value pass does not make.

```dui
style RowColumn {
    + VerticalBox { Spacing = 15 }
}

Widget Left : RowColumn { }
```

**How to fix**: write `+ VerticalBox { Spacing = 20 }` on the node itself, or change the style.
