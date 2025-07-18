import { Home, Icon } from 'iconsax-react';
import { Category } from './../components/icons/Category';
import { Company } from './../components/icons/Company';
import { JobIcon } from './../components/icons/JobIcon';
import { Material } from './../components/icons/Material';
import { RoleIcon } from './../components/icons/RoleIcon';
import { Tool } from './../components/icons/Tool';
import { Trade } from './../components/icons/Trade';

// Common icon options for roles and other modules
import { CatCraneIcon } from '../components/icons/CatCraneIcon';
import { CatHomeIcon } from '../components/icons/CatHomeIcon';
import { CatPaintBrushIcon } from '../components/icons/CatPaintBrushIcon';
import { CatSkrewDriveIcon } from '../components/icons/CatSkrewDriveIcon';
import { CatToolIcon } from '../components/icons/CatToolIcon';
import { CircleUsersStarIcon } from '../components/icons/CircleUsersStarIcon';
import { HelmetIcon } from '../components/icons/HelmetIcon';
import { PeopleGroupIcon } from '../components/icons/PeopleGroupIcon';
import { Service } from '../components/icons/Service';
import { UserCardIcon } from '../components/icons/UserCardIcon';

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
    title: 'Role Management',
    href: '/role-management',
    icon: RoleIcon,
  },
  {
    title: 'User Management',
    href: '/user-management',
    icon: CircleUsersStarIcon,
  },
  {
    title: 'Company Management',
    href: '/company-management',
    icon: Company,
  },
  {
    title: 'Category Management',
    href: '/category-management',
    icon: Category,
  },
  {
    title: 'Trade Management',
    href: '/trade-management',
    icon: Trade,
  },
  {
    title: 'Service Management',
    href: '/service-management',
    icon: Service,
  },
  {
    title: 'Material Management',
    href: '/material-management',
    icon: Material,
  },
  {
    title: 'Tools Management',
    href: '/tools-management',
    icon: Tool,
  },
];

export const catIconOptions = [
  { value: 'home', icon: CatHomeIcon, color: '#F58B1E', bgColor: '#F58B1E1A' },
  {
    value: 'crane',
    icon: CatCraneIcon,
    color: '#90C91D',
    bgColor: '#90C91D26',
  },
  {
    value: 'paint',
    icon: CatPaintBrushIcon,
    color: '#24338C',
    bgColor: '#1A57BF1A',
  },
  {
    value: 'skrew',
    icon: CatSkrewDriveIcon,
    color: '#EBB402',
    bgColor: '#EBB4021A',
  },
  { value: 'tool', icon: CatToolIcon, color: '#00A8BF', bgColor: '#00A8BF26' },
];
export const roleIconOptions = [
  { value: 'helmet', icon: HelmetIcon, color: '#24338C', bgColor: '#1A57BF1A' },
  {
    value: 'group',
    icon: PeopleGroupIcon,
    color: '#90C91D',
    bgColor: '#90C91D26',
  },
  {
    value: 'identification-badge',
    icon: UserCardIcon,
    color: '#34AD44',
    bgColor: '#34AD4426',
  },
  {
    value: 'home',
    icon: CatHomeIcon,
    color: '#00A8BF',
    bgColor: '#00A8BF26',
  },
];
