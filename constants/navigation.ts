import {
  HomeIcon,
  SparklesIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { NavItem } from '@/types/dashboard';

export const NAV_ITEMS: NavItem[] = [
  { name: 'Overview', href: '/dashboards', icon: HomeIcon },
  { name: 'Research Assistant', href: '/research-assistant', icon: SparklesIcon },
  { name: 'Research Reports', href: '/research-reports', icon: DocumentTextIcon },
  { name: 'API Playground', href: '/api-playground', icon: CodeBracketIcon },
  { name: 'Invoices', href: '/invoices', icon: DocumentDuplicateIcon },
  { name: 'Documentation', href: '/documentation', icon: BookOpenIcon },
]; 