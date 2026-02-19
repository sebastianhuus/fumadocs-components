'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  tip: string;
  cta?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

const HIDE_DELAY_MS = 100;
const BRIDGE_HEIGHT_PX = 13;

export function Tooltip({
  tip,
  cta,
  href,
  children,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, HIDE_DELAY_MS);
  };

  if (cta && !href) {
    console.error('Tooltip: CTA parameter requires href prop');
    return (
      <span className="inline-flex items-center bg-yellow-50 border border-yellow-200 rounded px-2 py-1 text-xs text-yellow-800">
        <strong>Tooltip Error:</strong>&nbsp;CTA requires href
      </span>
    );
  }

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="underline decoration-dotted decoration-2 underline-offset-4 decoration-fd-muted-foreground/50 cursor-help">
        {children}
      </span>

      {isVisible && (
        <span
          className="absolute z-50 max-w-64 w-max p-3 text-sm bg-fd-card border border-fd-border rounded-lg shadow-lg"
          style={{
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
          }}
          role="tooltip"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Invisible bridge to prevent hover loss */}
          <span
            className="absolute"
            style={{
              bottom: `-${BRIDGE_HEIGHT_PX}px`,
              left: '0',
              right: '0',
              height: `${BRIDGE_HEIGHT_PX}px`,
              background: 'transparent',
            }}
            aria-hidden="true"
          />

          {/* Arrow */}
          <span
            className="absolute w-2 h-2 bg-fd-card border-r border-b border-fd-border"
            style={{
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
            }}
          />

          {/* Tooltip text */}
          <span className="block text-fd-foreground">{tip}</span>

          {/* Optional CTA link */}
          {cta && href && (
            <a
              href={href}
              className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-fd-primary hover:underline"
            >
              {cta}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          )}
        </span>
      )}
    </span>
  );
}
