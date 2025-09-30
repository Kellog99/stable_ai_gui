import {
  faHouse, faChartLine
} from '@fortawesome/free-solid-svg-icons';


export interface NavigationItem {
  key: string;
  label: string;
  href: string;
  icon?: any;
  requiresDataset?: boolean;
  requiresEmbeddings?: boolean;
  excludeForUQDataset?: boolean;
}

export interface NavigationSection {
  key: string;
  title: string;
  icon: any;
  items: NavigationItem[];
}

export const mainNavigation: NavigationItem[] = [
  {
    key: 'home',
    label: 'Benchmark',
    href: '/pages/nntrust',
    icon: faHouse,
  },
  {
    key: 'report',
    label: 'Test',
    href: '/pages/nntrust/report/',
    icon: faChartLine,
  },
];