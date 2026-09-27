import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({ children, className, noPadding = false }: { children: React.ReactNode; className?: string, noPadding?: boolean }) {
  return (
    <div className={cn("bg-white border-2 border-brand-dark shadow-[4px_4px_0px_0px_rgba(23,23,23,1)]", !noPadding && "p-6", className)}>
      {children}
    </div>
  );
}

export function Button({ children, className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'danger' }) {
  const base = "font-bold uppercase tracking-wider text-sm transition-all border-2 border-brand-dark px-6 py-3";
  const variants = {
    primary: "bg-brand-forest text-white shadow-[2px_2px_0px_0px_rgba(23,23,23,1)] hover:shadow-[4px_4px_0px_0px_rgba(23,23,23,1)] hover:-translate-y-[2px] hover:-translate-x-[2px]",
    outline: "bg-white text-brand-dark shadow-[2px_2px_0px_0px_rgba(23,23,23,1)] hover:shadow-[4px_4px_0px_0px_rgba(23,23,23,1)] hover:-translate-y-[2px] hover:-translate-x-[2px]",
    danger: "bg-brand-critical text-white shadow-[2px_2px_0px_0px_rgba(23,23,23,1)] hover:shadow-[4px_4px_0px_0px_rgba(23,23,23,1)] hover:-translate-y-[2px] hover:-translate-x-[2px]"
  };
  
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function Badge({ children, variant = 'neutral', className }: { children: React.ReactNode, variant?: 'neutral' | 'success' | 'warning' | 'critical', className?: string }) {
  const variants = {
    neutral: "bg-gray-200 text-gray-800 border-gray-800",
    success: "bg-brand-forest text-white border-brand-dark",
    warning: "bg-brand-warning text-black border-brand-dark",
    critical: "bg-brand-critical text-white border-brand-dark"
  };
  return (
    <span className={cn("px-2 py-1 text-xs font-bold uppercase tracking-wider border-2 inline-block", variants[variant], className)}>
      {children}
    </span>
  );
}

export function RiskBadge({ risk }: { risk: string }) {
  let variant: 'neutral' | 'success' | 'warning' | 'critical' = 'neutral';
  if (risk === 'Sangat Minim Risiko' || risk === 'Minim Risiko') variant = 'success';
  if (risk === 'Perlu Perhatian' || risk === 'Risiko Meningkat') variant = 'warning';
  if (risk === 'Berisiko Tinggi') variant = 'critical';
  
  return <Badge variant={variant}>{risk}</Badge>;
}
