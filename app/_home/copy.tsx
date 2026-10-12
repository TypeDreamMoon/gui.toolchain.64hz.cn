import type { Locale } from '@/lib/i18n';
import { Bug, CodeXml, FlaskConical, PanelsTopLeft, type LucideIcon } from 'lucide-react';

export type HomeVersion = readonly [label: string, value: string];
export type WorkflowStep = readonly [index: string, title: string, text: string];

/**
 * `href` is locale-neutral — sections localize it through `localizedPath`.
 */
export type ReadingRoute = readonly [title: string, text: string, href: string];

export type EcosystemItem = {
  icon: LucideIcon;
  title: string;
  text: string;
  /** Locale-neutral docs path, or an absolute url when `external`. */
  href: string;
  external?: boolean;
};

/** One span of the hero sample. A bare string is unhighlighted text. */
export type CodeToken = string | readonly [text: string, kind: TokenKind];
export type TokenKind = 'kw' | 'type' | 'fn' | 'str' | 'num' | 'prop' | 'punct';

export type HomeCopy = {
  hero: {
    kicker: string;
    title: string[];
    lead: string;
    primary: string;
    secondary: string;
    versionsLabel: string;
    artAlt: string;
    artCaption: string;
    scrollCue: string;
  };
  railLabel: string;
  slides: readonly (readonly [id: string, label: string])[];
  sample: {
    kicker: string;
    title: string;
    lead: string;
    file: string;
    result: string;
    command: string;
  };
  versions: HomeVersion[];
  workflow: {
    kicker: string;
    title: string;
    lead: string;
    steps: WorkflowStep[];
  };
  tools: {
    kicker: string;
    title: string;
    lead: string;
    items: EcosystemItem[];
  };
  docs: {
    kicker: string;
    title: string;
    lead: string;
    routes: ReadingRoute[];
  };
};

/**
 * A settings screen in `.dui`, hand-tokenized so the panel needs no highlighter at runtime.
 * It is a complete file (the parser the VS Code extension ships reads it clean); the library
 * it `use`s supplies the styles and the `Row` component.
 */
export const heroSample: readonly (readonly CodeToken[])[] = [
  [['class', 'kw'], ' ', ['/Game/UI/WBP_Settings', 'str']],
  [['use', 'kw'], ' ', ['"UI/Library.dui"', 'str'], ' ', ['as', 'kw'], ' ui'],
  [],
  [['VerticalBox', 'type'], ' Root ', [':', 'punct'], ' ', ['ui.Page', 'fn'], ' ', ['{', 'punct']],
  ['    ', ['Spacing', 'prop'], ' = ', ['24', 'num']],
  [],
  ['    ', ['Text', 'type'], ' Title ', [':', 'punct'], ' ', ['ui.Heading', 'fn'], ' ', ['{', 'punct'], ' ', ['Text', 'prop'], ' = ', ['"Settings"', 'str'], ' ', ['}', 'punct']],
  [],
  ['    ', ['rows', 'kw'], ' ', ['ui.Row', 'type'], ' ', [':', 'punct'], ' ', ['ui.Wide', 'fn'], ' ', ['(', 'punct'], ['Label', 'prop'], ', ', ['Value', 'prop'], [')', 'punct'], ' ', ['{', 'punct']],
  ['        ', ['"Subtitles"', 'str'], ',  ', ['"On"', 'str']],
  ['        ', ['"Difficulty"', 'str'], ', ', ['"Normal"', 'str']],
  ['        ', ['"Vibration"', 'str'], ',  ', ['"Off"', 'str']],
  ['    ', ['}', 'punct']],
  [],
  ['    ', ['Native.Button', 'type'], ' Apply ', ['{', 'punct']],
  ['        ', ['Text', 'type'], ' ', ['{', 'punct'], ' ', ['Text', 'prop'], ' = ', ['"Apply"', 'str'], ' ', ['}', 'punct']],
  ['        ', ['OnClicked', 'prop'], ' ', ['->', 'punct'], ' ', ['HandleApply', 'fn']],
  ['    ', ['}', 'punct']],
  [],
  ['    ', ['Text', 'type'], ' Hint ', [':', 'punct'], ' ', ['ui.Note', 'fn'], ' ', ['{', 'punct']],
  ['        ', ['Shown', 'prop'], ' ', ['<-', 'punct'], ' bDirty'],
  ['        ', ['Text', 'prop'], '  = ', ['"Unsaved changes"', 'str']],
  ['    ', ['}', 'punct']],
  [['}', 'punct']],
];

