import { Fragment, type ReactNode } from 'react';
import { LocaleText } from './locale-text';

export type Severity = 'error' | 'warning' | 'info';

export interface DuiProps {
  /** Severity as the compiler reports it. */
  sev: Severity;
  /**
   * What the code means, as the code table states it. `{Name}` and `%s` are
   * substitutions the real message carries, and are de-emphasised, never
   * rewritten.
   */
  msg: string;
  /** The enum name the code has in `EDreamUIDiagnosticCode`, e.g. `MalformedRows`. */
  raised?: string;
}

const SEVERITY_LABEL: Record<Severity, { zh: string; en: string }> = {
  error: { zh: '错误', en: 'error' },
  warning: { zh: '警告', en: 'warning' },
  info: { zh: '提示', en: 'info' },
};

/** Splits the format string into plain runs and printf-placeholder runs. */
function renderMessage(msg: string): ReactNode {
  return msg.split(/(%[0-9]*[a-zA-Z]|\{[^{}]*\})/g).map((part, index) => {
    if (part.length === 0) {
      return null;
    }

    if (part.startsWith('%') || (part.startsWith('{') && part.endsWith('}'))) {
      return (
        <span className="dgui-ph" key={index}>
          {part}
        </span>
      );
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}

/**
 * The generated half of one diagnostic: severity, what the code means, and its
 * name in the code table. Written under a `## DUInnnn` heading so the code
 * itself carries the anchor and the table of contents entry.
 *
 * ```mdx
 * ## DUI1002
 *
 * <Dui sev="error" msg={"A string literal that reaches end of line …"} raised="UnterminatedString" />
 * ```
 */
export function Dui({ sev, msg, raised }: DuiProps) {
  const label = SEVERITY_LABEL[sev] ?? SEVERITY_LABEL.error;

  return (
    <div className="dgui-entry">
      <p className="dgui-entry-head">
        <span className={`dgui-sev dgui-sev-${sev}`}>
          <LocaleText en={label.en} zh={label.zh} />
        </span>
        {raised ? (
          <span className="dgui-entry-raised">
            <LocaleText en="code name" zh="枚举名" />
            {raised.split(',').map((site) => (
              <code key={site.trim()}>{site.trim()}</code>
            ))}
          </span>
        ) : null}
      </p>

      <p className="dgui-entry-msg">{renderMessage(msg)}</p>
    </div>
  );
}

export interface SevProps {
  children?: ReactNode;
  /** Severity to colour the pill with. */
  s: Severity;
}

/** Inline severity pill, for tables and prose. */
export function Sev({ s, children }: SevProps) {
  const label = SEVERITY_LABEL[s] ?? SEVERITY_LABEL.error;

  return (
    <span className={`dgui-sev dgui-sev-${s}`}>
      {children ?? <LocaleText en={label.en} zh={label.zh} />}
    </span>
  );
}
