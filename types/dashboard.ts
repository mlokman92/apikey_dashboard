import type { ComponentType } from 'react';
import type { SVGProps } from 'react';

export type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface NavItem {
  name: string;
  href: string;
  icon: HeroIcon;
}

export interface UserProfile {
  name: string;
  email: string;
} 