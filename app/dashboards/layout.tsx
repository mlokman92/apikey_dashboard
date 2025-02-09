'use client';

import { SidebarProvider } from '@/context/SidebarContext';
import Sidebar from '@/components/Sidebar';
import { useSidebar } from '@/context/SidebarContext';
import { Toaster } from 'react-hot-toast';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main 
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'ml-0' : 'ml-64'
        }`}
      >
        {children}
      </main>
      <Toaster />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
} 