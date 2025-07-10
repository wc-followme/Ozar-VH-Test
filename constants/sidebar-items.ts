import { Home, Icon } from 'iconsax-react';
import { Category } from './../components/icons/Category';
import { Company } from './../components/icons/Company';
import { JobIcon } from './../components/icons/JobIcon';
import { Material } from './../components/icons/Material';
import { RoleIcon } from './../components/icons/RoleIcon';
import { Tool } from './../components/icons/Tool';
import { Trade } from './../components/icons/Trade';

// Common icon options for roles and other modules
import {
  BarChart,
  CircleUserIcon,
  Database,
  FileText,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import { Service } from '../components/icons/Service';

type SidebarItem = {
  title: string;
  href: string;
  icon: Icon;
};

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Jobs',
    href: '/job-management',
    icon: JobIcon,
  },
  {
    title: 'Role Manag.',
    href: '/role-management',
    icon: RoleIcon,
  },
  {
    title: 'User Manag.',
    href: '/user-management',
    icon: CircleUserIcon,
  },
  {
    title: 'Company Manag.',
    href: '/company-management',
    icon: Company,
  },
  {
    title: 'Category Manag.',
    href: '/category-management',
    icon: Category,
  },
  {
    title: 'Trade Manag.',
    href: '/trade-management',
    icon: Trade,
  },
  {
    title: 'Service Manag.',
    href: '/service-management',
    icon: Service,
  },
  {
    title: 'Material Manag.',
    href: '/material-management',
    icon: Material,
  },
  {
    title: 'Tools Manag.',
    href: '/tools',
    icon: Tool,
  },
];

export const iconOptions = [
  {
    value: 'fas fa-cog',
    label: 'Settings',
    icon: Settings,
    color: '#00a8bf',
  },
  { value: 'fas fa-users', label: 'Users', icon: Users, color: '#34ad44' },
  {
    value: 'fas fa-user-shield',
    label: 'Shield',
    icon: Shield,
    color: '#ff6b6b',
  },
  {
    value: 'fas fa-database',
    label: 'Database',
    icon: Database,
    color: '#4c6ef5',
  },
  {
    value: 'fas fa-file-text',
    label: 'Documents',
    icon: FileText,
    color: '#fd7e14',
  },
  {
    value: 'fas fa-chart-bar',
    label: 'Analytics',
    icon: BarChart,
    color: '#9c88ff',
  },
];
