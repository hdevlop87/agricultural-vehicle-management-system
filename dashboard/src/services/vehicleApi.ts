import { api, formApi } from './http';

export const getVehiclesApi = async () => {
  const res = await api.get('/vehicles');
  return res.data;
};

export const getVehiclesLocationsApi = async () => {
  const res = await api.get('/vehicles/locations');
  return res.data;
};

export const getVehicleByIdApi = async (id) => {
  const res = await api.get(`/vehicles/${id}`);
  return res.data;
};

export const createVehicleApi = async (data) => {
  const res = await formApi.post('/vehicles', data);
  return res.data;
};

export const updateVehicleApi = async (data) => {
  const res = await formApi.put(`/vehicles/${data.id}`, data);
  return res.data;
};

export const deleteVehicleApi = async (id) => {
  const res = await api.delete(`/vehicles/${id}`);
  return res.data;
};

export const getVehicleCountApi = async () => {
  const res = await api.get('/vehicles/count');
  return res.data;
};

export const getVehicleTypesApi = async () => {
  const res = await api.get('/vehicles/types'); 
  return res.data;
};

export const getVehiclesByTypeApi = async (type) => {
  const res = await api.get(`/vehicles/by-type/${type}`);
  return res.data;
};

export const getActiveVehiclesApi = async () => {
  const res = await api.get('/vehicles/active');
  return res.data;
};

export const getMaintenanceVehiclesApi = async () => {
  const res = await api.get('/vehicles/maintenance');
  return res.data;
};

export const getVehicleBySerialNumberApi = async (serialNumber) => {
  const res = await api.get(`/vehicles/serial/${serialNumber}`);
  return res.data;
};

export const getVehicleByLicensePlateApi = async (licensePlate) => {
  const res = await api.get(`/vehicles/license/${licensePlate}`);
  return res.data;
};

export const updateVehicleStatusApi = async (id, status) => {
  const res = await api.put(`/vehicles/${id}/status`, { status });
  return res.data;
};

export const getVehicleStatusDistributionApi = async () => {
  const res = await api.get('/vehicles/analytics/status-distribution');
  return res.data;
};

export const getVehicleTypeDistributionApi = async () => {
  const res = await api.get('/vehicles/analytics/type-distribution');
  return res.data;
};

export const getVehicleFuelDistributionApi = async () => {
  const res = await api.get('/vehicles/analytics/fuel-distribution');
  return res.data;
};

export const getVehicleUtilizationApi = async () => {
  const res = await api.get('/vehicles/analytics/utilization');
  return res.data;
};

export const getTotalFleetMileageApi = async () => {
  const res = await api.get('/vehicles/analytics/total-fleet-mileage');
  return res.data;
};

export const getMonthlyFleetMileageApi = async () => {
  const res = await api.get('/vehicles/analytics/monthly-fleet-mileage');
  return res.data;
};

export const vehicleApi = {
  getVehiclesApi,
  getVehiclesLocationsApi,
  getVehicleByIdApi,
  createVehicleApi,
  updateVehicleApi,
  deleteVehicleApi,
  getVehicleCountApi,
  getVehicleTypesApi,
  getVehiclesByTypeApi,
  getActiveVehiclesApi,
  getMaintenanceVehiclesApi,
  getVehicleBySerialNumberApi,
  getVehicleByLicensePlateApi,
  updateVehicleStatusApi,
  getVehicleStatusDistributionApi,
  getVehicleTypeDistributionApi,
  getVehicleFuelDistributionApi,
  getVehicleUtilizationApi,
  getTotalFleetMileageApi,
  getMonthlyFleetMileageApi,
};

