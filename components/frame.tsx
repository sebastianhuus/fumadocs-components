'use client';

import React, { type ReactNode } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface FrameProps {
  children: ReactNode;
  caption?: string;
  className?: string;
}

function isImageElement(child: React.ReactElement<Record<string, unknown>>): boolean {
  if (child.type === 'img') return true;
  if (child.props?.src && 'alt' in child.props) return true;
  return false;
}

function wrapImagesWithZoom(children: ReactNode): ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement<Record<string, unknown>>(child)) return child;

    if (isImageElement(child)) {
      return <Zoom zoomMargin={40}>{child}</Zoom>;
    }

    if (child.props?.children) {
      const newChildren = wrapImagesWithZoom(child.props.children as ReactNode);
      return React.cloneElement(child, {}, newChildren);
    }

    return child;
  });
}

export function Frame({ children, caption, className = '' }: FrameProps) {
  const enhancedChildren = wrapImagesWithZoom(children);

  return (
    <div className={className}>
      <div className="not-prose relative overflow-hidden rounded-2xl border border-fd-border bg-fd-secondary/50 p-2">
        <div className="relative overflow-hidden rounded-xl [&_img]:mx-auto [&_img]:block [&_img]:rounded-xl">
          {enhancedChildren}
        </div>
        {caption && (
          <p className="mt-2 pb-0.5 text-center text-sm text-fd-muted-foreground">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
