---
title: "DUI4xxx · 取值"
description: "值和它写在的属性对不上。"
---

# DUI4xxx · 取值 [#dui4xxx]

本页由 `scripts/diagnostics/sync.py` 从插件的码表（`EDreamUIDiagnosticCode`）生成，卡片里的枚举名就是测试断言用的那个名字。

## DUI4001 [#dui4001]

**严重级别：** 错误 (`error`)

**消息：**

```text
目标对象上没有这个名字的属性；消息会给出最接近的那个。
```

**触发位置：** `UnknownProperty`

**怎么会出现**：裸的属性名依次在控件、它的视觉对象、（容器类型的节点上）它的布局容器、它的行为上查找，第一个有它的接收这个值，都没有就报这个码。`Width`、`Height`、`AnchorLeft` 这类细节面板上显示的标签不是属性名，消息会直接告诉你该怎么写。

```dui
Text Title {
    FontSzie = 14
    Width = 400
}
```

**怎么改**：照建议改名；尺寸写 `AnchorData.SizeDelta = (w, h)`，锚点写 `AnchorData.AnchorMin` 和 `AnchorData.AnchorMax`。

## DUI4002 [#dui4002]

**严重级别：** 错误 (`error`)

**消息：**

```text
一条开头能解析、后面解析不了的带点路径。
```

**触发位置：** `UnknownPropertyPathSegment`

**怎么会出现**：`A.B` 里 `A` 是一个属性，但它不是结构体，没有字段可以往下走；或者它是结构体，却没有叫 `B` 的字段，这时消息会给出最接近的字段名。

```dui
Widget Panel {
    AnchorData.Size = (400, 240)
}
```

**怎么改**：照建议修正字段名，比如 `AnchorData.SizeDelta`。

## DUI4003 [#dui4003]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个形状不可能成为该属性类型的值。
```

**触发位置：** `ValueTypeMismatch`

**怎么会出现**：字面量的种类与属性的类型对不上，比如给数字属性写字符串、给 `FText` 写没加引号的词；资产路径加载出来的不是属性要的类；当作值写的节点 id 指向的节点缺少属性要的那一部分（比如没有视觉对象），或者是另一种控件类；`FName` 属性的字符串超长；时间轴的关键帧值读不成那个属性的类型。

```dui
Text Title {
    FontSize = "large"
    Text = Settings
}
```

**怎么改**：按属性的类型写值：文本一律加引号，对象属性写能加载出正确类的路径。

## DUI4004 [#dui4004]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个元素个数不对的元组。
```

**触发位置：** `TupleArityMismatch`

**怎么会出现**：元组按目标结构体读：二维向量 2 个，三维向量和旋转 3 个，边距 4 个。

```dui
Widget Panel {
    AnchorData.SizeDelta = (400, 240, 0)
}
```

**怎么改**：按结构体的分量个数写，比如 `(400, 240)`、`(0, 8, 0, 0)`。

## DUI4005 [#dui4005]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个属性的枚举没有声明的词。
```

**触发位置：** `UnknownEnumValue`

**怎么会出现**：枚举属性上写的词不是这个枚举的值（消息会给出最接近的那个），或者写的数字不对应它声明的任何值。标志位枚举没有 `|`，组合要写成各标志相加后的数字。

```dui
Widget Panel {
    Visibility = Invisible
}
```

**怎么改**：照建议改成枚举里的值，比如 `Collapsed` 或 `Hidden`。

## DUI4006 [#dui4006]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个文本写不了的属性：瞬态的、已弃用的、属于对象图的，或者是委托。
```

**触发位置：** `PropertyNotWritable`

**怎么会出现**：属性存在，但从 `.dui` 写它没有意义：瞬态属性（没有原生 setter 的那种）写进去的值保存不下来；已弃用的属性不再接受新值；`Visual`、`LayoutContainer` 这类实例化引用本身就是对象图，由嵌套和 `+` 来创作，而不是赋值；委托没有文本形式，事件要用 `->` 路由。

```dui
Widget Panel {
    LayoutContainer = None
}
```

**怎么改**：容器用 `+ VerticalBox { … }` 或容器类型的节点来写，事件用 `->`；其余情况换一个可以写的属性。

## DUI4007 [#dui4007]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个没有指向任何资源条目的 @Name。
```

**触发位置：** `UnknownResource`

**怎么会出现**：`@Accent` 代表 `resources` 块里叫 `Accent` 的那个条目（本文件的，或 `use` 带进来的）；找不到就报这个码。用 `@Name` 写节点类型时也一样，它要求一个 `Asset` 条目。

```dui
resources {
    Color Accent = #FF6600
}

Text Note {
    Color = @Accnet
}
```

**怎么改**：修正名字，或者在 `resources` 块里声明这个条目。

## DUI4008 [#dui4008]

**严重级别：** 错误 (`error`)

**消息：**

```text
一个值与声明的类型不符的资源，或者一个被当作节点类型、却不是 Asset 的资源。
```

**触发位置：** `ResourceTypeMismatch`

**怎么会出现**：资源的类型是 `Color`、`Number`、`Vector2`、`String`、`Asset` 之一，值要符合它声明的类型；类型名不是这五个之一也报这个码。用 `@Name` 当节点类型时，那个条目必须是指向控件类的 `Asset`。

```dui
resources {
    Color Accent = 8
}

Text Note { Color = @Accent }
```

**怎么改**：让值符合类型（`Color Accent = #FF6600`），或者改正声明的类型。
