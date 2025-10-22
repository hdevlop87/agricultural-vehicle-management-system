import { api } from './http';

// Basic CRUD Operations
export const getRefuelRecordsApi = async () => {
  const res = await api.get('/refuel');
  return res.data;
};

export const getRefuelRecordByIdApi = async (id: string) => {
  const res = await api.get(`/refuel/${id}`);
  return res.data;
};

export const createRefuelRecordApi = async (data: any) => {
  const res = await api.post('/refuel', data);
  return res.data;
};

export const updateRefuelRecordApi = async (id: string, data: any) => {
  const res = await api.put(`/refuel/${id}`, data);
  return res.data;
};

export const deleteRefuelRecordApi = async (id: string) => {
  const res = await api.delete(`/refuel/${id}`);
  return res.data;
};

// Refuel Analytics
export const getRefuelCountApi = async () => {
  const res = await api.get('/refuel/count');
  return res.data;
};

export const getRecentRefuelingApi = async () => {
  const res = await api.get('/refuel/recent');
  return res.data;
};

export const getTodayRefuelApi = async () => {
  const res = await api.get('/refuel/today');
  return res.data;
};

export const getRefuelByDateApi = async (params: { date: string }) => {
  const res = await api.get(`/refuel/date/${params.date}`);
  return res.data;
};

export const getVehicleRefuelHistoryApi = async (params: { vehicleId: string }) => {
  const res = await api.get(`/refuel/vehicle/${params.vehicleId}`);
  return res.data;
};

export const getOperatorRefuelRecordsApi = async (params: { operatorId: string }) => {
  const res = await api.get(`/refuel/operator/${params.operatorId}`);
  return res.data;
};

export const getRefuelByVoucherApi = async (params: { voucher: string }) => {
  const res = await api.get(`/refuel/voucher/${params.voucher}`);
  return res.data;
};

export const getConsumptionAnalyticsApi = async () => {
  const res = await api.get('/refuel/analytics/consumption');
  return res.data;
};

export const getEfficiencyReportsApi = async () => {
  const res = await api.get('/refuel/analytics/efficiency');
  return res.data;
};

export const getCostAnalysisApi = async () => {
  const res = await api.get('/refuel/analytics/costs');
  return res.data;
};

export const getSummaryStatisticsApi = async () => {
  const res = await api.get('/refuel/analytics/summary');
  return res.data;
};

export const getMonthlyTrendsApi = async () => {
  const res = await api.get('/refuel/trends/monthly');
  return res.data;
};

export const getVehicleEfficiencyApi = async (vehicleId: string) => {
  const res = await api.get(`/refuel/vehicle/${vehicleId}/efficiency`);
  return res.data;
};

export const getVehicleCostsApi = async (vehicleId: string) => {
  const res = await api.get(`/refuel/vehicle/${vehicleId}/costs`);
  return res.data;
};
