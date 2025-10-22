export const mapVehiclesTableConfig = (t) => ({
  // Minimal columns only for filtering - never displayed in cards mode
  columns: [
    {
      accessorKey: 'name',
      header: 'Name',
    },
  ],
  filters: [
    {
      type: 'text',
      name: 'name',
      placeholder: t('vehicles.filters.searchByName'),
      className:'lg:w-full'
    },
  ],
  defaultSort: { id: 'name', desc: false },
  pageSize: 8,
  enableSelection: false,
  enableActions: false,
  showAddButton: false,
});

export default mapVehiclesTableConfig;