import { api } from './http';

// Basic CRUD Operations
export const getMaintenancesApi = async () => {
  const res = await api.get('/maintenance');
  return res.data;
};

export const getMaintenanceByIdApi = async (id) => {
  const res = await api.get(`/maintenance/${id}`);
  return res.data;
};

export const createMaintenanceApi = async (data) => {
  const res = await api.post('/maintenance', data);
  return res.data;
};

export const updateMaintenanceApi = async (data) => {
  const res = await api.put(`/maintenance/${data.id}`, data);
  return res.data;
};

export const deleteMaintenanceApi = async (id) => {
  const res = await api.delete(`/maintenance/${id}`);
  return res.data;
};

export const deleteAllMaintenancesApi = async () => {
  const res = await api.delete('/maintenance/all');
  return res.data;
};

// Status Operations
export const updateMaintenanceStatusApi = async (id, status) => {
  const res = await api.put(`/maintenance/${id}/status`, { status });
  return res.data;
};

export const markMaintenanceAsCompletedApi = async (id) => {
  const res = await api.put(`/maintenance/${id}/complete`);
  return res.data;
};

export const bulkUpdateMaintenanceStatusApi = async (ids, status) => {
  const res = await api.put('/maintenance/bulk/status', { ids, status });
  return res.data;
};

// Filtering Operations
export const getMaintenancesByStatusApi = async (status) => {
  const res = await api.get(`/maintenance/status/${status}`);
  return res.data;
};

export const getMaintenancesByTypeApi = async (type) => {
  const res = await api.get(`/maintenance/type/${type}`);
  return res.data;
};

export const getMaintenancesByVehicleIdApi = async (vehicleId) => {
  const res = await api.get(`/maintenance/vehicle/${vehicleId}`);
  return res.data;
};

// Alert & Analytics Operations
export const getOverdueMaintenancesApi = async () => {
  const res = await api.get('/maintenance/overdue');
  return res.data;
};

export const getUpcomingMaintenancesApi = async (withinHours?) => {
  const url = withinHours ? `/maintenance/upcoming?withinHours=${withinHours}` : '/maintenance/upcoming';
  const res = await api.get(url);
  return res.data;
};

export const getMaintenanceCountApi = async () => {
  const res = await api.get('/maintenance/count');
  return res.data;
};

export const getMaintenanceStatusCountsApi = async () => {
  const res = await api.get('/maintenance/analytics/status-counts');
  return res.data;
};

export const checkMaintenanceAlertsApi = async () => {
  const res = await api.get('/maintenance/alerts');
  return res.data;
};

export const checkVehicleMaintenanceAlertsApi = async (vehicleId, currentHours) => {
  const res = await api.get(`/maintenance/alerts/vehicle/${vehicleId}?currentHours=${currentHours}`);
  return res.data;
};

export const checkOverdueMaintenanceAlertApi = async (vehicleId, currentHours) => {
  const res = await api.get(`/maintenance/alerts/overdue/${vehicleId}?currentHours=${currentHours}`);
  return res.data;
};

export const checkDueSoonMaintenanceAlertApi = async (vehicleId, currentHours) => {
  const res = await api.get(`/maintenance/alerts/due-soon/${vehicleId}?currentHours=${currentHours}`);
  return res.data;
};

// Maintenance Management
export const markOverdueMaintenancesApi = async () => {
  const res = await api.put('/maintenance/mark-overdue');
  return res.data;
};