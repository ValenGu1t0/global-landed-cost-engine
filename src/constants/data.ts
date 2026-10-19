import { NavItem } from '@/types';

// Base prefix for product images (customizable via NEXT_PUBLIC_IMAGE_BASE_URL)
export const BASE_PREFIX =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '/placeholder-product.svg';

export const resolveProductImageUrl = (imagePath?: string | null): string => {
  if (!imagePath) return '/placeholder-product.svg';
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('/')
  ) {
    return imagePath;
  }
  if (process.env.NEXT_PUBLIC_IMAGE_BASE_URL) {
    const base = process.env.NEXT_PUBLIC_IMAGE_BASE_URL.replace(/\/+$/, '');
    return `${base}/${imagePath.replace(/^\/+/, '')}`;
  }
  return '/placeholder-product.svg';
};

// Fecha limite y distinción de parametros activos
export const END_OF_TIME = '2100-01-01T00:00:00Z';

// Categorias - Stock
export const STOCK_OPTIONS = [
  { id: 'true', label: 'With Stock' },
  { id: 'false', label: 'Without Stock' }
];

export const TYPE_OPTIONS = [
  { id: 'KIT', label: 'KIT' },
  { id: 'PRODUCT', label: 'PRODUCT' },
  { id: 'PRODUCT_KIT_SELLABLE', label: 'PRODUCT KIT SELLABLE' }
];

// Product Status
export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PROJECT = 'PROJECT',
  GS = 'GS'
}

export const COST_MAP = {
  fob: { incoterm: 'FOB', commentary: 'fob_commentary' },
  exw: { incoterm: 'EXW', commentary: 'exw_commentary' },
  cnf: { incoterm: 'CNF', commentary: 'cnf_commentary' },
  ddp: { incoterm: 'DDP', commentary: 'ddp_commentary' },
  cnf_diff: { incoterm: 'CNF_DIFF', commentary: 'cnf_diff_commentary' }
} as const;

export type CostField = keyof typeof COST_MAP;

// The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Products',
    url: '/dashboard/products_view',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'Parameters',
    url: '/dashboard/parameters',
    icon: 'userPen',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'All Parameters',
        url: '/dashboard/parameters',
        icon: 'settings',
        shortcut: ['', '']
      },
      {
        title: 'HTS Codes',
        url: '/dashboard/parameters/HTS',
        icon: 'barcode',
        shortcut: ['', '']
      },
      {
        title: 'Inland Parameters',
        url: '/dashboard/parameters/inland_parameter',
        icon: 'truck',
        shortcut: ['', '']
      },
      {
        title: 'Ocean Freight',
        url: '/dashboard/parameters/ocean_freight',
        icon: 'ship',
        shortcut: ['', '']
      },
      {
        title: 'Ground Freight',
        url: '/dashboard/parameters/ground_freight',
        icon: 'road',
        shortcut: ['', '']
      },
      {
        title: 'Port Cost',
        url: '/dashboard/parameters/port_cost',
        icon: 'anchor',
        shortcut: ['', '']
      },
      {
        title: 'Tariff Parameters',
        url: '/dashboard/parameters/tariff_parameters',
        icon: 'receipt',
        shortcut: ['', '']
      },
      {
        title: 'Vendor Ports',
        url: '/dashboard/parameters/vendor_ports',
        icon: 'building',
        shortcut: ['', '']
      },
      {
        title: 'Tariff HTS Exceptions',
        url: '/dashboard/parameters/tariff_hts_exceptions',
        icon: 'fileWarning',
        shortcut: ['', '']
      },
      {
        title: 'Incoterm Cost Group ',
        url: '/dashboard/parameters/incoterm_cost_group',
        icon: 'globe',
        shortcut: ['', '']
      },
      {
        title: 'Duties Commercial Agreements ',
        url: '/dashboard/parameters/duties_commercial_agreements',
        icon: 'scale',
        shortcut: ['', '']
      },
      {
        title: 'Other Parameters',
        url: '/dashboard/parameters/other_parameters',
        icon: 'list',
        shortcut: ['', '']
      }
    ]
  },
  {
    title: 'Bulk Edit',
    url: '/dashboard/edit',
    icon: 'list',
    shortcut: ['', ''],
    isActive: false,
    items: [
      {
        title: 'Atributes',
        url: '/dashboard/edit/atributes',
        icon: 'receipt',
        shortcut: ['', '']
      },
      {
        title: 'CN-Code',
        url: '/dashboard/edit/cn_code',
        icon: 'barcode',
        shortcut: ['', '']
      },
      {
        title: 'Status',
        url: '/dashboard/edit/status',
        icon: 'globe',
        shortcut: ['', '']
      }
    ]
  }
  /*  {
    title: 'Products',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  }, */
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
