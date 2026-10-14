---
title: "DUI5xxx · 构建"
description: "反射拒绝了写入，或者目标对象不存在。"
---

# DUI5xxx · 构建 [#dui5xxx]

本页由 `scripts/diagnostics/sync.py` 从插件的码表（`EDreamUIDiagnosticCode`）生成，卡片里的枚举名就是测试断言用的那个名字。

## DUI5001 [#dui5001]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个加载不出来的资产或类路径。
```

**触发位置：** `AssetNotFound`

**怎么会出现**：节点类型或属性值写的资产路径加载失败：路径拼错、资产被移动或删除，或者它所在的插件没有启用。

```dui
Widget Root {
    /Game/UI/WBP_Rwo Audio { }
}
```

**怎么改**：在内容浏览器里复制资产的路径重新写上；资产挪过位置的话，把路径一起更新。

## DUI5002 [#dui5002]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个属于视觉对象、而节点的类型并不创建那个视觉对象的属性。
```

**触发位置：** `NoVisualForProperty`

**怎么会出现**：属性名在控件上找不到，却是某个标签的视觉对象的属性，比如在 `Widget` 上写 `FontSize`，而它属于 `Text` 节点创建的文本视觉对象。消息会说出哪个标签有它，通常改一个词就好。

```dui
Widget Title {
    FontSize = 14
}
```

**怎么改**：把节点类型改成消息里点名的那个标签（这里是 `Text Title`），或者把这一行移到那样的节点上。

## DUI5003 [#dui5003]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个父节点不布局面板、却写了 slot 行的节点。
```

**触发位置：** `NoPanelSlotForProperty`

**怎么会出现**：`@slot`、`@fill` 设置的是面板 slot，也就是父节点的容器怎样摆放这个子节点。父节点没有布局容器（普通的 `Widget`），或者节点就是根，就没有面板 slot 可写；样式带来的 slot 行也算。

```dui
Widget Root {
    Text Label {
        @slot Padding = (0, 4, 0, 4)
    }
}
```

**怎么改**：给父节点一个布局容器（写成 `VerticalBox Root` 或加 `+ VerticalBox { }`），或者删掉这些 slot 行，改用 `AnchorData` 定位。

## DUI5004 [#dui5004]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个类里没有的绑定函数，或者一个带参数的绑定函数。
```

**触发位置：** `BindingFunctionNotFound`

**怎么会出现**：`Text <- GetTitle()` 这样只调一个函数的绑定会直接绑定那个函数，它必须是这个 Blueprint（或它的父类）上的函数，不带参数，返回值是被绑定属性的类型。函数名超出 `FName` 长度也报这个码。

```dui
Text Title {
    Text <- GetTitel()
}
```

**怎么改**：修正函数名，或者在 Blueprint 里加上这个函数；需要参数时，写一个无参函数在里面传参。

## DUI5005 [#dui5005]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个没有 setter 的被绑定属性。
```

**触发位置：** `BindingTargetHasNoSetter`

**怎么会出现**：绑定在运行时通过属性的 setter 写入：名字是 `Set` 加属性名（布尔属性去掉前缀 `b`，`bUseKerning` 对应 `SetUseKerning`），只有一个参数、没有返回值。找不到这样的函数，这个属性就驱动不了。组件自己的 `props` 是唯一的例外：它们是 Blueprint 变量，没有 setter，但可以用 `<-` 单向绑定。

**怎么改**：改为在一个函数里设置它；属性是你自己的 C++ 类上的话，给它加一个符合这个形状的 setter。

## DUI5006 [#dui5006]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个以不是具体 DreamUI 用户控件的类作类型的节点。
```

**触发位置：** `NotAUserWidgetClass`

**怎么会出现**：以类作类型的节点（别名、`@Name`、注册标签、资产路径）是一个组件实例，它的内容来自那个类，所以类必须是 `UDreamUserWidget` 的子类，而且不能是抽象的或已弃用的。指向贴图、普通 UMG 控件或其他资产都会报这个码。

```dui
Widget Root {
    /Game/UI/T_Icon Icon { }
}
```

**怎么改**：资产当作值写到属性上（比如 `Image` 的 `Brush.ResourceObject`）；节点类型只用 DreamGUI 控件 Blueprint 或原生的 DreamUI 用户控件类。

## DUI5007 [#dui5007]

**严重级别：** 警告 (`warning`)

**消息：**

```text
一个调用方没有地方记录、因而被跳过的循环（警告）。
```

**触发位置：** `LoopNotExpanded`

**怎么会出现**：`for` 和 `each` 会被记录成编译后的循环绑定，构建控件树时需要调用方提供记录它们的地方。编译 Blueprint 时总会提供；直接拿 AST 构建树的调用方（多数测试、自己写的 C++ 工具）可能没有提供，这时循环和它下面的一切被跳过，文件其余部分照常构建。

