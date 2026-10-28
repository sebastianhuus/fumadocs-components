import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Frame } from '@/components/frame';
import { Columns } from '@/components/columns';
import { Icon } from '@/components/icon';
import { Tooltip } from '@/components/tooltip';
import { Color, ColorItem, ColorRow } from '@/components/color';
import { Update } from '@/components/update';
import { Steps, Step } from '@/components/steps/steps';
import '@/components/steps/styles/steps.css';
import { RecentlyUpdatedDemo } from '@/demo/recently-updated-demo';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Frame,
    Steps,
    Step,
    Update,
    Color,
    ColorItem,
    ColorRow,
    Tooltip,
    Icon,
    Columns,
    // RecentlyUpdatedList itself is not registered; this is a wrapper with fixed data.
    RecentlyUpdatedDemo,
    ...components,
  };
}
