---
title: "DUI6xxx · 编译"
description: ".dui 挂不到它的 Blueprint 上。"
---

## DUI6001

`SourceFileUnreadable`

Blueprint 的 Source File 不存在或读不出来。

## DUI6002

`EmptyTree`

文件解析通过、却没有产生任何树。

## DUI6003

`ClassPathMismatch`

`class` 行指向的是另一个 Blueprint、而不是正在编译的这个（一条警告）。

## DUI6004

`EventHandlerNotFound`

`-> Handler` 指向一个类里没有的函数。

## DUI6005

`EventHandlerSignatureMismatch`

一个参数与事件不一致的处理函数。

## DUI6006

`EachSourceNotFound`

一个类里既没有同名函数、也没有同名变量的循环来源。

## DUI6007

`EachSourceNotObjectArray`

一个不是对象数组的循环来源。

## DUI6008

`PropTypeUnknown`

一个没有对应 Blueprint 引脚类型的 `props` 或 `events` 类型。

## DUI6009

`PropNameTaken`

一个已经被另一个类型不同的成员占用、或者与某个控件 id 相同的 `props` 名字。

## DUI6010

`EmitUnknownEvent`

`emit Name` 一个这个文件没有声明的事件。

## DUI6011

`EmitArgumentMismatch`

`emit` 的实参与事件参数不一致。

## DUI6012

`EmitRouteUnsupported`

一个无法生成处理函数的 `emit`：在循环体里，或者事件的参数 Blueprint 无法承载。

## DUI6013

`PropDefaultInvalid`

一个声明的类型容纳不了的 `props` 默认值。

## DUI6014

`EventNameTaken`

一个已经被类的另一个成员占用的 `events` 名字。

## DUI6015

`ViewModelClassUnknown`

一个找不到类、或者找到不止一个的 `viewmodels` 类型。

## DUI6016

`ViewModelNameTaken`

一个已经被类的另一个成员占用的 `viewmodels` 名字。

## DUI6017

`ViewModelSourceInvalid`

对抽象类写的 `= new`。

## DUI6018

`RouteMemberFunctionNotFound`

`-> Path.Func` 的函数在对象的类上没有，或者 Blueprint 不能调用。

## DUI6019

`RouteArgumentMismatch`

`-> Path.Func` 的实参和函数对不上，或者不带括号时，函数收的不是什么都不收、也不是事件发出的那些。

## DUI6020

`TwoWayTargetReadOnly`

`<-> Path.Member` 的成员写不回去：只读，且没有 `Set<Member>`。

## DUI6021

`LoopItemMemberNotFound`

`Item.Member`，而循环来源的元素类里没有它。

## DUI6022

`LoopItemRouteMismatch`

`-> Item.Func`，而元素类里没有它，或者它的参数既不是什么都不收、也不是事件发出的那些。

## DUI6023

`SourceFileWritePending`

文档里的修改无法写入，所以拒绝编译旧文件。
