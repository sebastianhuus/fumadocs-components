import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Frame } from '@/components/frame';
import { RecentlyUpdatedDemo } from '@/demo/recently-updated-demo';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Frame,
    // RecentlyUpdatedList itself is not registered; this is a wrapper with fixed data.
    RecentlyUpdatedDemo,
    ...components,
  };
}
