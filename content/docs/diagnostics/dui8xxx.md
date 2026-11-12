---
title: "DUI8xxx · 布局"
description: "编译后的界面在某个视口尺寸下布局出了问题。只来自 DreamMCP 的 layout 和 preview。"
---

## DUI8001

`LayoutOffScreen`

节点能显示的部分越过视口边缘，或完全位于视口之外。

## DUI8002

`LayoutTextOverflow`

被溢出策略截断的文本，或布局超出其框的文本。

## DUI8003

`LayoutTooSmall`

绘制或可按下但尺寸为零的节点，或小于 24 x 24 px 的可按下控件。

## DUI8004

`LayoutOverlappingControls`

同一画布上相互重叠的两个可按下控件。

## DUI8005

`LayoutNearlyAligned`

同级节点的边缘、中心或间距相差 1 到 3 px 而未对齐（信息）。

## DUI8006

`LayoutBreaksAtSize`

在所要求的其他视口尺寸之一上出现布局问题，而在第一个尺寸上没有出现。

## DUI8007

`LayoutLowContrast`

文本与背后内容的对比度低于 3 比 1（仅预览）。
