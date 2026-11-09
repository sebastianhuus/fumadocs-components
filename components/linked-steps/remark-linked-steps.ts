/**
 * fumadocs-components — LinkedSteps
 *
 * Remark plugin that lists the titles of `<LinkedStep>`s in the page's table of contents.
 *
 * A step title is a JSX attribute (`<LinkedStep title="Install">`). Fumadocs builds the
 * table of contents from markdown headings when the page is compiled, so it never sees
 * attributes. For every `LinkedStep` with a plain text `title` inside a `LinkedSteps`,
 * this plugin:
 *
 *   - sets the step's `id` to a slug of the title (`Install pnpm` -> `install-pnpm`),
 *     adding `-2`, `-3`... when a heading or an earlier step already uses it
 *   - adds a heading to the step that Fumadocs lists in the table of contents and then
 *     removes from the page (the `[toc]` tag), with that id as its anchor
 *
 * The heading level comes from `<LinkedSteps depth={n}>` and is 2 by default.
 *
 * Setup in source.config.ts. This plugin must run BEFORE Fumadocs' own heading plugin,
 * which is part of the default plugins, so it needs the function form and goes first.
 * Add your own plugins AFTER the defaults, as other plugins can break when they run first.
 *
 *   mdxOptions: { remarkPlugins: (defaults) => [remarkLinkedSteps, ...defaults, yourPlugin] }
 */

interface Attribute {
  type: string;
  name?: string;
  value?: unknown;
}

interface Node {
  type: string;
  name?: string | null;
  value?: string;
  depth?: number;
  attributes?: Attribute[];
  children?: Node[];
}

const STEPS = 'LinkedSteps';
const STEP = 'LinkedStep';
const DEFAULT_DEPTH = 2;

// The same custom anchor syntax Fumadocs' heading plugin understands: `Title [#my-id]`.
const CUSTOM_ID = /\s*\[#(?<id>[^\]]+?)]\s*$/;

function textOf(node: Node): string {
  if (typeof node.value === 'string') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

/** Close to what github-slugger does to heading text. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s+/g, '-');
}

function attributeOf(node: Node, name: string): Attribute | undefined {
  return node.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
}

/** `depth="3"` or `depth={3}`; anything else is the default. */
function depthOf(node: Node): number {
  const raw = attributeOf(node, 'depth')?.value;
  const text =
    typeof raw === 'string'
      ? raw
      : raw && typeof raw === 'object' && 'value' in raw
        ? String((raw as { value: unknown }).value)
        : '';
  const depth = Number.parseInt(text, 10);
  return depth >= 1 && depth <= 6 ? depth : DEFAULT_DEPTH;
}

/**
 * The ids Fumadocs will give the page's own headings. They are worked out the same way
 * (in document order, custom `[#id]` anchors skipped) so a step never takes one of them.
 */
function collectHeadingIds(root: Node): Set<string> {
  const ids = new Set<string>();
  const occurrences = new Map<string, number>();

  const visit = (node: Node): void => {
    if (node.type === 'heading') {
      const last = node.children?.at(-1);
      const custom = last?.type === 'text' ? CUSTOM_ID.exec(last.value ?? '')?.groups?.id : undefined;
      if (custom) {
        ids.add(custom);
      } else {
        const base = slugify(textOf(node));
        let id = base;
        while (occurrences.has(id)) {
          const next = (occurrences.get(base) ?? 0) + 1;
          occurrences.set(base, next);
          id = `${base}-${next}`;
        }
        occurrences.set(id, 0);
        ids.add(id);
      }
      return;
    }
    for (const child of node.children ?? []) visit(child);
  };

  visit(root);
  return ids;
}

export function remarkLinkedSteps() {
  return (tree: Node) => {
    const taken = collectHeadingIds(tree);

    const visit = (node: Node): void => {
      if (node.type === 'mdxJsxFlowElement' && node.name === STEPS) {
        const depth = depthOf(node);

        for (const step of node.children ?? []) {
          if (step.type !== 'mdxJsxFlowElement' || step.name !== STEP) continue;

          // Only plain text titles. `title={<b>Hi</b>}` has no text to put in the contents.
          const title = attributeOf(step, 'title');
          if (!title || typeof title.value !== 'string' || !title.value.trim()) continue;

          const existing = attributeOf(step, 'id');
          let id = typeof existing?.value === 'string' ? existing.value : '';
          if (!id) {
            const base = slugify(title.value) || 'step';
            id = base;
            for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
            step.attributes = [...(step.attributes ?? []), { type: 'mdxJsxAttribute', name: 'id', value: id }];
          }
          taken.add(id);

          step.children = [
            {
              type: 'heading',
              depth,
              children: [{ type: 'text', value: `${title.value} [toc] [#${id}]` }],
            },
            ...(step.children ?? []),
          ];
        }
      }
      for (const child of node.children ?? []) visit(child);
    };

    visit(tree);
  };
}
