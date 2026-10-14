---
title: "DUI1xxx · Lexer"
description: "A character sequence that is not a token."
---

## DUI1001

`UnexpectedCharacter`

A character that cannot begin any token.

## DUI1002

`UnterminatedString`

A string that reaches the end of its line without its closing quote.

## DUI1003

`UnterminatedComment`

A `/*` that never reaches `*/`.

## DUI1004

`MalformedNumber`

A number that cannot be read: two decimal points, a trailing dot, a unit glued on (`24px`).

## DUI1005

`MalformedHexColor`

A colour whose digit count is not 3, 4, 6 or 8.

## DUI1006

`IdentifierTooLong`

A name longer than an `FName` holds.

## DUI1007

`AssetPathTooLong`

An asset path longer than an `FName` holds.
