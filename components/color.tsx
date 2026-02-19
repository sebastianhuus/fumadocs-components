'use client';

import React from 'react';

interface ColorValue {
  light: string;
  dark: string;
}

interface ColorItemProps {
  name?: string;
  value: string | ColorValue;
  children?: never;
  _isTableVariant?: boolean;
}

interface ColorRowProps {
  title?: string;
  children: React.ReactNode;
}

interface ColorProps {
  variant: 'compact' | 'table';
  children: React.ReactNode;
}

function getContrastColor(color: string): string {
  color = color.trim().toLowerCase();

  let r = 0, g = 0, b = 0;
  let hasParsed = false;

  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
      hasParsed = true;
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
      hasParsed = true;
    }
  } else if (color.startsWith('rgb')) {
    const match = color.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    if (match) {
      r = parseInt(match[1]);
      g = parseInt(match[2]);
      b = parseInt(match[3]);
      hasParsed = true;
    }
  } else if (color.startsWith('oklch')) {
    const match = color.match(/oklch\(([\d.]+)%?/);
    if (match) {
      const l = parseFloat(match[1]);
      const isLight = color.includes('%') ? l > 60 : l > 0.6;
      return isLight ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    }
  } else if (color.startsWith('hsl')) {
    const match = color.match(/hsla?\([^,]+,[^,]+,[\s]*([\d.]+)%?/);
    const matchSpace = color.match(/hsla?\([^\s]+\s+[^\s]+\s+([\d.]+)%?/);
    const finalMatch = match || matchSpace;
    if (finalMatch) {
      const l = parseFloat(finalMatch[1]);
      return l > 60 ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    }
  }

  if (!hasParsed) {
    return 'rgb(255, 255, 255)';
  }

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
}

function ColorItem({ name, value, _isTableVariant = false }: ColorItemProps) {
  const [copied, setCopied] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [resolvedColor, setResolvedColor] = React.useState<string | null>(null);

  const isThemeAware = typeof value === 'object' && 'light' in value && 'dark' in value;
  const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setCurrentTheme(isDark ? 'dark' : 'light');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setCurrentTheme(isDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const displayValue = isThemeAware ? (value as ColorValue)[currentTheme] : (value as string);
  const copyValue = isThemeAware
    ? `light: ${(value as ColorValue).light}, dark: ${(value as ColorValue).dark}`
    : (value as string);

  React.useEffect(() => {
    if (buttonRef.current) {
      const computedStyle = window.getComputedStyle(buttonRef.current);
      setResolvedColor(computedStyle.backgroundColor);
    }
  }, [displayValue, currentTheme]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const textColor = getContrastColor(resolvedColor || displayValue);

  const checkmarkSvg = (
    <svg
      className={`w-3.5 h-auto absolute inset-0 m-auto pointer-events-none transition-opacity duration-100 ${copied ? 'opacity-100' : 'opacity-0'} [filter:drop-shadow(0_0_2px_rgb(0_0_0_/_0.1))_drop-shadow(0_0_4px_rgb(0_0_0_/_0.1))]`}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      aria-label="Check"
      style={{ color: textColor }}
    >
      <path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z" />
    </svg>
  );

  if (_isTableVariant) {
    return (
      <div className="w-full max-w-[50px] md:max-w-[60px]">
        <button
          ref={buttonRef}
          className="cursor-copy relative flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 aspect-square w-full md:h-10"
          aria-label={name || displayValue}
          aria-pressed={copied}
          onClick={handleCopy}
          style={{ backgroundColor: displayValue }}
        >
          {checkmarkSvg}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 shrink-0">
      <button
        ref={buttonRef}
        className="cursor-copy relative flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 max-h-[104px] aspect-square"
        aria-label={name || displayValue}
        aria-pressed={copied}
        onClick={handleCopy}
        style={{ backgroundColor: displayValue }}
      >
        {checkmarkSvg}
      </button>
      <div className="flex flex-col gap-0.5 min-w-0 w-[104px]">
        {name && (
          <p
            className="font-medium text-fd-foreground m-0 truncate text-center text-sm"
            title={name}
          >
            {name}
          </p>
        )}
        <p
          className="text-fd-muted-foreground m-0 truncate font-mono text-center text-xs"
          title={displayValue}
        >
          {displayValue}
        </p>
      </div>
    </div>
  );
}

function ColorRow({ title, children }: ColorRowProps) {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<ColorItemProps>, {
        _isTableVariant: true,
      });
    }
    return child;
  });

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      {title && (
        <div className="md:w-[120px] w-full shrink-0">
          <p
            className="text-sm font-medium tracking-tight text-fd-foreground m-0 truncate"
            title={title}
          >
            {title}
          </p>
        </div>
      )}
      <div className="flex w-full gap-1 md:gap-2">
        {childrenWithProps}
      </div>
    </div>
  );
}

export function Color({ variant, children }: ColorProps) {
  if (variant === 'table') {
    return (
      <div className="flex flex-col gap-6 not-prose my-6">
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-wrap gap-x-2 gap-y-4 not-prose my-6">
      {children}
    </div>
  );
}

Color.Item = ColorItem;
Color.Row = ColorRow;

export { ColorItem, ColorRow };
