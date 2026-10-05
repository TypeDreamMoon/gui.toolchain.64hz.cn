import type { HomeLayoutProps } from 'fumadocs-ui/layouts/home';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import type { Locale } from './i18n';
import { localizedPath } from './i18n';
import { GITHUB_URL, VSCODE_EXTENSION_URL } from './site';

function DreamGUITitle() {
  return (
    <span className="dgui-brand" aria-label="DreamGUI">
      <span className="dgui-brand-text">DreamGUI</span>
    </span>
  );
}

export function baseOptions(locale: Locale = 'zh'): BaseLayoutProps {
  return {
    nav: {
      title: <DreamGUITitle />,
      url: localizedPath(locale, '/'),
    },
  };
}

/**
 * Props for the marketing (non-docs) layout, shared by both locale routes.
 */
export function homeOptions(locale: Locale): HomeLayoutProps {
  const options = baseOptions(locale);

  return {
    ...options,
    githubUrl: GITHUB_URL,
    links: [
      {
        text: 'Docs',
        url: localizedPath(locale, '/docs'),
        active: 'nested-url',
      },
      {
        text: '.dui',
        url: localizedPath(locale, '/docs/dui/overview'),
        active: 'nested-url',
      },
      {
        text: 'Controls',
        url: localizedPath(locale, '/docs/controls'),
        active: 'nested-url',
      },
      {
        text: 'Reference',
        url: localizedPath(locale, '/docs/reference'),
        active: 'nested-url',
      },
      {
        text: 'Diagnostics',
        url: localizedPath(locale, '/docs/diagnostics'),
        active: 'nested-url',
      },
      {
        text: 'ChangeLog',
        url: localizedPath(locale, '/docs/changelog'),
        active: 'nested-url',
      },
      {
        text: 'VSCode',
        url: VSCODE_EXTENSION_URL,
        external: true,
      },
    ],
    nav: {
      ...options.nav,
      transparentMode: 'top',
    },
    className: 'dgui-home',
  };
}
