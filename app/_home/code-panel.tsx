import { CornerDownRight } from 'lucide-react';
import { heroSample } from './copy';

/**
 * The sample band's source: a complete `.dui` file, tokenized
 * by hand so the panel needs no highlighter at runtime. Line numbers come from
 * a CSS counter, so nothing here is selectable noise when the reader copies it.
 */
export function CodePanel({ file, result }: { file: string; result: string }) {
  return (
    <figure className="dgui-code-panel">
      <figcaption className="dgui-code-head">
        <span className="dgui-code-file">{file}</span>
        <span className="dgui-code-lang">DreamUI</span>
      </figcaption>

      <pre className="dgui-code-body">
        <code>
          {heroSample.map((line, index) => (
            // eslint-disable-next-line react/no-array-index-key -- lines have no id
            <span className="dgui-code-line" key={index}>
              {line.map((token, at) =>
                typeof token === 'string' ? (
                  <span key={at}>{token}</span>
                ) : (
                  <span className={`dgui-t-${token[1]}`} key={at}>
                    {token[0]}
                  </span>
                ),
              )}
            </span>
          ))}
        </code>
      </pre>

      <p className="dgui-code-foot">
        <CornerDownRight aria-hidden="true" />
        {result}
      </p>
    </figure>
  );
}