export const homeCopies: Record<Locale, HomeCopy> = {
  zh: {
    hero: {
      kicker: 'Unreal Engine 5.8 的 3D UI 系统',
      title: ['Dream', 'GUI'],
      lead: '控件是带矩形、锚点和轴心的对象，由 Canvas 合批绘制——可以铺在屏幕上，也可以以任意角度挂在关卡里，点击检测照样准确。一棵界面树就是一个可继承的 Widget Blueprint，用 .dui 文本或 UMG 风格的设计器编写，两边改的是同一个类；自带控件库、补间动画、按玩家的输入与手柄导航。',
      primary: '开始阅读',
      secondary: 'GitHub',
      versionsLabel: '当前版本',
      artAlt: 'DreamGUI 形象：一位银发少女坐在半空，指尖点向悬浮的界面面板',
      artCaption: 'DreamGUI · UI in the world',
      scrollCue: '往下看',
    },
    railLabel: '章节导航',
    slides: [
      ['overview', '概览'],
      ['sample', '长什么样'],
      ['workflow', '工作流'],
      ['tools', '工具链'],
      ['docs', '文档'],
    ],
    sample: {
      kicker: '长什么样',
      title: '一个 .dui 文件，就是一个界面类',
      lead: '下面是一整个设置页：一个库提供样式和 Row 组件，rows 一行一个实例，按钮的点击路由到用户控件上的函数，提示文字的显隐绑定到一个变量。编译后它就是一个普通的 Widget Blueprint；在设计器里改它的属性，改动会写回这份文本。',
      file: 'WBP_Settings.dui',
      result: '编译成 /Game/UI/WBP_Settings，屏幕上、关卡里都能用',
      command: 'UDreamUIBPLibrary::AddWidgetOfClassToViewport(this, WBP_Settings)',
    },
    versions: [
      ['DreamGUI', '1.0.0'],
      ['UE', '5.8'],
      ['自动化测试', '2400+'],
      ['License', 'MIT'],
    ],
    workflow: {
      kicker: '工作流',
      title: '写一棵树，放到屏幕或世界里',
      lead: '同一个类，既能是屏幕上的一层，也能是关卡里的一块面板。屏幕根、射线检测器和事件系统都按需创建，不用额外搭建。',
      steps: [
        ['01', 'Author', '用 .dui 写节点、样式、组件、视图模型、绑定、if / for 和时间轴；在设计器里改属性，改动会写回文本里那一行，两边不会分叉。'],
        ['02', 'Compile', '.dui 编译进 UDreamWidgetBlueprint，生成的类是 UDreamUserWidget：可以继承，可以嵌套进另一棵树，按名字拿到子节点。'],
        ['03', 'Place', '屏幕上一行代码加到视口；拖进关卡就是 ADreamWorldWidgetActor，可以选 DreamGUI 自己的渲染器，也可以走引擎管线吃后处理和深度。'],
        ['04', 'Interact', '每个本地玩家有自己的指针、焦点和输入目标；Tab 与手柄导航、模态与弹出层、拖放和提示都在输入模块里，动画交给补间和 timeline。'],
      ],
    },
    tools: {
      kicker: '工具链',
      title: '设计器、编辑器扩展、测试与调试',
      lead: '文本是创作面，设计器是同一份数据的另一种视图；测试和调试命令是插件的一部分，不靠肉眼。',
      items: [
        {
          icon: PanelsTopLeft,
          title: '设计器',
          text: '对照 UMG 设计器重做：按矩形拾取、悬停反馈、锚点、框选、拖拽改父节点、事件路由一键生成；.dui 类的属性改动写回文本。',
          href: '/docs/tools/designer',
        },
        {
          icon: CodeXml,
          title: 'VS Code 扩展',
          text: '.dui 的高亮、补全、悬停、跳转、诊断与格式化，诊断码和插件编译器一致。',
          href: '/docs/tools/vscode',
        },
        {
          icon: FlaskConical,
          title: '自动化测试',
          text: '插件自带两千四百多个自动化测试，按预设运行；发布门槛还会打包一个游戏跑文字冒烟测试。',
          href: '/docs/tools/tests',
        },
        {
          icon: Bug,
          title: '调试命令',
          text: 'DreamUI.Capture 截出每个画布，DreamUI.Stats 逐阶段报开销，DreamGUI.Memory 查字体和图集占用。',
          href: '/docs/tools/debugging',
        },
      ],
    },
    docs: {
      kicker: '文档',
      title: '从这里进入',
      lead: '首页负责快速定位，细节留在文档里。按你现在要做的事挑一个入口。',
      routes: [
        ['快速上手', '安装插件，把第一个 .dui 编译成界面并显示出来。', '/docs/start/installation'],
        ['核心概念', '控件与画布、屏幕与世界空间、布局、文字、渲染、输入。', '/docs/concepts/widgets'],
        ['.dui 语言', '节点、样式、组件、视图模型、绑定、if / for、rows 和时间轴。', '/docs/dui/overview'],
        ['控件库', '按钮、列表、对话框、标签页……以及与 UMG 的命名对照。', '/docs/controls'],
        ['诊断码', '每一条 DUInnnn，按流水线阶段分成七族。', '/docs/diagnostics'],
        ['更新日志', '每个版本改了什么，以及升级时要检查什么。', '/docs/changelog'],
      ],
    },
  },
  en: {
    hero: {
      kicker: 'A 3D UI system for Unreal Engine 5.8',
      title: ['Dream', 'GUI'],
      lead: 'A widget is an object with a rect, anchors and a pivot, batched by a canvas — on the screen, or standing in the level at any angle with correct hit testing either way. A UI tree is a widget Blueprint you subclass, written as .dui text or in a UMG-style designer that edits the same class. A control library, tweens, per-player input and gamepad navigation come with it.',
      primary: 'Read the docs',
      secondary: 'GitHub',
      versionsLabel: 'Current versions',
      artAlt: 'The DreamGUI character: a silver-haired girl seated mid-air, pointing at floating UI panels',
      artCaption: 'DreamGUI · UI in the world',
      scrollCue: 'Scroll',
    },
    railLabel: 'Section navigation',
    slides: [
      ['overview', 'Overview'],
      ['sample', 'The source'],
      ['workflow', 'Workflow'],
      ['tools', 'Tooling'],
      ['docs', 'Docs'],
    ],
    sample: {
      kicker: 'What it looks like',
      title: 'One .dui file is one UI class',
      lead: 'A whole settings screen: a library supplies the styles and the Row component, rows writes one instance per line, the button routes its click to a function on the user widget, and the hint is shown while a variable says so. Compiled, it is an ordinary widget Blueprint, and a property changed on it in the designer is written back into this text.',
      file: 'WBP_Settings.dui',
      result: 'compiles into /Game/UI/WBP_Settings — on the screen or in the level',
      command: 'UDreamUIBPLibrary::AddWidgetOfClassToViewport(this, WBP_Settings)',
    },
    versions: [
      ['DreamGUI', '1.0.0'],
      ['UE', '5.8'],
      ['Tests', '2400+'],
      ['License', 'MIT'],
    ],
    workflow: {
      kicker: 'Workflow',
      title: 'Write a tree, put it on the screen or in the world',
      lead: 'The same class can be a layer on the screen or a panel in the level. The screen root, the raycaster and the event system are created on demand — nothing to set up first.',
      steps: [
        ['01', 'Author', 'Write nodes, styles, components, view models, bindings, if / for and timelines in .dui; change a property in the designer and the edit lands on its line in the text, so the two never fork.'],
        ['02', 'Compile', 'A .dui compiles into a UDreamWidgetBlueprint whose class is a UDreamUserWidget: subclass it, nest it in another tree, reach its children by name.'],
        ['03', 'Place', 'One call adds it to the viewport; dragged into a level it is an ADreamWorldWidgetActor, drawn by DreamGUI\'s own renderer or sent through the engine\'s pipeline for post process and depth.'],
        ['04', 'Interact', 'Every local player has its own pointers, focus and text target; Tab and gamepad navigation, modals and popups, drag and drop and tooltips live in the input module, and motion in tweens and timelines.'],
      ],
    },
    tools: {
      kicker: 'Tooling',
      title: 'Designer, editor extension, tests, debugging',
      lead: 'The text is the authoring surface and the designer another view of the same data; the tests and the debugging commands are part of the plugin, not a matter of looking closely.',
      items: [
        {
          icon: PanelsTopLeft,
          title: 'Designer',
          text: 'Rebuilt against UMG\'s: picking by rect, hover feedback, anchors, marquee selection, drag to reparent, event routes in one click; a .dui class\'s property edits go back into the text.',
          href: '/docs/tools/designer',
        },
        {
          icon: CodeXml,
          title: 'VS Code extension',
          text: 'Highlighting, completion, hover, navigation, diagnostics and formatting for .dui, with the plugin compiler\'s own codes.',
          href: '/docs/tools/vscode',
        },
        {
          icon: FlaskConical,
          title: 'Automation suite',
          text: 'More than 2400 tests ship with the plugin, run by preset; the release gate also packages a game and runs a text smoke test in it.',
          href: '/docs/tools/tests',
        },
        {
          icon: Bug,
          title: 'Debugging commands',
          text: 'DreamUI.Capture writes every canvas to a PNG, DreamUI.Stats costs the frame stage by stage, DreamGUI.Memory says what fonts and atlases hold.',
          href: '/docs/tools/debugging',
        },
      ],
    },
    docs: {
      kicker: 'Documentation',
      title: 'Enter the docs from here',
      lead: 'The homepage is for orientation; the docs hold the full reference. Pick the entry that matches the task in front of you.',
      routes: [
        ['Getting started', 'Install the plugin, compile a first .dui and put it on the screen.', '/docs/start/installation'],
        ['Concepts', 'Widgets and canvases, screen and world space, layout, text, rendering, input.', '/docs/concepts/widgets'],
        ['The .dui language', 'Nodes, styles, components, view models, bindings, if / for, rows and timelines.', '/docs/dui/overview'],
        ['Controls', 'Buttons, lists, dialogs, tab views … and how their names map to UMG\'s.', '/docs/controls'],
        ['Diagnostics', 'Every DUInnnn code, in seven families by pipeline stage.', '/docs/diagnostics'],
        ['Changelog', 'What changed in each version, and what to check when upgrading.', '/docs/changelog'],
      ],
    },
  },
};
