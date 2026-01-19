
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex justify-center selection:bg-orange-500 selection:text-white transition-colors duration-300">
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6 p-4">
        {children}
      </div>
    </div>
  );
};
