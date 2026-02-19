# fumadocs-components

Copy-paste UI components for [Fumadocs](https://fumadocs.dev) wikis. Not an npm package — copy the components you need into your project and customize them.

These components use Fumadocs CSS variables (`fd-border`, `fd-primary`, etc.) for seamless theme integration. They work out of the box with any Fumadocs project.

## Components

### Frame

Content frame with click-to-zoom on images.

**Dependencies:** `pnpm add react-medium-image-zoom`

```tsx
import { Frame } from '@/components/frame';

<Frame caption="Screenshot of the dashboard">
  <img src="/dashboard.png" alt="Dashboard" />
</Frame>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content (images are automatically wrapped with zoom) |
| `caption` | `string` | — | Caption text below the frame |
| `className` | `string` | `''` | Additional CSS classes |

---

### Columns

Responsive CSS grid wrapper.

**Dependencies:** none

```tsx
import { Columns } from '@/components/columns';

<Columns cols={3}>
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</Columns>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Column content |
| `cols` | `number` | `2` | Number of columns |
| `className` | `string` | `''` | Additional CSS classes |

---

### Icon

Dynamic Lucide icon renderer. Pass icon names as strings (useful in MDX).

**Dependencies:** `pnpm add lucide-react`

```tsx
import { Icon } from '@/components/icon';

<Icon name="arrow-right" size={20} />
<Icon name="check-circle" color="green" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Lucide icon name (kebab-case) |
| `size` | `number` | `24` | Icon size in pixels |
| `color` | `string` | `'currentColor'` | Icon color |
| `strokeWidth` | `number` | `2` | Stroke width |
| `className` | `string` | `''` | Additional CSS classes |
| `aria-label` | `string` | — | Accessible label |

---

### Tooltip

Hover tooltip with optional call-to-action link.

**Dependencies:** none

```tsx
import { Tooltip } from '@/components/tooltip';

<Tooltip tip="This is a helpful explanation">
  hover me
</Tooltip>

<Tooltip tip="Learn more about this feature" cta="Read docs" href="/docs/feature">
  with a link
</Tooltip>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tip` | `string` | — | Tooltip text |
| `cta` | `string` | — | Call-to-action button text |
| `href` | `string` | — | CTA link URL (required if `cta` is set) |
| `children` | `ReactNode` | — | Trigger content |
| `className` | `string` | `''` | Additional CSS classes |

---

### Color

Color palette display with click-to-copy. Supports compact grid and table variants, light/dark theme-aware colors, and all CSS color formats (hex, rgb, hsl, oklch).

**Dependencies:** none

```tsx
import { Color, ColorItem, ColorRow } from '@/components/color';

{/* Compact grid */}
<Color variant="compact">
  <ColorItem name="Blue" value="#3b82f6" />
  <ColorItem name="Red" value="#ef4444" />
</Color>

{/* Table with rows */}
<Color variant="table">
  <ColorRow title="Primary">
    <ColorItem value="#3b82f6" />
    <ColorItem value="#2563eb" />
  </ColorRow>
</Color>

{/* Theme-aware */}
<ColorItem name="Background" value={{ light: '#ffffff', dark: '#0a0a0a' }} />
```

| Component | Prop | Type | Description |
|-----------|------|------|-------------|
| `Color` | `variant` | `'compact' \| 'table'` | Layout variant |
| `ColorItem` | `name` | `string` | Color label |
| `ColorItem` | `value` | `string \| { light, dark }` | CSS color value(s) |
| `ColorRow` | `title` | `string` | Row label (table variant) |

---

### Update

Changelog/update entry with sticky labels, tags, and anchor links.

**Dependencies:** none

```tsx
import { Update } from '@/components/update';

<Update label="v2.1.0" description="Jan 15, 2025" tags={["feature", "breaking"]}>
  Added dark mode support and redesigned the settings page.
</Update>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Version or date label |
| `description` | `string` | — | Subtitle text |
| `tags` | `string[]` | — | Category tags |
| `children` | `ReactNode` | — | Update content (MDX) |
| `className` | `string` | `''` | Additional CSS classes |

---

### Steps

Numbered step-by-step procedures with multiple counter styles and custom icons.

**Dependencies:** `pnpm add tailwind-merge`

**Setup:** Copy `components/steps/` and import the CSS in your layout or `mdx-components.tsx`:

```tsx
import { Steps, Step } from '@/components/steps/steps';
import '@/components/steps/styles/steps.css';

<Steps>
  <Step title="Install dependencies">
    Run `pnpm add fumadocs-core`.
  </Step>
  <Step title="Configure">
    Add the config file.
  </Step>
</Steps>

{/* Roman numerals */}
<Steps type="upper-roman">
  <Step title="First">...</Step>
</Steps>

{/* Custom icons */}
<Step title="Done" icon={<CheckIcon />}>...</Step>
```

| Component | Prop | Type | Default | Description |
|-----------|------|------|---------|-------------|
| `Steps` | `type` | `'decimal' \| 'lower-alpha' \| 'upper-alpha' \| 'lower-roman' \| 'upper-roman'` | `'decimal'` | Counter style |
| `Steps` | `titleSize` | `'p' \| 'h2' \| 'h3'` | `'p'` | Heading level for step titles |
| `Step` | `title` | `ReactNode` | — | Step title |
| `Step` | `icon` | `ReactNode` | — | Custom icon (overrides number) |

---

## MDX Registration

Register components in your `mdx-components.tsx`:

```tsx
import { Frame } from '@/components/frame';
import { Columns } from '@/components/columns';
import { Icon } from '@/components/icon';
import { Tooltip } from '@/components/tooltip';
import { Color, ColorItem, ColorRow } from '@/components/color';
import { Update } from '@/components/update';
import { Steps, Step } from '@/components/steps/steps';
import '@/components/steps/styles/steps.css';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Frame,
    Columns,
    Icon,
    Tooltip,
    Color,
    ColorItem,
    ColorRow,
    Update,
    Steps,
    Step,
    ...components,
  };
}
```

## Theming

Components use Fumadocs CSS variables with sensible fallbacks:

| Variable | Used by |
|----------|---------|
| `--color-fd-border` | Frame, Tooltip, Update, Steps |
| `--color-fd-secondary` | Frame, Update, Steps |
| `--color-fd-primary` | Tooltip, Update |
| `--color-fd-foreground` | Tooltip, Color, Steps |
| `--color-fd-muted-foreground` | Frame, Tooltip, Color, Update, Steps |
| `--color-fd-card` | Tooltip |
| `--color-fd-secondary-foreground` | Steps |

These are set automatically by `fumadocs-ui`. If using outside Fumadocs, define these variables in your CSS.

## License

MIT
