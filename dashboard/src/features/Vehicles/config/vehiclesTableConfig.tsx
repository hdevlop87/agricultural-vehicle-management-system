import { vehiclesTableColumns } from './vehiclesTableColumns';

export const vehiclesTableConfig = (t) => ({
  columns: vehiclesTableColumns(t),
  filters: [
    {
      type: 'text',
      name: 'name',
      placeholder: t('vehicles.filters.searchByName'),
    },
    {
      type: 'text',
      name: 'brand',
      placeholder: t('vehicles.filters.searchByBrand'),
    },
    {
      type: 'text',
      name: 'licensePlate',
      placeholder: t('vehicles.filters.searchByLicensePlate'),
    },
  ],
  defaultSort: { id: 'name', desc: false },
  pageSize: 10,
  enableSelection: true,
  enableActions: true,
});

export default vehiclesTableConfig;