import { fieldsTableColumns } from './fieldsTableColumns';

export const fieldsTableConfig = (t) => ({
  columns: fieldsTableColumns(t),
  filters: [
    {
      type: 'text',
      name: 'name',
      placeholder: t('fields.filters.searchByName'),
    },
    {
      type: 'text',
      name: 'area',
      placeholder: t('fields.filters.searchByArea'),
    },
    {
      type: 'text',
      name: 'description',
      placeholder: t('fields.filters.searchByDescription'),
    },
  ],
  defaultSort: { id: 'name', desc: false },
  pageSize: 10,
  enableSelection: true,
  enableActions: true,
  defaultColumnVisibility: {
    description: false, // Hide by default to save space
    updatedAt: false, // Hide by default
  },
});

export default fieldsTableConfig;
