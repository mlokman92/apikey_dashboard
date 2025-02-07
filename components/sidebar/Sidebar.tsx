'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSidebar } from '@/context/SidebarContext';
import Logo from './Logo';
import Navigation from './Navigation';
import UserProfile from './UserProfile';

export default function Sidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const handleSettingsClick = () => {
    // TODO: Implement settings click handler
    console.log('Settings clicked');
  };

  return (
    <>
      <ToggleButton isCollapsed={isCollapsed} onClick={() => setIsCollapsed(!isCollapsed)} />
      <div
        className={`flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 overflow-hidden ${
          isCollapsed ? '-translate-x-full' : 'translate-x-0'
        } ${isCollapsed ? 'w-0' : 'w-64'}`}
      >
        <div className={`flex flex-col h-full px-4 py-6 ${isCollapsed ? 'invisible' : 'visible'}`}>
          <Logo />
          <Navigation />
          <UserProfile 
            user={{ name: 'John Doe', email: 'john@example.com' }}
            onSettingsClick={handleSettingsClick}
          />
        </div>
      </div>
    </>
  );
}

interface ToggleButtonProps {
  isCollapsed: boolean;
  onClick: () => void;
}

function ToggleButton({ isCollapsed, onClick }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
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
  );
} 