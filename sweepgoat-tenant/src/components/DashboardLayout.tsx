import { ReactNode, useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile header with hamburger menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b border-zinc-900 flex items-center px-4 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="ml-3 text-lg font-light text-white">Dashboard</h1>
      </div>

      {/* Main content - responsive margin */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}