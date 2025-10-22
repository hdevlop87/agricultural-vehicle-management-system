import { alertsTableColumns } from './alertsTableColumns';

export const alertsTableConfig = (t) => ({
  columns: alertsTableColumns(t),
  filters: [
    {
      type: 'text',
      name: 'title',
      placeholder: t('alerts.filters.searchByTitle'),
    },
    {
      type: 'text',
      name: 'vehicleName',
      placeholder: t('alerts.filters.searchByVehicle'),
    },
    {
      type: 'select',
      name: 'type',
      placeholder: t('alerts.filters.filterByType'),
      options: [
        { value: 'maintenance', label: t('alerts.types.maintenance') },
        { value: 'fuel', label: t('alerts.types.fuel') },
        { value: 'security', label: t('alerts.types.security') },
        { value: 'operational', label: t('alerts.types.operational') },
        { value: 'system', label: t('alerts.types.system') },
      ],
    },
  ],
  defaultSort: { id: 'createdAt', desc: true },
  pageSize: 10,
  enableSelection: true,
  enableActions: true,
});

export default alertsTableConfig;