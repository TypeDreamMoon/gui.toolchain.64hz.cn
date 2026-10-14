---
title: "DUI3xxx · Meaning"
description: "Grammatical, but the tree does not hold together: a duplicate id, an unknown type."
---

## DUI3001

`DuplicateNodeId`

Two nodes share an id.

## DUI3002

`InvalidNodeId`

An id that is not an identifier, starts with a digit, or is a keyword.

## DUI3003

`UnknownNodeType`

A type that is no tag, container, alias, registered widget or path.

## DUI3004

`UnknownStyle`

`: Name` naming no style this file sees.

## DUI3005

`DuplicateStyle`

Two styles of one name in one file.

## DUI3006

`UnknownBehaviourClass`

`+ Name` naming nothing a widget can carry.

## DUI3007

`DuplicateSlotName_Retired`

Retired; two slots of one name are DUI3001.

## DUI3008

`ShadowedLoopVariable`

A loop variable that hides an enclosing loop's (a warning).

## DUI3009

`ParentRefusedChild`

A parent that will not take this child: a full content widget, a named slot filled twice.

## DUI3010

`RenameOldIdStillInUse`

`(was: X)` while X is still an id in the file.

## DUI3011

`DuplicateWasId`

Two nodes claim `(was: X)`.

## DUI3012

`SelfRename`

`(was: X)` on the node called X.

## DUI3013

`RenameGraphReferenceAmbiguous`

The old id is also another member's name, so graph references are not moved (a warning).

## DUI3014

`DuplicateResource`

Two resource entries of one name.

## DUI3015

`StyleCycle`

A style that inherits itself through its bases.

## DUI3016

`DuplicateTimeline`

Two timelines of one name.

## DUI3017

`DuplicateComponentAlias`

Two `use … as` lines give one name.

## DUI3018

`AliasShadowsBuiltIn`

A `use … as` name that is a tag or a container.

## DUI3019

`DuplicateProp`

Two `props` lines declare one name.

## DUI3020

`DuplicateEvent`

Two `events` entries of one name, or one parameter twice.

## DUI3021

`UnknownNamespace`

`ns.Name` whose `ns` no `use … as ns` declares.

## DUI3022

`MultipleDefaultSlots`

More than one `slot … default` in one file.

## DUI3023

`DuplicateRowKey`

Warning. Two rows of a `rows` table whose first values make the same id; the second's id then moves with the order.

## DUI3024

`DuplicateViewModel`

Two `viewmodels` entries of one name.
