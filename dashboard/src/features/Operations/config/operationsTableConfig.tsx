import { operationsTableColumns } from './operationsTableColumns';

export const operationsTableConfig = (t) => ({
  columns: operationsTableColumns(t),
  filters: [
    {
      type: 'text',
      name: 'vehicle',
      placeholder: t('operations.filters.searchByVehicle'),
    },
    {
      type: 'text',
      name: 'operator',
      placeholder: t('operations.filters.searchByOperator'),
    },
    {
      type: 'text',
      name: 'field',
      placeholder: t('operations.filters.searchByField'),
    }
  ],
  defaultSort: { id: 'date', desc: true },
  pageSize: 10,
  enableSelection: true,
  enableActions: true,
  defaultColumnVisibility: {
    startTime: false,
    endTime: false,
    startMileage: false,
    endMileage: false,
    weather: false,
    notes: false,
  },
});

export default operationsTableConfig;