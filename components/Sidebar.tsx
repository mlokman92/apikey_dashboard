'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import {
  HomeIcon,
  SparklesIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon,
  BookOpenIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Overview', href: '/dashboards', icon: HomeIcon },
  { name: 'Research Assistant', href: '/research-assistant', icon: SparklesIcon },
  { name: 'Research Reports', href: '/research-reports', icon: DocumentTextIcon },
  { name: 'API Playground', href: '/api-playground', icon: CodeBracketIcon },
  { name: 'Invoices', href: '/invoices', icon: DocumentDuplicateIcon },
  { name: 'Documentation', href: '/documentation', icon: BookOpenIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`fixed top-4 z-50 p-2 bg-white rounded-lg shadow-lg transition-all duration-300 ${
          isCollapsed ? 'left-4' : 'left-64'
        }`}
      >
        {isCollapsed ? (
          <Bars3Icon className="h-5 w-5" />
        ) : (
          <XMarkIcon className="h-5 w-5" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 overflow-hidden ${
          isCollapsed ? '-translate-x-full' : 'translate-x-0'
        } ${isCollapsed ? 'w-0' : 'w-64'}`}
      >
        <div className={`flex flex-col h-full px-4 py-6 ${isCollapsed ? 'invisible' : 'visible'}`}>
          {/* Logo */}
          <div className="mb-8 px-2">
            <Link href="/" className="text-xl font-bold">
              Your Logo
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-black text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="whitespace-nowrap">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile & Settings */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center justify-between px-2 py-2">
              <div className="flex items-center gap-3">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <div className="text-sm">
                  <div className="font-medium text-gray-700">John Doe</div>
                  <div className="text-gray-500">john@example.com</div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 