**怎么改**：通过 Blueprint 编译这个文件；自己调用构建器时，给它一个记录循环绑定的地方。

## DUI5008 [#dui5008]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个落在任何绑定都无法指名的东西上的绑定：面板 slot、布局容器，或者结构体里的字段。
```

**触发位置：** `BindingTargetNotSupported`

**怎么会出现**：绑定能指名的目标只有控件本身、它的视觉对象和它的行为（`EDreamWidgetBindingTarget`），而且只能是完整的属性。`@slot` 属性、容器类型节点上属于容器的属性、`AnchorData.SizeDelta` 这样的结构体字段，不管有没有 setter 都没有地方可记录。和 DUI5005 分开，正是因为补一个 setter 在这里没用。

```dui
VerticalBox Column {
    Spacing <- GetGap()
    AnchorData.SizeDelta <- GetSize()
}
```

**怎么改**：绑定整个属性（比如一个 `FVector2D` 属性），或者在 Blueprint 的函数里设置这些值。

## DUI5009 [#dui5009]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个没有根节点、因而无从构建的树。
```

**触发位置：** `NothingToBuild`

**怎么会出现**：交给构建器的 AST 里没有根节点。原因解析器已经报过了（通常是 DUI2006），这一条只说明结果。

**怎么改**：先处理同一次编译里更早的那条诊断。

## DUI5010 [#dui5010]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个 X -> …，而 X 不是目标上的事件。
```

**触发位置：** `EventNotFound`

**怎么会出现**：`->` 左边要是控件、它的视觉对象或行为上的事件：一个 `BlueprintAssignable` 动态多播委托，或者一个可编辑的 `DreamUIEventDelegate`。名字指向的是普通属性、指向结构体里的某个路径，或者在这些对象上都找不到，就报这个码；处理函数名超出 `FName` 长度也是。

```dui
Text Title {
    OnClick -> HandleClick
}
```

**怎么改**：把路由写到拥有这个事件的地方，比如按钮行为的块里：`+ UIButton { OnClick -> HandleClick }`。

## DUI5011 [#dui5011]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个编译器无法转成函数的表达式。
```

**触发位置：** `BindingExpressionUnsupported`

**怎么会出现**：比单纯调用一个函数更复杂的 `<-` 表达式会被编译成一个生成的 Blueprint 函数。名字既不是这个类的变量也不是函数（按上一次编译后的类查找）、实参个数不对、函数没有返回值、运算符在这两种操作数类型之间没有定义、类型之间没有转换、在表达式里用了不是 `Number` 或 `String` 的资源，或者在循环体里读了不止一层的成员（`Item.A.B`），都报这个码；消息会说明是哪一种。

```dui
Widget Panel {
    RenderOpacity <- Fadee() * 0.8
    Shown <- GetName() * 2
}
```

**怎么改**：修正表达式；逻辑复杂时写进一个真正的函数，然后绑定那个函数。

## DUI5012 [#dui5012]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个放错了地方的 each：在根上、嵌套在另一个循环里、宿主没有列表视图，或者循环体不是恰好一个模板控件。
```

**触发位置：** `EachMisplaced`

**怎么会出现**：`each` 填充它所在控件的列表视图，所以宿主需要 `+ UIListView`（或可回收的滚动视图）；它不能是根，不能写在另一个 `for` / `each` 里；循环体恰好是一个控件，即每一项重复的那个模板。

```dui
Widget Inventory {
    each Item in GetItems() {
        Text Cell { Text <- Item.Name }
    }
}
```

**怎么改**：给宿主加 `+ UIListView { }`；多个控件包进一个容器；嵌套的列表写成一个组件，内层循环写在组件自己的文件里。

## DUI5013 [#dui5013]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个作为值写下、却没有指向文件里任何节点的节点 id。
```

**触发位置：** `NodeReferenceNotFound`

**怎么会出现**：持有控件、视觉对象或行为的属性可以写一个节点 id，表示文件里的那个节点；这个 id 不存在时报这个码，消息会给出最接近的 id。节点存在但不是属性要的那种东西，报的是 DUI4003。

```dui
Widget Confirm {
    + UIButton { TransitionTarget = Bakground }
    Image Background { }
}
```

**怎么改**：修正 id，或者先声明那个节点。

