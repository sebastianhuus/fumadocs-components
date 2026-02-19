'use client';

import React, { type ComponentProps, type ReactNode } from 'react';
import { twMerge as cn } from 'tailwind-merge';

export type StepCounterType =
  | 'decimal'
  | 'lower-alpha'
  | 'upper-alpha'
  | 'lower-roman'
  | 'upper-roman';

export interface StepProps extends Omit<ComponentProps<'div'>, 'title'> {
  /**
   * The title displayed next to the step indicator
   */
  title?: ReactNode;

  /**
   * Custom icon to display instead of the step number/letter
   */
  icon?: ReactNode;

  /**
   * The step number (automatically set by Steps parent)
   * @internal
   */
  stepNumber?: number;

  /**
   * The counter type (automatically set by Steps parent)
   * @internal
   */
  counterType?: StepCounterType;

  /**
   * The heading level for the title
   * @defaultValue 'p'
   */
  titleSize?: 'p' | 'h2' | 'h3';
}

export interface StepsProps extends ComponentProps<'div'> {
  /**
   * The counter style for step indicators
   * @defaultValue 'decimal'
   */
  type?: StepCounterType;

  /**
   * Default heading level for all step titles
   * @defaultValue 'p'
   */
  titleSize?: 'p' | 'h2' | 'h3';
}

/**
 * Format a number according to the counter type
 */
function formatCounter(num: number, type: StepCounterType): string {
  switch (type) {
    case 'lower-alpha':
      return String.fromCharCode(96 + num); // a, b, c...
    case 'upper-alpha':
      return String.fromCharCode(64 + num); // A, B, C...
    case 'lower-roman':
      return toRoman(num).toLowerCase();
    case 'upper-roman':
      return toRoman(num);
    case 'decimal':
    default:
      return String(num);
  }
}

/**
 * Convert number to Roman numerals
 */
function toRoman(num: number): string {
  const romanNumerals: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];

  let result = '';
  for (const [value, symbol] of romanNumerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

export function Steps({
  children,
  type = 'decimal',
  titleSize = 'p',
  className,
  ...props
}: StepsProps) {
  return (
    <div role="list" className={cn('fes-steps', className)} {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement<StepProps>(child)) {
          return React.cloneElement(child, {
            stepNumber: child.props.stepNumber ?? index + 1,
            counterType: child.props.counterType ?? type,
            titleSize: child.props.titleSize ?? titleSize,
          });
        }
        return child;
      })}
    </div>
  );
}

export function Step({
  title,
  children,
  icon,
  stepNumber = 1,
  counterType = 'decimal',
  titleSize = 'p',
  className,
  ...props
}: StepProps) {
  const TitleTag = titleSize === 'p' ? 'p' : titleSize;
  const formattedNumber = formatCounter(stepNumber, counterType);

  return (
    <div role="listitem" className={cn('fes-step', className)} {...props}>
      <div className="fes-step-line" aria-hidden="true" />
      <div className="fes-step-indicator" aria-hidden="true">
        {icon ?? formattedNumber}
      </div>
      <div className="fes-step-content">
        {title && (
          <TitleTag className="fes-step-title">{title}</TitleTag>
        )}
        <div className="fes-step-body">{children}</div>
      </div>
    </div>
  );
}
