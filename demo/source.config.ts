import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
// Imported from the repo root, not src/components, so it also resolves before the first `pnpm sync` (postinstall).
import { remarkLinkedSteps } from '../components/linked-steps/remark-linked-steps';

export const docs = defineDocs({ dir: 'content/docs' });

export default defineConfig({
  mdxOptions: {
    // Function form: LinkedSteps' plugin goes before the defaults (it must run before Fumadocs' heading plugin).
    remarkPlugins: (defaults) => [remarkLinkedSteps, ...defaults],
  },
});
