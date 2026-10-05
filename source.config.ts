import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import duiGrammar from './lib/dui.tmLanguage.json';

export const docs = defineDocs({
  dir: 'content/docs',
});

/**
 * ```dui fences are highlighted with the grammar the VS Code extension ships
 * (lib/dui.tmLanguage.json, copied from dreamui-language-support/syntaxes), so the
 * docs colour a file exactly as the editor does.
 *
 * Lazy loading only ever loads the bundled languages, so a grammar of our own is
 * loaded by turning it off and naming every language the content uses: one the
 * list lacks fails the build with "Language `x` not found", which is the cue to
 * add it here. `text` needs no grammar.
 */
export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      lazy: false,
      langs: [
        { ...duiGrammar, name: 'dui', aliases: ['dreamui'] } as never,
        'cpp',
        'powershell',
        'bash',
        'ini',
        'json',
        'python',
        'ts',
        'tsx',
        'js',
        'yaml',
        'csharp',
      ],
    },
  },
});
