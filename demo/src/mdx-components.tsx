import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Frame } from '@/components/frame';
import { Columns } from '@/components/columns';
import { RecentlyUpdatedDemo } from '@/demo/recently-updated-demo';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Frame,
    Columns,
    // RecentlyUpdatedList itself is not registered; this is a wrapper with fixed data.
    RecentlyUpdatedDemo,
    ...components,
  };
}