## DUI5014 [#dui5014]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个写在循环体里的表达式或 <->，或者一条通往别的对象的路由。
```

**触发位置：** `LoopBodyBindingUnsupported`

**怎么会出现**：生成的绑定函数是类的函数，而循环体里的名字只有每一次迭代才知道，所以循环体里只支持两种按格逐个记录的写法：单跳的 `Item.Member` 绑定，和调用这一项自己函数的路由——`Event -> Item.Func`（把事件发出的东西交给它）或 `Event -> Item.Func()`（什么都不传）。更复杂的表达式和 `<->` 以前会被悄悄丢掉：文件编译通过，属性却从来没有被驱动。路由到 `Settings.Apply()` 这样的别的对象、走两段以上（`Item.Owner.Use`）、或者带实参，也是这一条。表达式本身没问题，问题在位置，所以它不是 DUI5011。

```dui
VerticalBox Options {
    for Option in GetOptions() {
        Text { Text <- Option.Label + "!" }
    }
}
```

**怎么改**：把逻辑放到每一项自己的类上（让它提供一个现成的成员），或者把绑定写到循环外面。

## DUI5015 [#dui5015]

**严重级别：** 错误 (`error`)

**消息：**

```text
一条路径没有指向任何节点的轨道。
```

**触发位置：** `TimelineTargetNotFound`

**怎么会出现**：轨道行的路径是一串节点 id（`Row/Title`），和动画绑定解析时用的显示名路径相同；文件的树上没有这条路径时报这个码。节点存在但没有那个属性，报的是 DUI5016。

```dui
timeline Pulse {
    duration = 0.6
    Iocn.RenderScale : 0.0 = (1, 1, 1), 0.3 = (1.25, 1.25, 1)
}

Widget Root {
    Image Icon
}
```

**怎么改**：修正路径里的 id；不写路径的轨道驱动的是动画所在的控件本身。

## DUI5016 [#dui5016]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个没有任何动画轨道能驱动的轨道属性。
```

**触发位置：** `TimelinePropertyNotAnimatable`

**怎么会出现**：属性在节点、它的视觉对象和行为上都不存在；或者它没有标记 `Interp`（动画编辑器也不会提供它）；或者它的类型没有轨道：时间轴驱动数字、二到四分量的向量和颜色，其他类型属于 `external` 时间轴。

```dui
timeline Swap {
    Title.Text : 0.0 = "A", 1.0 = "B"
}

Widget Root {
    Text Title
}
```

**怎么改**：换一个动画编辑器里能看到的属性；其他类型的动画放进一个 `external` 时间轴，在 Sequencer 里编辑。

## DUI5017 [#dui5017]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个缓动库里没有的 ease 名字。
```

**触发位置：** `UnknownEaseName`

**怎么会出现**：曲线名取自 `EDreamTweenEase`（`Linear`、`InOutQuad`、`OutCubic`、`OutBack` 等），只去掉了 `CurveFloat`，因为它指向一个资产，而时间轴的关键帧没有地方放资产。

```dui
timeline Pulse {
    Icon.RenderScale : 0.0 = (1, 1, 1), 0.3 = (1.25, 1.25, 1) ease InOutQuadratic
}

Widget Root {
    Image Icon
}
```

**怎么改**：换成 `EDreamTweenEase` 里的名字，比如 `InOutQuad`。

## DUI5018 [#dui5018]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个没有指向任何类的组件别名：文件既没有 class 行也没有 Blueprint 用它，或者路径什么也加载不出来。
```

**触发位置：** `ComponentAliasUnresolved`

**怎么会出现**：`use "…" as Row` 指名的是那个文件编译成的类：它的 `class` 行写的那个，或者把它当 Source File 的那个 Blueprint。文件没有 `class` 行、也还没有 Blueprint 用它；没有编辑器可问（比如在 commandlet 里）；`class` 行指向的 Blueprint 还不存在；或者 `use /Game/… as` 的路径加载不出类，都报这个码。

```dui
use "UI/Components/Row.dui" as Row

VerticalBox Root {
    Row Audio { Label = "Audio" }
}
```

**怎么改**：给组件文件加一行 `class`，或者先把它编译进一个 Blueprint；类路径的话，修正路径。

## DUI5019 [#dui5019]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个写在非组件实例下、用来填充 slot 的 slot Name { … }。
```

**触发位置：** `SlotFillOutsideComponent`

**怎么会出现**：带控件的 `slot Name { … }` 是在填充组件的命名 slot，只能写在组件实例里面；写在根上，或写在普通控件、容器里面，就没有 slot 可填。

```dui
VerticalBox Page {
    slot Detail {
        Text Note { Text = "A length of wire." }
    }
}
```

**怎么改**：把内容直接嵌套进去；如果你是在写组件、想声明一个 slot，就写 `slot Detail`，不带控件。

## DUI5020 [#dui5020]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个指向组件没有声明的 slot 的填充。
```

**触发位置：** `UnknownSlotToFill`

