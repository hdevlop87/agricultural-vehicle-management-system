import { operatorsTableColumns } from './operatorsTableColumns';

export const operatorsTableConfig = (t) => ({
  columns: operatorsTableColumns(t),
  filters: [
    {
      type: 'text',
      name: 'name',
      placeholder: t('operators.filters.searchByName'),
    },
    {
      type: 'text',
      name: 'cin',
      placeholder: t('operators.filters.searchByCin'),
    },
    {
      type: 'text',
      name: 'phone',
      placeholder: t('operators.filters.searchByPhone'),
    },
  ],
  defaultSort: { id: 'user', desc: false },
  pageSize: 10,
  enableSelection: true,
  enableActions: true,
  defaultColumnVisibility: {
    cin: false, // Hide by default
    licenseNumber: false, // Hide by default
    licenseExpiry: false, // Hide by default
    hireDate: false, // Hide by default
    hourlyRate: false, // Hide by default
  },
});

export default operatorsTableConfig;