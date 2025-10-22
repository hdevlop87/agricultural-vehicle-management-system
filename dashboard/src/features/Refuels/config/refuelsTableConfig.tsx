import { refuelsTableColumns } from './refuelsTableColumns';

export const refuelsTableConfig = (t) => ({
  columns: refuelsTableColumns(t),
  filters: [
    {
      type: 'text',
      name: 'vehicleName',
      placeholder: t('refuels.filters.searchByVehicle'),
    },
    {
      type: 'text',
      name: 'voucherNumber',
      placeholder: t('refuels.filters.searchByVoucherNumber'),
    },
    {
      type: 'text',
      name: 'attendant',
      placeholder: t('refuels.filters.searchByAttendant'),
    },
  ],
  defaultSort: { id: 'datetime', desc: true },
  pageSize: 10,
  enableSelection: true,
  enableActions: true,
  defaultColumnVisibility: {
    hoursAtRefuel: false,
    mileageAtRefuel: false,
    fuelLevelAfter: false,
    attendant: false,
    notes: false,
  },
});

export default refuelsTableConfig;