import Link from 'next/link';
import type { ReactNode } from 'react';

export interface RecentlyUpdatedItem {
  href: string;
  title: ReactNode;
  /** Small line under the title, e.g. the section the page lives in. */
  trail?: ReactNode;
  /** Line under that, e.g. "Last updated 12 Oct by Ada". */
  meta?: ReactNode;
}

interface RecentlyUpdatedListProps {
  items: RecentlyUpdatedItem[];
  /** Heading above the list. Leave out for no heading. */
  title?: ReactNode;
  className?: string;
}

/**
 * Layout and styling for a list of recently changed pages. It holds no state and
 * fetches nothing: every piece of text comes in through `items`, so it works in
 * server and client components alike.
 */
export function RecentlyUpdatedList({ items, title, className }: RecentlyUpdatedListProps) {
  if (items.length === 0) return null;

  return (
    <div className={className}>
      {title && <h2 className="text-sm font-semibold mb-3">{title}</h2>}
      <ul className="flex flex-col gap-3">
        {items.map(({ href, title, trail, meta }) => (
          <li key={href}>
            <Link href={href} className="text-sm font-medium hover:underline">
              {title}
            </Link>
            {trail && <p className="text-xs text-fd-muted-foreground">{trail}</p>}
            {meta && <div className="text-sm text-fd-muted-foreground">{meta}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
