import Link from 'next/link';
import type { NavItem } from '@/types/dashboard';

interface Props {
  item: NavItem;
  isActive: boolean;
}

export default function NavItem({ item, isActive }: Props) {
  return (
    <li>
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
} 