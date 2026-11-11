---
title: "DUI2xxx · 语法"
description: "记号拼不成语法。"
---

## DUI2001

`UnexpectedToken`

一个出现在语法需要别的东西的位置上的记号；消息会同时指出两者。

## DUI2002

`UnclosedBlock`

一个没有匹配 `}` 的 `{`。

## DUI2003

`UnclosedTuple`

一个没有匹配 `)` 的 `(`。

## DUI2004

`MissingNodeId`

一个既没有 id 也没有块的节点，或者一个带着 `(was: …)` 却没有名字的节点。

## DUI2005

`MissingPropertyValue`

一个没有 `=` 或箭头、或者后面什么都没有的属性。

## DUI2006

`MalformedRoot`

一个被编译成类的文件中没有根节点，或者有不止一个根节点。

## DUI2007

`MalformedClassDeclaration`

`class` 写了两次、路径为空，或者写在节点里面。

## DUI2008

`MalformedWasClause`

`(was: …)` 里装的不是恰好一个 id。

## DUI2009

`MalformedKeyOverride`

`@key(…)` 里装的不是恰好一个字符串，或者跟在一个不是字符串的值后面。

## DUI2010

`MalformedLoopHeader`

一个不是 `<keyword> Var in Source` 或 `Source()` 的 `for` / `each` 头部。

## DUI2011

`MalformedBindingExpression`

`<-`、`<->` 的右侧，或者一个 `emit` 的参数解析不成表达式。

## DUI2012

`ImportFailed`

一个无法兑现的 `use`：没有这个文件、读不出来、解析不过，或者形成了环。

## DUI2013

`NestingTooDeep`

嵌套深度超过 256 层的块或括号。

## DUI2014

`MalformedTimeline`

一个不合语法的 `timeline` 块或行。

## DUI2015

`MalformedUseDeclaration`

`use … as` 没有名字、名字是关键字，或者类路径没有写 `as`。

## DUI2016

`MalformedPropsBlock`

一行不是 `Type Name` 或 `Type Name = value` 的 `props`，或者写在节点里的 `props`。

## DUI2017

`MalformedEventsBlock`

一个不是 `Name` 或 `Name(Type Param, …)` 的 `events` 条目，或者写在节点里的 `events`。

## DUI2018

`MalformedConditional`

一个缺少条件或块的 `if`、一个没有 `if` 的 `else`，或者一个装了控件以外东西的分支。

## DUI2019

`MalformedSlotDeclaration`

一个 slot 写了两次 `default`，或者一个既声明又填充的块：声明包含组件、属性、slot 行和 `@tag` 行，而填充只包含 widget（连同旁边的一行 `@tag` 也算）。

## DUI2020

`MalformedRows`

一个读不通的 `rows` 表：列清单不是名称、某一列写了两次、某一行的值个数不对。

## DUI2021

`MalformedViewModelsBlock`

一行不是 `Type Name`、`= new`、`= global ["Name"]` 或 `= parent ["Name"]` 的 `viewmodels`（包括空的 `""` 名称），或者写在节点里的 `viewmodels` 块。

## DUI2022

`MalformedTextAnnotation`

`@note(…)` 里不是一个字符串、`@max(…)` 里不是一个不小于 1 的整数、它们跟在不是字符串的值后面、同一个注解写了两次，或者 `@noloc` 和 `@key`、`@note`、`@max` 写在一起。

## DUI2023

`MalformedContainer`

读不通的列表（`[a, b]`）或 Map（`{ key: value }`）：括号没有闭合、两个元素之间缺逗号，或者 Map 的一项不是 `key: value`。struct 的第一项可以不带键。

## DUI2024

`MalformedTag`

无法解析的 `@tag` 行：`@tag` 之后没有任何内容，或是一个数字或一个字符串，两个名称之间没有逗号，或末尾有逗号。还包括位于 `style` 中的 `@tag` 行，或直接位于 `for` / `each` 主体中。
