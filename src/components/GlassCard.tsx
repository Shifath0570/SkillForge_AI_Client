'use client';

import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverGlow?: boolean;
}

export default function GlassCard({ children, className = '', hoverGlow = false }: GlassCardProps) {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${
        hoverGlow ? 'glass-panel-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
