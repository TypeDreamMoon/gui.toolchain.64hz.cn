---
title: "DUI5xxx · 构建"
description: "反射拒绝了写入，或者目标对象不存在。"
---

## DUI5001

`AssetNotFound`

一个无法加载的资产或类路径。

## DUI5002

`NoVisualForProperty`

一个属于该节点类型不会创建的视觉元素的属性。

## DUI5003

`NoPanelSlotForProperty`

一行 slot 写在了一个其父节点不布局任何面板的节点上。

## DUI5004

`BindingFunctionNotFound`

一个该类没有的绑定函数，或者一个带参数的绑定函数。

## DUI5005

`BindingTargetHasNoSetter`

一个没有 setter 的绑定属性。

## DUI5006

`NotAUserWidgetClass`

一个由并非具体 DreamUI 用户控件的类所标注的节点。

## DUI5007

`LoopNotExpanded`

一个由调用方构建、却无处记录的循环，已被跳过（一条警告）。

## DUI5008

`BindingTargetNotSupported`

落在任何绑定都无法指名的东西上的绑定：一个面板槽、一个容器、结构体的一个字段。

## DUI5009

`NothingToBuild`

树没有根节点；解析器已说明原因。

## DUI5010

`EventNotFound`

`X -> …`，其中 X 不是目标上的事件。

## DUI5011

`BindingExpressionUnsupported`

编译器无法转成函数的表达式。

## DUI5012

`EachMisplaced`

一个位于根上、嵌套在循环里、没有列表视图，或模板不是恰好一个的 `each`。

## DUI5013

`NodeReferenceNotFound`

一个作为值写下、却没有指向文件里任何节点的节点 id。

## DUI5014

`LoopBodyBindingUnsupported`

循环体里的一个表达式或一个 `<->`。

## DUI5015

`TimelineTargetNotFound`

一条没有指向任何节点的轨道路径。

## DUI5016

`TimelinePropertyNotAnimatable`

一个没有任何动画轨道能驱动的轨道属性。

## DUI5017

`UnknownEaseName`

缓动库里没有的一个 `ease` 名称。

## DUI5018

`ComponentAliasUnresolved`

一个没有指向任何类的别名：文件既没有 `class` 行也没有 Blueprint 用它，或者路径什么也加载不出来。

## DUI5019

`SlotFillOutsideComponent`

`slot Name { … }` 填充一个位于并非组件实例的节点下的槽。

## DUI5020

`UnknownSlotToFill`

一个指向组件未声明槽的填充。

## DUI5021

`ForMisplaced`

一个位于根上、在另一个循环里、在容量固定的宿主里，或模板不是恰好一个的 `for`。

## DUI5022

`SecondLayoutContainer`

一个节点上的第二个布局容器。

## DUI5023

`MemberPathNotFound`

成员路径里的某一段，在它所在的类上不存在，或者 Blueprint 看不到（UnrealSharp 属性需要 `BlueprintReadOnly` 或 `BlueprintReadWrite`）。

## DUI5024

`MemberPathThroughNonObject`

一条越过非对象的值继续往下走的成员路径。

## DUI5025

`RouteOperatorMismatch`

单播委托上的 `+=`，或者多播事件上的 `=`。
