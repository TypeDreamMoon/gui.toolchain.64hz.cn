---
title: "DUI7xxx · 写回"
description: "设计器的改动没法写回文本。"
---

## DUI7001

`PatchTargetNotFound`

一个在文件里没有归属的设计器修改：未知的节点、一个绑定的属性、一个没有块的槽。

## DUI7002

`SourceFileChangedUnderEdit`

文件在一个待处理的修改之下发生了变化；没有写入任何内容。

## DUI7003

`PatchValueNotRepresentable`

一个这门语言无法拼写的值（一个非有限数字）；它所在的行保持不变。

## DUI7004

`PatchSyntaxNotWritable`

一个对任何一行都无法拼写的东西的修改：由 `if` 决定的可见性、无法重写的简写。

## DUI7005

`PatchStyleComponentNotWritable`

一个对接点值的修改，而这个值来自样式的 `+` 行；把这一行加到节点上，或者修改样式。
