import { UserCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { UserProfile } from '@/types/dashboard';

interface Props {
  user: UserProfile;
  onSettingsClick: () => void;
}

export default function UserProfile({ user, onSettingsClick }: Props) {
  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-3">
          <UserCircleIcon className="h-8 w-8 text-gray-400" />
          <div className="text-sm">
            <div className="font-medium text-gray-700">{user.name}</div>
            <div className="text-gray-500">{user.email}</div>
          </div>
        </div>
        <button 
          onClick={onSettingsClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
} 