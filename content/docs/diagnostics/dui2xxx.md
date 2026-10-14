---
title: "DUI2xxx · 语法"
description: "记号拼不成语法。"
---

# DUI2xxx · 语法 [#dui2xxx]

本页由 `scripts/diagnostics/sync.py` 从插件的码表（`EDreamUIDiagnosticCode`）生成，卡片里的枚举名就是测试断言用的那个名字。

## DUI2001 [#dui2001]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个出现在语法期待别的东西的位置上的记号；消息会写出期待什么、遇到了什么。
```

**触发位置：** `UnexpectedToken`

**怎么会出现**：这是解析器的通用错误：期待一个名字却读到别的、`->` 后面没有处理函数名、`for`、`each` 或 `slot` 写在了文件顶层、值后面跟了 `@key` 以外的注解，等等。具体缺了什么，看消息里“期待”的那一半。

```dui
for Item in GetItems() {
    Text Cell { Text <- Item.Name }
}

Widget Root { }
```

**怎么改**：照消息里期待的写法改；上面的例子要把循环放进一个节点里面。

## DUI2002 [#dui2002]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个没有匹配 } 的 {。
```

**触发位置：** `UnclosedBlock`

**怎么会出现**：节点、`style`、`resources`、`props`、`events`、`timeline`、`rows` 的块都要成对闭合。诊断报在左花括号上，而不是文件末尾，因为“文件在这里结束了”是一个解析器能说出的最没用的真话。

```dui
Widget Root {
    Text Title {
        Text = "Settings"
}
```

**怎么改**：在报出的那个 `{` 该结束的地方补上 `}`；编辑器的折叠和括号高亮可以帮你找到它。

## DUI2003 [#dui2003]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个没有匹配 ) 的 (。
```

**触发位置：** `UnclosedTuple`

**怎么会出现**：元组值（向量、边距、旋转）可以跨行写，所以解析器会一直往下找 `)`；遇到 `}` 或者文件末尾还没找到就报这个码，并停在那里，不会把外层节点剩下的部分也吞进去。绑定表达式里没闭合的括号是 DUI2011。

```dui
Text Label {
    @slot Padding = (0, 4, 0, 4
}
```

**怎么改**：补上 `)`。

## DUI2004 [#dui2004]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个既没有 id 也没有块的节点，或者一个带着 (was: …) 却没写 id 的节点。
```

**触发位置：** `MissingNodeId`

**怎么会出现**：没人按名字引用的节点可以不写 id，前提是类型后面跟着块或样式子句（`HorizontalBox { … }`、`Text : Caption`）。一行上只有一个类型名（`Text`）仍然是错误，因为它同样可能是一个丢了 `=` 的属性。`(was: …)` 是改名子句，没有 id 的节点没有“从什么改过来”可言，它需要写出新的 id。

```dui
Widget Root {
    Text
    Text (was: Heading) { Text = "Settings" }
}
```

**怎么改**：给节点写一个 id（`Text Title`）或者一个块（`Text { … }`）；如果本意是属性，补上 `= 值`。

## DUI2005 [#dui2005]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个后面没有 = 或箭头、或者 =、箭头后面什么都没有的属性。
```

**触发位置：** `MissingPropertyValue`

**怎么会出现**：属性行写成 `Name = 值`、`Name <- 表达式`、`Name <-> 变量` 或 `Name -> 处理函数`。带点的名字或 `@slot` 行后面直接跟了值，或者 `=` 后面到行尾都没有值，就报这个码。

```dui
Text Title {
    FontSize =
    AnchorData.SizeDelta (400, 240)
}
```

**怎么改**：补上 `=` 和值，或者写成 `<- Function()`。

## DUI2006 [#dui2006]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个被编译成类、却没有根节点或者有不止一个根节点的文件。
```

**触发位置：** `MalformedRoot`

**怎么会出现**：编译进 Blueprint 的文件恰好有一个根节点。多出来的根节点在它自己的位置上报出（保留第一个），所以你能看到是哪一个闯了进来。没有根节点的文件是库，只能被 `use`，不能被编译；把一个库设成 Blueprint 的 Source File，就会得到“没有根节点”。

```dui
Widget Root { }
Widget Footer { }
```

**怎么改**：把第二棵树移进第一棵里；如果这个文件本来就是库，别把它当 Source File，在别的文件里 `use` 它。

## DUI2007 [#dui2007]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个写了两次、路径为空或者写在节点里的 class。
```

**触发位置：** `MalformedClassDeclaration`

**怎么会出现**：`class /Game/UI/WBP_Settings` 是顶层语句，一个文件最多一行：它说明这个文件是哪个 Blueprint 的源，同时也是文件里所有本地化字符串的命名空间。

```dui
class /Game/UI/WBP_Settings
class /Game/UI/WBP_Options

Widget Root { }
```

**怎么改**：只留一行 `class`，写在文件顶层，后面跟完整的资产路径。

## DUI2008 [#dui2008]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个括号里不是恰好一个 id 的 (was: …)。
```

**触发位置：** `MalformedWasClause`

