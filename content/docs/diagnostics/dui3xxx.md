---
title: "DUI3xxx · 语义"
description: "语法没错，但这棵树对不上：重复的 id、未知的类型。"
---

## DUI3001

`DuplicateNodeId`

两个节点共用一个 id。

## DUI3002

`InvalidNodeId`

一个不是标识符、以数字开头，或者是关键字的 id。

## DUI3003

`UnknownNodeType`

一个不是标签、容器、别名、已注册控件或路径的类型。

## DUI3004

`UnknownStyle`

`: Name` 指向这个文件看不到的样式。

## DUI3005

`DuplicateStyle`

同一个文件里的两个同名样式。

## DUI3006

`UnknownBehaviourClass`

`+ Name` 指向控件无法携带的东西。

## DUI3007

`DuplicateSlotName_Retired`

已退役；两个同名 slot 现在报 DUI3001。

## DUI3008

`ShadowedLoopVariable`

一个遮蔽了外层循环变量的循环变量（警告）。

## DUI3009

`ParentRefusedChild`

一个不肯接受这个子节点的父节点：已经满了的内容控件，或者被填了两次的命名 slot。

## DUI3010

`RenameOldIdStillInUse`

`(was: X)`，而 X 仍然是这个文件里的一个 id。

## DUI3011

`DuplicateWasId`

两个节点都声称 `(was: X)`。

## DUI3012

`SelfRename`

在名为 X 的节点上使用 `(was: X)`。

## DUI3013

`RenameGraphReferenceAmbiguous`

旧 id 同时也是另一个成员的名字，因此图表引用不会被迁移（警告）。

## DUI3014

`DuplicateResource`

两个同名的资源条目。

## DUI3015

`StyleCycle`

一个沿着基类链继承了自己的样式。

## DUI3016

`DuplicateTimeline`

两个同名的时间轴。

## DUI3017

`DuplicateComponentAlias`

两行 `use … as` 给出了同一个名字。

## DUI3018

`AliasShadowsBuiltIn`

一个与标签或容器同名的 `use … as` 名字。

## DUI3019

`DuplicateProp`

两行 `props` 声明了同一个名字。

## DUI3020

`DuplicateEvent`

两个同名的 `events` 条目，或者一个参数写了两次。

## DUI3021

`UnknownNamespace`

`ns.Name`，其 `ns` 没有任何 `use … as ns` 声明。

## DUI3022

`MultipleDefaultSlots`

一个文件里有不止一个 `slot … default`。

## DUI3023

`DuplicateRowKey`

警告。一个 `rows` 表的两行，其第一个值构成了相同的 id；第二行的 id 随后会随顺序移动。

## DUI3024

`DuplicateViewModel`

两个同名的 `viewmodels` 条目。
