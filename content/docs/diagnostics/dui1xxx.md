---
title: "DUI1xxx · 词法"
description: "一串字符构不成任何记号。"
---

## DUI1001

`UnexpectedCharacter`

一个无法作为任何记号开头的字符。

## DUI1002

`UnterminatedString`

一个到达行尾仍没有闭合引号的字符串。

## DUI1003

`UnterminatedComment`

一个从未到达 `*/` 的 `/*`。

## DUI1004

`MalformedNumber`

一个无法读取的数字：两个小数点、一个结尾的点、粘上的单位（`24px`）。

## DUI1005

`MalformedHexColor`

一个位数不是 3、4、6 或 8 的颜色。

## DUI1006

`IdentifierTooLong`

一个比 `FName` 所能容纳的更长的名称。

## DUI1007

`AssetPathTooLong`

一个比 `FName` 所能容纳的更长的资产路径。
