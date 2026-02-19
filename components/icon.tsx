'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  'aria-label'?: string;
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export function Icon({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  'aria-label': ariaLabel,
}: IconProps) {
  const pascalName = toPascalCase(name);
  const IconComponent = (LucideIcons as any)[pascalName] as LucideIcons.LucideIcon | undefined;

  if (!IconComponent) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Icon] "${name}" not found in lucide-react. See https://lucide.dev/icons`);
    }
    const Fallback = LucideIcons.HelpCircle;
    return <Fallback size={size} className={`inline align-text-bottom ${className}`} aria-label={`Icon "${name}" not found`} />;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={`inline align-text-bottom ${className}`}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
    />
  );
}
