'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export default function Skeleton({ className = '', variant = 'rect' }: SkeletonProps) {
  const getShapeClass = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-full rounded';
      case 'circle':
        return 'h-12 w-12 rounded-full';
      case 'rect':
      default:
        return 'h-32 w-full rounded-xl';
    }
  };

  return <div className={`shimmer ${getShapeClass()} ${className}`} />;
}