**怎么会出现**：改名子句写成 `(was: OldId)`，冒号后面只能有一个标识符；空着、写了两个词、写成字符串，都报这个码。

```dui
Text Title (was: Old Title) { }
```

**怎么改**：写成 `(was: OldTitle)`，括号里是改名之前的那个 id。

## DUI2009 [#dui2009]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个括号里不是恰好一个字符串、或者跟在非字符串值后面的 @key(…)。
```

**触发位置：** `MalformedKeyOverride`

**怎么会出现**：`@key("Dialog.Confirm")` 给一个字符串指定它的本地化键。括号里要恰好一个非空的带引号字符串；它也只能跟在带引号的字符串后面，因为只有字符串会被本地化，跟在数字后面是一个看起来生效、实际什么也不做的设置。

```dui
Text Confirm {
    Text = "OK" @key(Dialog.Confirm)
    FontSize = 14 @key("Dialog.Size")
}
```

**怎么改**：写成 `Text = "OK" @key("Dialog.Confirm")`；不是字符串的值，去掉 `@key`。

## DUI2010 [#dui2010]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个写法不是 <keyword> Var in Source 或 Source() 的 for / each 头部。
```

**触发位置：** `MalformedLoopHeader`

**怎么会出现**：循环头依次是关键字、循环变量、`in`、来源。来源是一个变量名（`Options`）或者一个无参函数调用（`GetOptions()`）；漏了 `in`、来源不是一个名字、调用里写了实参，都报这个码。

```dui
VerticalBox Options {
    for Option GetOptions() {
        Text { Text <- Option.Label }
    }
}
```

**怎么改**：写成 `for Option in GetOptions()`；需要参数的来源，改成一个无参函数，在函数里面去传参。

## DUI2011 [#dui2011]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个解析不成表达式的 <-、<-> 右边或者 emit 实参。
```

**触发位置：** `MalformedBindingExpression`

**怎么会出现**：右边应当是函数调用、变量、字面量或它们用运算符组合起来的式子。多出来的记号、没闭合的括号或调用、`@` 后面没有资源名、`.` 后面没有成员名、`<->` 后面不是一个变量名，都报这个码。注意没有 `/`（它属于路径和注释），也没有 `? :`。

```dui
Widget Panel {
    RenderOpacity <- Fade() *
    Shown <- (HasDetail()
}
```

**怎么改**：把表达式补完整；除法和条件选择写进一个函数，再绑定那个函数。

## DUI2012 [#dui2012]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个无法兑现的 use：文件不存在、读不出来、解析不过，或者导入形成了环。
```

**触发位置：** `ImportFailed`

**怎么会出现**：`use` 后面要么是带引号的路径，要么是类路径加 `as 名字`。路径在所有 `DUI/` 根下都找不到可读的文件、被导入的文件自己有解析错误、文件导入了自己、导入链绕回到一个正在导入的文件，都报在这一行 `use` 上。

```dui
use "UI/Libary.dui"

Widget Root { }
```

**怎么改**：检查路径的拼写和它相对的是哪个 `DUI/` 根；被导入的文件有错误时，直接编译它，看具体是什么错；有环就把共享的部分拆到第三个文件里。

## DUI2013 [#dui2013]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个嵌套深度超过 256 层的块或括号。
```

**触发位置：** `NestingTooDeep`

**怎么会出现**：递归下降的解析器碰上嵌套上千层的文件会耗尽栈，而栈溢出不是诊断，是编辑器带着作者未保存的工作一起消失。256 层远高于手写或生成的 `.dui` 会达到的深度，碰到它说明文件是坏的或者别有用心，而不仅仅是深；这一层以下的内容不会被读取。

**怎么改**：检查生成这个文件的工具；真实的界面应该把深层的结构拆成组件。

## DUI2014 [#dui2014]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个不合语法的 timeline 块或其中的一行。
```

**触发位置：** `MalformedTimeline`

**怎么会出现**：整个块共用一个码，消息会说明是哪一部分错了：头部没有名字；`external` 后面又跟了块，或者既没有块也没有 `external`；`duration`、`loop` 没有值，或者 `loop` 不是 `Once`、`Loop`、`PingPong`；轨道行缺 `:`，或者只写了节点路径没写属性；关键帧缺 `=`；时间是负数；`ease` 后面没有曲线名；`@时间` 后面没有 `->` 和事件名。

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

**怎么改**：照文档的形状写：轨道行是 `节点路径.属性 : 时间 = 值 ease 曲线名, …`，事件键是 `@0.3 -> Landed`。

## DUI2015 [#dui2015]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个 as 后面没有名字、名字是关键字，或者类路径没写 as 的 use。
```

**触发位置：** `MalformedUseDeclaration`

**怎么会出现**：`as` 后面是一个词，这个词就是完整的名字，后面不能再跟东西，保留关键字也不能拿来当名字。`use /Game/UI/WBP_Row` 这样的类路径除了类本身没有别的可带来，没有名字的话这一行什么也不做，所以必须写 `as`。

```dui
use "UI/Components/Row.dui" as
use /Game/UI/WBP_Slider

Widget Root { }
```

**怎么改**：写成 `use "UI/Components/Row.dui" as Row`、`use /Game/UI/WBP_Slider as Slider`。

## DUI2016 [#dui2016]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个不是 Type Name 或 Type Name = value 的 props 行，或者写在了节点里的 props。
```

**触发位置：** `MalformedPropsBlock`

**怎么会出现**：`props` 块每行声明一个属性：类型、名字，以及可选的 `= 默认值`，`Enum` 类型在名字前先写枚举的路径。缺名字、`=` 后面没有值、一行写了两个名字，都报这个码；`props` 声明的是这个文件的类有什么，所以它属于文件顶层，写进节点里也报这个码。

```dui
props {
    Text
    Number Count =
}

Widget Root { }
```

**怎么改**：写成 `Text Label`、`Number Count = 0`，并把 `props` 块放到文件顶层。

## DUI2017 [#dui2017]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个不是 Name 或 Name(Type Param, …) 的 events 条目，或者写在了节点里的 events。
```

**触发位置：** `MalformedEventsBlock`

**怎么会出现**：每个事件是一个名字，可以跟一个括号括起的参数列表，每个参数是类型加名字，用 `,` 分隔、`)` 结束；条目在换行或 `;` 处结束。参数缺名字、分隔符不对、条目后面还跟着别的东西，或者 `events` 写进了节点，都报这个码。

```dui
events {
    Picked(Number)
}

