---
title: "DUI2xxx · Parser"
description: "Tokens that do not form the grammar."
---

## DUI2001

`UnexpectedToken`

A token where the grammar wants something else; the message names both.

## DUI2002

`UnclosedBlock`

A `{` with no matching `}`.

## DUI2003

`UnclosedTuple`

A `(` with no matching `)`.

## DUI2004

`MissingNodeId`

A node with neither an id nor a block, or an unnamed node with `(was: …)`.

## DUI2005

`MissingPropertyValue`

A property with no `=` or arrow, or nothing after it.

## DUI2006

`MalformedRoot`

No root node in a file compiled into a class, or more than one.

## DUI2007

`MalformedClassDeclaration`

`class` twice, with an empty path, or inside a node.

## DUI2008

`MalformedWasClause`

`(was: …)` holding something other than one id.

## DUI2009

`MalformedKeyOverride`

`@key(…)` holding something other than one string, or after a value that is not a string.

## DUI2010

`MalformedLoopHeader`

A `for` / `each` header that is not `<keyword> Var in Source` or `Source()`.

## DUI2011

`MalformedBindingExpression`

The right side of `<-`, `<->` or an `emit`'s arguments that do not parse.

## DUI2012

`ImportFailed`

A `use` that could not be honoured: no such file, unreadable, does not parse, or a cycle.

## DUI2013

`NestingTooDeep`

Blocks or parentheses nested deeper than 256.

## DUI2014

`MalformedTimeline`

A `timeline` block or line that is not the grammar.

## DUI2015

`MalformedUseDeclaration`

`use … as` without a name, a keyword as the name, or a class path without `as`.

## DUI2016

`MalformedPropsBlock`

A `props` line that is not `Type Name` or `Type Name = value`, or `props` inside a node.

## DUI2017

`MalformedEventsBlock`

An `events` entry that is not `Name` or `Name(Type Param, …)`, or `events` inside a node.

## DUI2018

`MalformedConditional`

An `if` without its condition or block, an `else` with no `if`, or a branch holding something other than widgets.

## DUI2019

`MalformedSlotDeclaration`

A slot with `default` twice, or a block that both declares and fills.

## DUI2020

`MalformedRows`

A `rows` table that does not read: a column list that is not names, a column twice, a row with the wrong number of values.

## DUI2021

`MalformedViewModelsBlock`

A `viewmodels` line that is not `Type Name`, `= new`, `= global ["Name"]` or `= parent ["Name"]` (an empty `""` name included), or a `viewmodels` block inside a node.
