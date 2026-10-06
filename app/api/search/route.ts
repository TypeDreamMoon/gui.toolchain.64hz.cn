import { source } from '@/lib/source';
import { createTokenizer } from '@orama/tokenizers/mandarin';
import type { StructuredData } from 'fumadocs-core/mdx-plugins';
import { createFromSource } from 'fumadocs-core/search/server';

export const revalidate = false;

/**
 * The member a reference table's first cell names: `UDreamTweener* RenderOffsetTo(FVector2D ...)`
 * is RenderOffsetTo, `float Alpha` is Alpha. Undefined for any other cell -- the kind, the
 * description -- and for one that names nothing.
 */
function memberName(cell: string): string | undefined {
  if (!cell.startsWith('`')) return undefined;
  const code = cell.slice(1, cell.indexOf('`', 1) > 0 ? cell.indexOf('`', 1) : undefined);
  const head = code.includes('(') ? code.slice(0, code.indexOf('(')) : code;
  return /([A-Za-z_]\w*)\s*$/.exec(head.replace(/=.*$/, ''))?.[1];
}

/**
 * A reference page's entries for the index: the introduction as it is, then one entry per section
 * listing the members its table names. Every entry is a document of its own in the index, and one
 * per member costs more than the names themselves.
 */
function referenceContents(contents: StructuredData['contents']): StructuredData['contents'] {
  const intro = contents.filter((entry) => entry.heading === undefined);
  const names = new Map<string, string[]>();
  for (const entry of contents) {
    const name = entry.heading === undefined ? undefined : memberName(entry.content);
    if (name) names.set(entry.heading!, [...(names.get(entry.heading!) ?? []), name]);
  }
  return [...intro, ...[...names].map(([heading, list]) => ({ heading, content: list.join(', ') }))];
}

export const { staticGET: GET } = createFromSource(source, {
  // The class reference is generated, English in both locales, and most of the index when indexed
  // whole: every cell of its property and function tables is an entry of its own. What anyone
  // searches it for is the member each row names, so a reference page keeps its introduction and
  // those names (memberName), and drops the signatures' types, the kinds and the descriptions.
  async buildIndex(page) {
    const data = page.data as typeof page.data & {
      structuredData?: StructuredData | (() => Promise<StructuredData>);
    };
    const structured =
      typeof data.structuredData === 'function' ? await data.structuredData() : data.structuredData;
    if (!structured) throw new Error(`${page.url} has no structured data to index`);
    return {
      id: page.url,
      url: page.url,
      title: page.data.title ?? page.url,
      description: page.data.description,
      structuredData:
        page.slugs[0] === 'reference'
          ? {
              headings: structured.headings,
              contents: referenceContents(structured.contents),
            }
          : structured,
    };
  },
  localeMap: {
    zh: {
      components: {
        tokenizer: createTokenizer(),
      },
    },
    en: 'english',
  },
  search: {
    threshold: 0,
    tolerance: 0,
  },
});
