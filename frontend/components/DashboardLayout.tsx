'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
