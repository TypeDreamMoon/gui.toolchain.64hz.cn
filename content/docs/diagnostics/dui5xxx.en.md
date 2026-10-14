---
title: "DUI5xxx · Building the tree"
description: "Reflection refused the write, or the target object does not exist."
---

## DUI5001

`AssetNotFound`

An asset or class path that does not load.

## DUI5002

`NoVisualForProperty`

A property of a visual the node's type does not create.

## DUI5003

`NoPanelSlotForProperty`

A slot line on a node whose parent lays out no panel.

## DUI5004

`BindingFunctionNotFound`

A bound function the class does not have, or one that takes parameters.

## DUI5005

`BindingTargetHasNoSetter`

A bound property with no setter.

## DUI5006

`NotAUserWidgetClass`

A node typed by a class that is not a concrete DreamUI user widget.

## DUI5007

`LoopNotExpanded`

A loop built by a caller with nowhere to record it, and skipped (a warning).

## DUI5008

`BindingTargetNotSupported`

A binding on something no binding can name: a slot, a container, a field of a struct.

## DUI5009

`NothingToBuild`

The tree had no root; the parser said why.

## DUI5010

`EventNotFound`

`X -> …` where X is not an event of the destination.

## DUI5011

`BindingExpressionUnsupported`

An expression the compiler cannot turn into a function.

## DUI5012

`EachMisplaced`

An `each` at the root, nested, without a list view, or without exactly one template.

## DUI5013

`NodeReferenceNotFound`

A node id written as a value that names no node in the file.

## DUI5014

`LoopBodyBindingUnsupported`

An expression or a `<->` inside a loop body.

## DUI5015

`TimelineTargetNotFound`

A track path that names no node.

## DUI5016

`TimelinePropertyNotAnimatable`

A track property no animation track can drive.

## DUI5017

`UnknownEaseName`

An `ease` name the tween library does not have.

## DUI5018

`ComponentAliasUnresolved`

An alias that names no class: no `class` line and no Blueprint for the file, or a path that loads nothing.

## DUI5019

`SlotFillOutsideComponent`

`slot Name { … }` filling a slot under a node that is not a component instance.

## DUI5020

`UnknownSlotToFill`

A fill naming a slot the component does not declare.

## DUI5021

`ForMisplaced`

A `for` at the root, in another loop, in a host with fixed room, or without exactly one template.

## DUI5022

`SecondLayoutContainer`

A second layout container on one node.

## DUI5023

`MemberPathNotFound`

A member path segment its class does not have, or does not show to Blueprint (an UnrealSharp property needs `BlueprintReadOnly` or `BlueprintReadWrite`).

## DUI5024

`MemberPathThroughNonObject`

A member path that goes on past a value that is not an object.

## DUI5025

`RouteOperatorMismatch`

`+=` on a single-cast delegate, or `=` on a multicast event.
