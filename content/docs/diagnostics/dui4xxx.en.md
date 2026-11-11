---
title: "DUI4xxx · Values"
description: "A value that does not fit the property it is written on."
---

## DUI4001

`UnknownProperty`

No property of that name; the nearest one is suggested. `@slot Size <- …` is one: `Size` is a shorthand for two properties, and a binding names `MinDesiredSize` and `MaxDesiredSize` separately.

## DUI4002

`UnknownPropertyPathSegment`

A dotted path whose head resolves and whose tail does not, or a struct's field map naming a field the struct does not have.

## DUI4003

`ValueTypeMismatch`

A value whose shape cannot be the property's type.

## DUI4004

`TupleArityMismatch`

A tuple with the wrong number of elements.

## DUI4005

`UnknownEnumValue`

A word the property's enum does not declare.

## DUI4006

`PropertyNotWritable`

A property text cannot write: transient, deprecated, part of the object graph, a delegate.

## DUI4007

`UnknownResource`

`@Name` naming no resource entry.

## DUI4008

`ResourceTypeMismatch`

A resource whose value is not its declared type, or a non-`Asset` resource used as a node type.

## DUI4009

`ContainerTypeMismatch`

A list on a property that is not an array or a set, a map on one that is not a map, a single value on a container, or a set or map of nodes (only an array can hold node ids). A map entry with no key, on a real map or on a struct with no primary field, is one too.