Widget Root { }
```

**怎么改**：写成 `Picked(Number Index)`，并把 `events` 块放到文件顶层。

## DUI2018 [#dui2018]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个缺了条件或块的 if、前面没有 if 的 else，或者一个装了控件以外东西的分支。
```

**触发位置：** `MalformedConditional`

**怎么会出现**：`if` 写在节点里面，后面是一个绑定表达式作条件，再跟 `{ … }`；`else` 后面跟块，或者跟 `if` 和新的条件。分支里只能放控件：属性、`@slot` 行、`+` 块、`slot`、循环放进去都报这个码，`if` 写在文件顶层也是。分支里的控件也不能写 `Shown <->`，因为 `Shown` 由分支决定，镜像会把它写回变量。

```dui
Widget Root {
    if HasSave() {
        RenderOpacity = 0.5
        Text Continue { Text = "Continue" }
    }
}
```

**怎么改**：把属性写到分支里的某个控件上；补全条件或块；`else` 写在 `if` 的 `}` 同一行或下一行。

## DUI2019 [#dui2019]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个写了两次 default 的 slot，或者一个既声明又填充的 slot 块。
```

**触发位置：** `MalformedSlotDeclaration`

**怎么会出现**：组件文件里的 `slot Name { … }` 是声明，块里放组件、属性和 `@slot` 行，用来布局这个洞；宿主里的 `slot Name { … }` 是填充，块里只放控件。一个块里两样都有，或者填充上写了 `default`、样式、`(was: …)`，又或者填充块里写了属性，都报这个码。

```dui
Widget Root {
    slot Footer default default
    slot Detail {
        + VerticalBox { Spacing = 15 }
        Text Note { Text = "A length of wire." }
    }
}
```

**怎么改**：声明里不放控件，填充里只放控件；`default`、样式和改名都写在声明上。

## DUI2020 [#dui2020]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个读不通的 rows 表：列清单不是属性名、某一列写了两次，或者某一行的值个数不对。
```

**触发位置：** `MalformedRows`

**怎么会出现**：表头是 `rows 类型 : 样式 (列, 列)`，列是属性名，每个只写一次（不区分大小写，因为大小写不同的两列指的是同一个属性）；每一行的值和列一一对应，用逗号分隔。少一个值说明作者漏写了什么，多一个值说明有一个值没处可去，两种都只能靠猜，所以读不通的行不产生控件。

```dui
VerticalBox Menu {
    rows Text (Text, FontSize) {
        "City Ruins", 18
        "Desert Zone"
    }
}
```

**怎么改**：让每一行的值数等于列数；某一行需要列以外的东西时，在这一行末尾加一个块。

## DUI2021 [#dui2021]

**严重级别：** 错误 (`error`)

**消息：**

```text
一行读不通的 viewmodels，或者一个写在节点里的 viewmodels 块。
```

**触发位置：** `MalformedViewModelsBlock`

**怎么会出现**：`viewmodels` 块里每行声明一个视图模型：`类型 名字`，后面可以跟 `= new`、`= global`、`= global "Name"`、`= parent` 或 `= parent "Name"`。缺名字、`=` 后面不是这几种来源之一、一行里写了第二个声明，都是这一条。`global ""` 这样的空名字也是：它什么都不指，和不写名字的"只按类找"不是一回事。块写在节点里面同样是这一条：视图模型是类持有的东西，和 `props`、`events` 一样只能写在文件顶层。

```dui
viewmodels {
    PlayerVM Player = global ""
    SettingsVM = new
}
```

**怎么改**：每行写成 `类型 名字`，再加可选的来源；只想按类从注册表里取，就只写 `global`；把块挪到文件顶层。