**怎么会出现**：组件实例里的 `slot Name { … }` 要填的 slot 必须是那个组件声明过的；消息会列出它实际有哪些 slot。

```dui
ListPage Page_2 {
    slot Detials {
        Text Note { Text = "A length of wire." }
    }
}
```

**怎么改**：修正 slot 名；嵌套而不写 slot 名的内容会进入组件的默认 slot。

## DUI5021 [#dui5021]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个放错了地方的 for：在根上、在另一个循环里、在容量固定的宿主里，或者循环体不是恰好一个模板。
```

**触发位置：** `ForMisplaced`

**怎么会出现**：`for` 在它所在的控件里为每一项复制一份模板，所以宿主必须能放任意多个子节点：`SizeBox` 这类只放一个子节点的不行。它不能是根，不能写在另一个 `for` / `each` 里，循环体恰好是一个控件。

```dui
SizeBox Box {
    for Option in GetOptions() {
        Text { Text <- Option.Label }
    }
}
```

**怎么改**：在里面放一个 `VerticalBox` 之类的容器，把 `for` 写进容器；多个控件包进一个容器；嵌套的重复写成一个组件，内层循环写在组件自己的文件里，列表通过它的 `props` 传进去。

## DUI5022 [#dui5022]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个节点上的第二个布局容器。
```

**触发位置：** `SecondLayoutContainer`

**怎么会出现**：一个控件只用一种方式排列它的子节点。节点类型本身已经是容器（`VerticalBox Column`），又写了 `+ HorizontalBox`；或者它自己的 `+` 行和样式的 `+` 行各带来一个容器。以前第二个会一声不响地替换掉第一个，连同它的值一起。

```dui
VerticalBox Column {
    + HorizontalBox { Spacing = 8 }
}
```

**怎么改**：容器的属性直接写在节点上；需要另一种排列，就嵌套一个子控件。

## DUI5023 [#dui5023]

**严重级别：** 错误 (`error`)

**消息：**

```text
成员路径里的某一段，在它所在的类上找不到，或者 Blueprint 看不到。
```

**触发位置：** `MemberPathNotFound`

**怎么会出现**：`Player.Name` 这样的路径从类的一个变量开始——`viewmodels` 条目、prop 或者 Blueprint 变量（以上一次编译为准）——后面每一段都是前一段所持对象的类上的成员。某一段不存在，或者存在但图表够不着——属性不是 `BlueprintReadOnly` / `BlueprintReadWrite`，函数不是 `BlueprintCallable` / `BlueprintPure`——就是这一条，消息会点出是哪一段、在哪个类上。UnrealSharp 的属性只有在 `[UProperty]` 写了 `BlueprintReadOnly` 或 `BlueprintReadWrite` 时才算 Blueprint 可见。

```dui
viewmodels {
    PlayerVM Player
}

VerticalBox Root {
    Text Name { Text <- Player.Nmae }
}
```

**怎么改**：修正成员名；C++ 的属性加上 `BlueprintReadOnly`，函数加上 `BlueprintCallable` 或 `BlueprintPure`。

## DUI5024 [#dui5024]

**严重级别：** 错误 (`error`)

**消息：**

```text
一条越过非对象的值继续往下走的成员路径。
```

**触发位置：** `MemberPathThroughNonObject`

**怎么会出现**：路径的每一段都从前一段持有的**对象**上读。`Player.Health.Max` 里 `Health` 是一个 float，它上面没有可读的成员。结构体也一样：路径只穿过对象引用。

```dui
viewmodels {
    PlayerVM Player
}

VerticalBox Root {
    Text Hp { Text <- Player.Health.Max }
}
```

**怎么改**：让路径停在值那里；需要的派生值由视图模型作为一个成员提供（比如 `MaxHealth`）。

## DUI5025 [#dui5025]

**严重级别：** 错误 (`error`)

**消息：**

```text
事件接不住的路由运算符：单播委托上的 +=，或者多播事件上的 =。
```

**触发位置：** `RouteOperatorMismatch`

**怎么会出现**：`+=` 是在其他监听者旁边再加一个，所以只能用在能装多个监听者的事件上（`BlueprintAssignable` 多播委托、`DreamUIEventDelegate`）；`=` 是成为事件唯一的监听者，只能用在单播委托上——用在多播事件上，就得扔掉控件自己和 Blueprint 图表接上去的监听者。`->` 按事件的种类二者都行，永远不会是这一条。报了这一条的路由不会被记录：换一种方式接上，做的就不是这一行写的事了。

```dui
VerticalBox Root {
    Native.Button Apply { OnClicked = HandleApply }
}
```

**怎么改**：多播事件用 `+=`，单播委托用 `=`；或者两种都写 `->`。
