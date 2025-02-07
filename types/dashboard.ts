import { IconType } from '@heroicons/react/24/outline';

export interface NavItem {
  name: string;
  href: string;
  icon: IconType;
}

export interface UserProfile {
  name: string;
  email: string;
} 