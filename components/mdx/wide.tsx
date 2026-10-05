import type { ReactNode } from 'react';

export interface WideProps {
  /** A markdown table, or any block that is wider than the content column. */
  children?: ReactNode;
}

/**
 * Gives a too-wide table its own horizontal scroll container, so the page body never scrolls
 * sideways. The scroll behaviour, the sticky header row and the "there is more to the right"
 * shadow all live in the stylesheet under `.dgui-wide` — this component only draws the boundary.
 */
export function Wide({ children }: WideProps) {
  return <div className="dgui-wide">{children}</div>;
}
