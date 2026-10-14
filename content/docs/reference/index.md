---
title: "类参考"
description: "DreamGUI 每个公开类的属性、函数与事件，由反射生成，并附与 UMG 的对照。"
---

这里每一页对应一个类：它的属性（类型、分类、是否出现在细节面板、蓝图怎么读写）、可调用的函数、事件，以及页尾和对应 UMG 类的命名对照。页面由插件的 `DreamGUIReferenceDocs` commandlet 从反射打印出来，所以永远不会落后于头文件：

```powershell
UnrealEditor-Cmd.exe <project>.uproject -run=DreamGUIReferenceDocs
```

命名为什么和 UMG 一致、哪些成员刻意不同，见 [与 UMG 的命名对照](/docs/controls/umg-parity)。

## 控件 [#控件]

| | |
| --- | --- |
| [`UDreamBorder`](/docs/reference/dreamborder) | A border whose hierarchy is code, not an asset: a face, a padding, and a hole to put things in. |
| [`UDreamButton`](/docs/reference/dreambutton) | A button whose hierarchy is code, not an asset. |
| [`UDreamDialog`](/docs/reference/dreamdialog) | A dialog whose hierarchy is code, not an asset: a dimmer, a centred panel, a title, a content |
| [`UDreamDropdown`](/docs/reference/dreamdropdown) | A dropdown whose hierarchy is code, not an asset. |
| [`UDreamEditableText`](/docs/reference/dreameditabletext) | A text field with no box: UMG's EditableText, where Native.TextInput is its EditableTextBox. |
| [`UDreamExpandableArea`](/docs/reference/dreamexpandablearea) | A header that toggles, and the content it hides. |
| [`UDreamInputKeySelector`](/docs/reference/dreaminputkeyselector) | A button whose label is a bound key, and which listens for the next one when clicked. |
| [`UDreamListView`](/docs/reference/dreamlistview) | A list whose hierarchy is code, not an asset: rows built from a source, in a scrolling viewport. |
| [`UDreamListViewBase`](/docs/reference/dreamlistviewbase) | Everything a list and a tree have in common, which is nearly all of it. |
| [`UDreamMenuAnchor`](/docs/reference/dreammenuanchor) | A place a menu opens from, and the thing that puts it away again. |
| [`UDreamMultiLineEditableText`](/docs/reference/dreammultilineeditabletext) | The same field over several lines: UMG's MultiLineEditableText. |
| [`UDreamNativeWidgetHost`](/docs/reference/dreamnativewidgethost) | A hole in a DreamGUI hierarchy that a UMG widget fills. |
| [`UDreamProgressBar`](/docs/reference/dreamprogressbar) | A progress bar whose hierarchy is code, not an asset. |
| [`UDreamRadioButton`](/docs/reference/dreamradiobutton) | A radio button whose hierarchy is code, not an asset. |
| [`UDreamRichTextBlock`](/docs/reference/dreamrichtextblock) | A rich text block whose hierarchy is code, not an asset: one paragraph that reads markup. |
| [`UDreamRingMenu`](/docs/reference/dreamringmenu) | A ring menu whose hierarchy is code, not an asset: wedges around a hub, picked by direction. |
| [`UDreamScrollBar`](/docs/reference/dreamscrollbar) | A scroll bar whose hierarchy is code, not an asset. |
| [`UDreamScrollBox`](/docs/reference/dreamscrollbox) | A scroll box whose hierarchy is code, not an asset. |
| [`UDreamSlider`](/docs/reference/dreamslider) | A slider whose hierarchy is code, not an asset. |
| [`UDreamSpinBox`](/docs/reference/dreamspinbox) | A spin box whose hierarchy is code, not an asset. |
| [`UDreamTabView`](/docs/reference/dreamtabview) | A tab view whose hierarchy is code, not an asset: a strip of tabs over a switcher of pages. |
| [`UDreamTextInput`](/docs/reference/dreamtextinput) | A text field whose hierarchy is code, not an asset. |
| [`UDreamThrobber`](/docs/reference/dreamthrobber) | A throbber whose hierarchy is code, not an asset: N pieces that pulse, saying only "something is |
| [`UDreamTileView`](/docs/reference/dreamtileview) | A tile view whose hierarchy is code, not an asset: a list whose rows are laid out across as well |
| [`UDreamToggle`](/docs/reference/dreamtoggle) | A toggle whose hierarchy is code, not an asset. |
| [`UDreamTreeView`](/docs/reference/dreamtreeview) | A tree whose hierarchy is code, not an asset: a list whose rows carry an indent and a twisty. |
| [`UDreamUIControl`](/docs/reference/dreamuicontrol) | A control whose hierarchy is code, not an asset. |

