import { maintenanceTableColumns } from './maintenanceTableColumns';

export const maintenanceTableConfig = (t) => ({
  columns: maintenanceTableColumns(t),
  filters: [
    {
      type: 'text',
      name: 'title',
      placeholder: t('maintenance.filters.searchByTitle'),
    },
    {
      type: 'text',
      name: 'vehicleName',
      placeholder: t('maintenance.filters.searchByVehicle'),
    },
    {
      type: 'select',
      name: 'status',
      placeholder: t('maintenance.filters.filterByStatus'),
      options: [
        { value: 'scheduled', label: t('maintenance.status.scheduled') },
        { value: 'in_progress', label: t('maintenance.status.in_progress') },
        { value: 'completed', label: t('maintenance.status.completed') },
        { value: 'cancelled', label: t('maintenance.status.cancelled') },
        { value: 'overdue', label: t('maintenance.status.overdue') },
      ],
    },
  ],
  defaultSort: { id: 'createdAt', desc: true },
  pageSize: 10,
  enableSelection: true,
  enableActions: true,
});

export default maintenanceTableConfig;