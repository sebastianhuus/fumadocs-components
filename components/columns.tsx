import type { ReactNode } from 'react';

interface ColumnsProps {
  children: ReactNode;
  cols?: number;
  className?: string;
}

export function Columns({ children, cols = 2, className = '' }: ColumnsProps) {
  return (
    <div
      className={`grid gap-4 ${className}`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}