## 面板与插槽 [#面板与插槽]

| | |
| --- | --- |
| [`UDreamLayoutContainerBorder`](/docs/reference/dreamlayoutcontainerborder) | UMG's UBorder: one child, padded, aligned by the BORDER rather than by the child's slot. |
| [`UDreamLayoutContainerCanvasPanel`](/docs/reference/dreamlayoutcontainercanvaspanel) | UMG Canvas Panel |
| [`UDreamLayoutContainerGridPanel`](/docs/reference/dreamlayoutcontainergridpanel) | UMG Grid Panel |
| [`UDreamLayoutContainerHorizontalBox`](/docs/reference/dreamlayoutcontainerhorizontalbox) | UMG Horizontal Box |
| [`UDreamLayoutContainerMenuAnchor`](/docs/reference/dreamlayoutcontainermenuanchor) | UMG's UMenuAnchor, layout side. |
| [`UDreamLayoutContainerOverlay`](/docs/reference/dreamlayoutcontaineroverlay) | UMG Overlay |
| [`UDreamLayoutContainerSafeZone`](/docs/reference/dreamlayoutcontainersafezone) | UMG Safe Zone |
| [`UDreamLayoutContainerScaleBox`](/docs/reference/dreamlayoutcontainerscalebox) | UMG Scale Box |
| [`UDreamLayoutContainerScrollBox`](/docs/reference/dreamlayoutcontainerscrollbox) | UMG Scroll Box |
| [`UDreamLayoutContainerSizeBox`](/docs/reference/dreamlayoutcontainersizebox) | UMG Size Box |
| [`UDreamLayoutContainerStackBox`](/docs/reference/dreamlayoutcontainerstackbox) | UMG Stack Box |
| [`UDreamLayoutContainerUniformGridPanel`](/docs/reference/dreamlayoutcontaineruniformgridpanel) | UMG Uniform Grid Panel |
| [`UDreamLayoutContainerVerticalBox`](/docs/reference/dreamlayoutcontainerverticalbox) | UMG Vertical Box |
| [`UDreamLayoutContainerWidgetSwitcher`](/docs/reference/dreamlayoutcontainerwidgetswitcher) | UMG Widget Switcher |
| [`UDreamLayoutContainerWrapBox`](/docs/reference/dreamlayoutcontainerwrapbox) | UMG Wrap Box |
| [`UDreamPanelLayoutBase`](/docs/reference/dreampanellayoutbase) | Dream Panel Layout Base |
| [`UDreamPanelSlot`](/docs/reference/dreampanelslot) | UMG-style per-child layout data owned by the child widget. |

## 控件基类与用户控件 [#控件基类与用户控件]

| | |
| --- | --- |
| [`UDreamUserWidget`](/docs/reference/dreamuserwidget) | A widget hierarchy that is a CLASS rather than an asset instance -- the counterpart to UMG's |
| [`UDreamWidget`](/docs/reference/dreamwidget) | Base class for almost all UI related things. |

## 函数库 [#函数库]

| | |
| --- | --- |
| [`UDreamLyricsLibrary`](/docs/reference/dreamlyricslibrary) | Dream Lyrics Library |
| [`UDreamTextPaintLibrary`](/docs/reference/dreamtextpaintlibrary) | Tweens that move a text's paints (FDreamTextPaint) without repainting it: each drives one of UDreamText's paint |
| [`UDreamUIAnimationLibrary`](/docs/reference/dreamuianimationlibrary) | The Blueprint-side helpers for FDreamUIAnimationHandle, which a struct cannot carry itself. |
| [`UDreamUIBPLibrary`](/docs/reference/dreamuibplibrary) | Dream UIBPLibrary |
| [`UDreamUICaptureLibrary`](/docs/reference/dreamuicapturelibrary) | Pictures of what DreamGUI draws, written out as PNG files -- a render target, a canvas that renders into one, or a |
| [`UDreamUIInputModeLibrary`](/docs/reference/dreamuiinputmodelibrary) | Input mode and cursor control, addressed by DreamGUI's user index rather than by a raw controller. |
| [`UDreamUILayoutLibrary`](/docs/reference/dreamuilayoutlibrary) | The viewport, the mouse and the screen -- this framework's UWidgetLayoutLibrary. |
| [`UDreamUIWidgetGeometryLibrary`](/docs/reference/dreamuiwidgetgeometrylibrary) | Coordinate conversions between a widget's own space, the viewport and the screen -- this |
| [`UDreamUIWidgetLibrary`](/docs/reference/dreamuiwidgetlibrary) | Finding widgets, driving a drag, and building an image brush from Blueprint -- the parts of |

