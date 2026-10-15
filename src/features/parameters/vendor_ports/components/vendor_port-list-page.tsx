import { VendorPortTable } from './vendor_port-table';
import { columns } from './vendor_port-table/columns';
import { getVendorPorts } from '../data/get-vendor_ports';
import { vendorPortsSearchParamsCache } from '../searchparams';

type VendorPortListPage = {};

export default async function VendorPortListPage({}: VendorPortListPage) {
  const page = vendorPortsSearchParamsCache.get('page');
  const search = vendorPortsSearchParamsCache.get('search');
  const perPage = vendorPortsSearchParamsCache.get('perPage');
  const sortBy = vendorPortsSearchParamsCache.get('sortBy');
  const sortDirection = vendorPortsSearchParamsCache.get('sortDirection');

  const filters = {
    page,
    limit: perPage,
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getVendorPorts(filters);
  const totalVendorPorts = data.totalCount;
  const vendor_ports = data.vendorPorts;

  return (
    <VendorPortTable
      data={vendor_ports}
      totalVendorPorts={totalVendorPorts}
      columns={columns}
    />
  );
}
