import { trackersTableColumns } from './trackersTableColumns';

export const trackersTableConfig = (t) => ({
  columns: trackersTableColumns(t),
  filters: [
    {
      type: "select",
      name: 'status',
      placeholder: t('trackers.filters.filterByStatus'),
      options: [
        { label: t('trackers.status.active'), value: 'active' },
        { label: t('trackers.status.inactive'), value: 'inactive' },
      ],
    },
    {
      type: "select",
      name: 'isOnline',
      placeholder: t('trackers.filters.filterByConnection'),
      options: [
        { label: t('trackers.connection.online'), value: true },
        { label: t('trackers.connection.offline'), value: false },
      ],
    },
  ],
});

export default trackersTableConfig;