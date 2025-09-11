import {
  faBolt,
  faChartLine,
  faCircleQuestion,
  faDatabase,
  faHouse,
  faImage
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
    key: 'description',
    label: 'Dataset Description',
    href: '/pages/dataquality/datasets',
    icon: faHouse,
    requiresDataset: true,
  },
];

export const sections: NavigationSection[] = [
  {
    key: 'visualization',
    title: 'Visualization',
    icon: faImage,
    items: [
      {
        key: 'embeddings',
        label: 'Embeddings',
        href: '/pages/dataquality/embeddings',
        requiresDataset: true,
        requiresEmbeddings: true,
      },
      {
        key: 'prototypes',
        label: 'Prototypes',
        href: '/pages/dataquality/prototypes',
        requiresDataset: true,
        requiresEmbeddings: true,
      },
    ],
  },
  {
    key: 'metrics',
    title: 'Metrics',
    icon: faChartLine,
    items: [
      {
        key: 'duplicates',
        label: 'Duplicates',
        href: '/pages/dataquality/metrics/duplicates',
        requiresDataset: true,
        requiresEmbeddings: true,
      },
      {
        key: 'outliers',
        label: 'Outliers',
        href: '/pages/dataquality/metrics/outliers',
        requiresDataset: true,
        requiresEmbeddings: true,
      },
      {
        key: 'completeness',
        label: 'Completeness',
        href: '/pages/dataquality/metrics/completeness',
        requiresDataset: true,
        requiresEmbeddings: true,
        excludeForUQDataset: true,
      },
    ],
  },
  {
    key: 'actions',
    title: 'Actions',
    icon: faBolt,
    items: [
      {
        key: 'embedder',
        label: 'Embedder',
        href: '/pages/dataquality/actions/embeddings',
        requiresDataset: true,
      },
      {
        key: 'cleanDuplicates',
        label: 'Clean Duplicates',
        href: '/pages/dataquality/actions/cleanDuplicates',
        requiresDataset: true,
        requiresEmbeddings: true,
      },
      {
        key: 'cropping',
        label: 'Cropping',
        href: '/pages/dataquality/actions/cropping',
        requiresDataset: true,
      },
    ],
  },
];

export const helpNavigation: NavigationItem = {
  key: 'help',
  label: 'Help',
  href: '/pages/dataquality/help',
  icon: faCircleQuestion,
};