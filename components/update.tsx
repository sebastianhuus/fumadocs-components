'use client';

import React, { type ReactNode } from 'react';

interface UpdateProps {
  label: string;
  description?: string;
  tags?: string[];
  children: ReactNode;
  className?: string;
  rss?: {
    title?: string;
    description?: string;
  };
}

export function Update({
  label,
  description,
  tags,
  children,
  className = '',
}: UpdateProps) {
  const updateId = `${label}${description ? `-${description}` : ''}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const handleLabelClick = () => {
    const el = document.getElementById(updateId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${updateId}`);
    }
  };

  return (
    <div
      className={`flex flex-col relative items-start w-full lg:flex-row gap-2 lg:gap-6 py-8 border-b border-fd-border last:border-b-0 ${className}`}
      id={updateId}
    >
      {/* Left column - Label, description, tags */}
      <div className="lg:sticky top-20 flex flex-col w-full lg:w-[160px] items-start shrink-0 lg:self-start">
        <button
          type="button"
          className="cursor-pointer px-2 py-1 rounded-lg text-sm font-medium bg-fd-primary/10 text-fd-primary"
          onClick={handleLabelClick}
        >
          {label}
        </button>

        {description && (
          <div className="px-1 text-fd-muted-foreground mt-3 text-sm max-w-[160px] break-words">
            {description}
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 max-w-[160px]">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium bg-fd-secondary text-fd-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right column - Content */}
      <div className="flex-1 max-w-full prose prose-sm dark:prose-invert [&>:first-child]:mt-0">
        {children}
      </div>
    </div>
  );
}
