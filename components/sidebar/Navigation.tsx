import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/constants/navigation';
import NavItem from './NavItem';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex-1">
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.name}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
      </ul>
    </nav>
  );
} 