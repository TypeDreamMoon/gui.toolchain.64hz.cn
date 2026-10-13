---
title: "DUI6xxx · Compiling"
description: "The .dui could not be attached to its Blueprint."
---

## DUI6001

`SourceFileUnreadable`

The Blueprint's Source File does not exist or cannot be read.

## DUI6002

`EmptyTree`

The file parsed and produced no tree.

## DUI6003

`ClassPathMismatch`

The `class` line names another Blueprint than the one compiling (a warning).

## DUI6004

`EventHandlerNotFound`

`-> Handler` naming a function the class does not have.

## DUI6005

`EventHandlerSignatureMismatch`

A handler whose parameters are not the event's.

## DUI6006

`EachSourceNotFound`

A loop source the class has neither as a function nor as a variable.

## DUI6007

`EachSourceNotObjectArray`

A loop source that is not an array of objects.

## DUI6008

`PropTypeUnknown`

A `props` or `events` type with no Blueprint pin.

## DUI6009

`PropNameTaken`

A `props` name another member already has with another type, or a widget's id.

## DUI6010

`EmitUnknownEvent`

`emit Name` of an event this file does not declare.

## DUI6011

`EmitArgumentMismatch`

`emit` arguments that are not the event's parameters.

## DUI6012

`EmitRouteUnsupported`

An `emit` where no handler can be generated: in a loop body, or for an event Blueprints cannot carry.

## DUI6013

`PropDefaultInvalid`

A `props` default its type cannot hold.

## DUI6014

`EventNameTaken`

An `events` name another member of the class already answers to.

## DUI6015

`ViewModelClassUnknown`

A `viewmodels` type that names no class, or two.

## DUI6016

`ViewModelNameTaken`

A `viewmodels` name another member of the class already answers to.

## DUI6017

`ViewModelSourceInvalid`

`= new` of an abstract class.

## DUI6018

`RouteMemberFunctionNotFound`

`-> Path.Func` whose function the object's class does not have, or does not let Blueprint call.

## DUI6019

`RouteArgumentMismatch`

`-> Path.Func` whose arguments do not fit the function, or, without parentheses, whose function takes something other than nothing or what the event sends.

## DUI6020

`TwoWayTargetReadOnly`

`<-> Path.Member` whose member cannot be written back: read-only, and no `Set<Member>`.

## DUI6021

`LoopItemMemberNotFound`

`Item.Member` that the loop source's element class does not have.

## DUI6022

`LoopItemRouteMismatch`

`-> Item.Func` that the element class does not have, or whose parameters fit neither nothing nor the event.

## DUI6023

`SourceFileWritePending`

The document has edits that could not be written, so compiling the older file was refused.
