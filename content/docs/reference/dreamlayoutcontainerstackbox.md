---
title: "UDreamLayoutContainerStackBox"
description: "UMG Stack Box"
---

**提示：**

本页由 `DreamGUIReferenceDocs` commandlet 从反射生成，正文是头文件注释的原文（英文），所以不翻译——这样它永远和代码一致。概念讲解见[核心概念](/docs/concepts/widgets)。



Inherits from [UDreamPanelLayoutBase](/docs/reference/dreampanellayoutbase).

Declared in `Public/Core/Components/DreamPanelLayouts.h`.

UMG Stack Box

## Properties [#properties]

| Name | Type | Category | In the details panel | From Blueprint | Description |
|---|---|---|---|---|---|
| `Orientation` | `EDreamPanelOrientation` | StackBox | yes | `SetOrientation` |  |
| `Padding` | `FMargin` | StackBox | yes | `SetPadding` |  |
| `Spacing` | `float` | StackBox | yes | `SetSpacing` |  |

## Functions [#functions]

| Function | Kind | Description |
|---|---|---|
| `void SetOrientation(EDreamPanelOrientation Value)` | callable | Set Orientation |
| `void SetPadding(FMargin Value)` | callable | Set Padding |
| `void SetSpacing(float Value)` | callable | Set Spacing |

## Compared with UMG [#compared-with-umg]

Every Blueprint-facing member of the UMG class, and where it went. *adopt*: same name, same meaning. *map*: here under another name or on another type. *reject*: deliberately absent, with the reason.

| UMG | Member | Status | Here | Note |
|---|---|---|---|---|
| `UStackBox` | `Orientation` | adopt | `Orientation` | EDreamPanelOrientation rather than Slate's EOrientation, so the .dui text and the details panel spell the same two words the rest of this plugin does. |
| `UStackBox` | `AddChildToStackBox` | map | `AddChild` | One slot class here means one verb; AddChild returns the slot. |
| `UStackBox` | `ReplaceStackBoxChildAt` | map | `ReplaceChildAt` | On the panel base, so every panel has it. |
