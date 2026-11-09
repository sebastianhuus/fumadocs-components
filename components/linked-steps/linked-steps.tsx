import React, { type ComponentProps, type ReactNode } from 'react';
import { Heading } from 'fumadocs-ui/components/heading';

export type LinkedStepCounterType =
  | 'decimal'
  | 'lower-alpha'
  | 'upper-alpha'
  | 'lower-roman'
  | 'upper-roman';

export type LinkedStepsDepth = 1 | 2 | 3 | 4 | 5 | 6;

export interface LinkedStepProps extends Omit<ComponentProps<'div'>, 'title'> {
  /**
   * The step title. Steps with a plain text title are listed in the page's table of
   * contents, and can be linked to, once `remarkLinkedSteps` is set up.
   */
  title?: ReactNode;

  /**
   * Custom icon to display instead of the step number/letter
   */
  icon?: ReactNode;

  /**
   * Anchor id of the step title. Set automatically by `remarkLinkedSteps` from the
   * title, but you can set it yourself to choose the link.
   */
  id?: string;

  /**
   * The step number (set by LinkedSteps)
   * @internal
   */
  stepNumber?: number;

  /**
   * The counter type (set by LinkedSteps)
   * @internal
   */
  counterType?: LinkedStepCounterType;

  /**
   * The heading level of the title (set by LinkedSteps)
   * @internal
   */
  depth?: LinkedStepsDepth;
}

export interface LinkedStepsProps extends ComponentProps<'div'> {
  /**
   * The counter style for step indicators
   * @defaultValue 'decimal'
   */
  type?: LinkedStepCounterType;

  /**
   * The heading level of the step titles, which is also the level they get in the
   * table of contents. Use 3 when the steps sit under an h2 section you want to keep
   * as the parent entry.
   * @defaultValue 2
   */
  depth?: LinkedStepsDepth;
}

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

function toRoman(num: number): string {
  const numerals: [number, string][] = [
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
  for (const [value, symbol] of numerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

function formatCounter(num: number, type: LinkedStepCounterType): string {
  switch (type) {
    case 'lower-alpha':
      return String.fromCharCode(96 + num);
    case 'upper-alpha':
      return String.fromCharCode(64 + num);
    case 'lower-roman':
      return toRoman(num).toLowerCase();
    case 'upper-roman':
      return toRoman(num);
    default:
      return String(num);
  }
}

export function LinkedSteps({
  children,
  type = 'decimal',
  depth = 2,
  className,
  ...props
}: LinkedStepsProps) {
  return (
    <div role="list" className={cn('fls-steps', className)} {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement<LinkedStepProps>(child)) {
          return React.cloneElement(child, {
            stepNumber: child.props.stepNumber ?? index + 1,
            counterType: child.props.counterType ?? type,
            depth: child.props.depth ?? depth,
          });
        }
        return child;
      })}
    </div>
  );
}

export function LinkedStep({
  title,
  children,
  icon,
  id,
  stepNumber = 1,
  counterType = 'decimal',
  depth = 2,
  className,
  ...props
}: LinkedStepProps) {
  return (
    <div role="listitem" className={cn('fls-step', className)} {...props}>
      <div className="fls-step-line" aria-hidden="true" />
      <div className="fls-step-indicator" aria-hidden="true">
        {icon ?? formatCounter(stepNumber, counterType)}
      </div>
      <div className="fls-step-content">
        {title && (
          // Fumadocs' own heading: the anchor target, the hover copy-link button and the
          // scroll offset behave like on every other heading. Without an id it is a plain heading.
          <Heading as={`h${depth}`} id={id} className="fls-step-title">
            {title}
          </Heading>
        )}
        <div className="fls-step-body">{children}</div>
      </div>
    </div>
  );
}
