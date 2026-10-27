import { BookOpen, Library, Moon, Search, Sparkles } from 'lucide-react';
import { RecentlyUpdatedList } from '@/components/recently-updated-list';

const recent = [
  { href: '/docs/onboarding', title: 'Onboarding checklist', trail: 'Team › People', meta: 'Last updated 18/10/2026 by Ada' },
  { href: '/docs/vpn', title: 'Set up the VPN', trail: 'IT', meta: 'Last updated 16/10/2026 by Grace' },
  { href: '/docs/release-process', title: 'Release process', trail: 'Engineering › Processes', meta: 'Last updated 15/10/2026 by Linus' },
  { href: '/docs/expenses', title: 'Expense policy', trail: 'Finance', meta: 'Last updated 14/10/2026 by Ada' },
  { href: '/docs/on-call', title: 'On-call handbook', trail: 'Engineering › Operations', meta: 'Last updated 13/10/2026 by Grace' },
  { href: '/docs/brand', title: 'Brand guidelines', trail: 'Marketing', meta: 'Last updated 12/10/2026 by Linus' },
];

const cards = [
  { icon: Library, tag: 'For everyone', title: 'Knowledge base', text: 'Guides, policies, tools and team info.' },
  { icon: BookOpen, tag: 'For editors', title: 'Using this wiki', text: 'How to read, edit and add to these docs.' },
];

const popular = [
  { title: 'Onboarding', trail: 'Team › People' },
  { title: 'Release process', trail: 'Engineering › Processes' },
  { title: 'Expense policy', trail: 'Finance' },
  { title: 'Brand guidelines', trail: 'Marketing' },
];

export function WikiHomeExample() {
  return (
    <div className="w-[1100px] bg-fd-background text-fd-foreground">
      <header className="flex items-center justify-between border-b border-fd-border px-8 py-4">
        <div className="flex items-center gap-2 font-semibold">
          <Sparkles className="size-5" />
          Acme Wiki
        </div>
        <div className="flex items-center gap-3 text-fd-muted-foreground">
          <div className="flex w-56 items-center gap-2 rounded-full border border-fd-border bg-fd-secondary/50 px-3 py-1.5 text-sm">
            <Search className="size-4" />
            Search
          </div>
          <Moon className="size-4" />
        </div>
      </header>

      <div className="grid grid-cols-[1fr_17rem]">
        <main className="px-10 py-12">
          <div className="text-center">
            <p className="text-sm text-fd-muted-foreground">Welcome back, Sam</p>
            <h1 className="mt-1 text-3xl font-bold">Acme Wiki</h1>
            <p className="mt-2 text-fd-muted-foreground">Internal documentation for the Acme team.</p>
          </div>

          <div className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-xl border border-fd-border bg-fd-secondary/50 px-4 py-3 text-fd-muted-foreground">
            <Search className="size-4" />
            Search
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {cards.map(({ icon: Icon, tag, title, text }) => (
              <div key={title} className="rounded-xl border border-fd-border bg-fd-card p-4">
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-lg border border-fd-border bg-fd-background">
                    <Icon className="size-4" />
                  </span>
                  <span className="rounded-full border border-fd-border px-2 py-0.5 text-xs text-fd-muted-foreground">{tag}</span>
                </div>
                <p className="mt-6 font-medium">{title}</p>
                <p className="mt-1 text-sm text-fd-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-sm font-semibold">Popular articles</h2>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3">
            {popular.map(({ title, trail }) => (
              <div key={title}>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-fd-muted-foreground">{trail}</p>
              </div>
            ))}
          </div>
        </main>

        <aside className="border-l border-fd-border px-6 py-12">
          <RecentlyUpdatedList title="Recently updated" items={recent} />
        </aside>
      </div>
    </div>
  );
}
