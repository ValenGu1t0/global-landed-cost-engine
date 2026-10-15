'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// Custom route mapping for exact paths
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/employee': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employee', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Product', link: '/dashboard/product' }
  ],
  '/dashboard/products_view': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Products', link: '/dashboard/product' }
  ]
};

// Normalized names for /parameters/*
const paramSegmentMapping: Record<string, string> = {
  duties_commercial_agreements: 'Duties Commercial Agreements',
  ground_freight: 'Ground Freight',
  HTS: 'HTS',
  incoterm_cost_group: 'Incoterm Cost Group',
  inland_parameter: 'Inland Parameters',
  ocean_freight: 'Ocean Freight',
  other_parameters: 'Other Parameters',
  port_cost: 'Port Cost',
  tariff_hts_exceptions: 'Tariff HTS Exceptions',
  tariff_parameters: 'Tariff Parameters',
  vendor_ports: 'Vendor Ports'
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (pathname.startsWith('/dashboard/products_view/')) {
      const id = pathname.split('/').pop();
      return [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Products', link: '/dashboard/products_view' },
        { title: id || 'Product', link: pathname }
      ];
    }

    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    const segments = pathname.split('/').filter(Boolean);

    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;

      const normalizedTitle =
        segments[index - 1] === 'parameters' && paramSegmentMapping[segment]
          ? paramSegmentMapping[segment]
          : segment.charAt(0).toUpperCase() +
            segment.replace(/-/g, ' ').slice(1);

      return {
        title: normalizedTitle,
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