## 样式 [#样式]

| | |
| --- | --- |
| [`FDreamBorderStyle`](/docs/reference/dreamborderstyle) | A border: a brush, a padding and one child. |
| [`FDreamButtonStyle`](/docs/reference/dreambuttonstyle) | A button: one face, three pointer states, a label. |
| [`FDreamDialogStyle`](/docs/reference/dreamdialogstyle) | A dialog: a dimmer over the screen, a panel on it, a title, content and buttons. |
| [`FDreamDropdownStyle`](/docs/reference/dreamdropdownstyle) | A dropdown: a button-shaped face, and the list it opens. |
| [`FDreamExpandableAreaStyle`](/docs/reference/dreamexpandableareastyle) | An expandable area: a header that toggles, and the content it hides. |
| [`FDreamInputKeySelectorStyle`](/docs/reference/dreaminputkeyselectorstyle) | A key binder: a button whose label is the bound key, and which listens when pressed. |
| [`FDreamListStyle`](/docs/reference/dreamliststyle) | A list: rows built from a source, in a scrolling viewport. |
| [`FDreamMenuAnchorStyle`](/docs/reference/dreammenuanchorstyle) | A menu anchor: the popup's look, and how it is placed against whatever opened it. |
| [`FDreamProgressBarStyle`](/docs/reference/dreamprogressbarstyle) | A progress bar: a track and the filled part of it. |
| [`FDreamRadioButtonStyle`](/docs/reference/dreamradiobuttonstyle) | A radio button: the toggle's anatomy -- a box, a mark inside it, a label beside it -- with the |
| [`FDreamRichTextStyle`](/docs/reference/dreamrichtextstyle) | A rich text block: one paragraph that reads markup. |
| [`FDreamRingMenuStyle`](/docs/reference/dreamringmenustyle) | A ring menu: wedges around a hub, and the geometry that decides where they sit. |
| [`FDreamScrollBarStyle`](/docs/reference/dreamscrollbarstyle) | A scroll box: a clipped viewport, the content that slides inside it, and the bars beside it. |
| [`FDreamScrollBoxStyle`](/docs/reference/dreamscrollboxstyle) | Dream Scroll Box Style |
| [`FDreamSliderStyle`](/docs/reference/dreamsliderstyle) | A slider: a track, the filled part of it, and the handle riding it. |
| [`FDreamSpinBoxStyle`](/docs/reference/dreamspinboxstyle) | A spin box: a numeric field between a decrement face and an increment face. |
| [`FDreamTabViewStyle`](/docs/reference/dreamtabviewstyle) | A tab view: a strip of tabs over a switcher of pages. |
| [`FDreamTextInputStyle`](/docs/reference/dreamtextinputstyle) | A text field: the box, the text in it, and the placeholder shown while there is none. |
| [`FDreamTextStyle`](/docs/reference/dreamtextstyle) | How the built-in shader draws a text's glyphs beyond the plain face: outline, underlay (drop |
| [`FDreamThrobberStyle`](/docs/reference/dreamthrobberstyle) | A throbber: N identical pieces, animating, saying only "something is happening". |
| [`FDreamTileViewStyle`](/docs/reference/dreamtileviewstyle) | A tile view: a list whose rows are a grid of tiles. |
| [`FDreamToggleStyle`](/docs/reference/dreamtogglestyle) | What a toggle looks like, separated from what it is. |
| [`FDreamTreeViewStyle`](/docs/reference/dreamtreeviewstyle) | A tree: a list whose rows carry an indent and a twisty. |
| [`FDreamUIFaceBrush`](/docs/reference/dreamuifacebrush) | An optional skin for a control part's procedural-rect face. |
| [`FDreamUIImageBrush`](/docs/reference/dreamuiimagebrush) | Dream UIImage Brush |
| [`FDreamUIStateFaces`](/docs/reference/dreamuistatefaces) | One face drawn five ways -- Slate's FButtonStyle shape, which is the thing a control style here |
| [`FDreamUIWidgetGeometry`](/docs/reference/dreamuiwidgetgeometry) | A widget's measured rect, and the handle every coordinate conversion below is asked through -- |
