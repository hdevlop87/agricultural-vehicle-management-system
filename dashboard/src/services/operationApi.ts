import { api } from './http';

export const getOperationsApi = async () => {
  const res = await api.get('/operations');
  return res.data;
};

export const getOperationByIdApi = async (id) => {
  const res = await api.get(`/operations/${id}`);
  return res.data;
};

export const createOperationApi = async (data) => {
  const res = await api.post('/operations', data);
  return res.data;
};

export const updateOperationApi = async (data) => {
  const res = await api.put(`/operations/${data.id}`, data);
  return res.data;
};

export const deleteOperationApi = async (id) => {
  const res = await api.delete(`/operations/${id}`);
  return res.data;
};

export const getOperationCountApi = async () => {
  const res = await api.get('/operations/count');
  return res.data;
};

export const getOperationStatusApi = async (operationId) => {
  const res = await api.get(`/operations/${operationId}`);
  return { ...res, data: { status: res.data.status } };
};

export const getPlannedOperationsApi = async () => {
  const res = await api.get('/operations/planned');
  return res.data;
};

export const getActiveOperationsApi = async () => {
  const res = await api.get('/operations/active');
  return res.data;
};

export const getCompletedOperationsApi = async () => {
  const res = await api.get('/operations/completed');
  return res.data;
};

export const getRecentCompletedOperationsApi = async (limit = 5) => {
  const res = await api.get(`/operations/recent-completed?limit=${limit}`);
  return res.data;
};

export const getCancelledOperationsApi = async () => {
  const res = await api.get('/operations/cancelled');
  return res.data;
};

export const getTodayOperationsApi = async () => {
  const res = await api.get('/operations/today');
  return res.data;
};

export const getOperationsByDateApi = async (params) => {
  const res = await api.get(`/operations/date/${params.date}`);
  return res.data;
};

export const getOperationsByVehicleApi = async (params) => {
  const res = await api.get(`/operations/vehicle/${params.vehicleId}`);
  return res.data;
};

export const getOperationsByOperatorApi = async (params) => {
  const res = await api.get(`/operations/operator/${params.operatorId}`);
  return res.data;
};

export const getTodayOperationsByOperatorApi = async (params) => {
  const res = await api.get(`/operations/today/operator/${params.operatorId}`);
  return res.data;
};

export const getOperationsByFieldApi = async (params) => {
  if (typeof params === 'string') {
    const res = await api.get(`/operations/field/${params}`);
    return res.data;
  } else {
    const res = await api.get(`/operations/field/${params.fieldId}`);
    return res.data;
  }
};

export const getOperationsTypeApi = async () => {
  const res = await api.get(`/operations/operation-types`);
  return res.data;
};

export const getOperationsByTypeApi = async (params) => {
  const res = await api.get(`/operations/operation-type/${params.operationTypeId}`);
  return res.data;
};

export const startOperationApi = async (data) => {
  const res = await api.put(`/operations/${data.operationId}/start`, data);
  return res.data;
};

export const completeOperationApi = async (data) => {
  const res = await api.put(`/operations/${data.operationId}/complete`, data);
  return res.data;
};

export const cancelOperationApi = async (data) => {
  const res = await api.put(`/operations/${data.operationId}/cancel`, data);
  return res.data;
};

export const getTopOperatorsApi = async () => {
  const res = await api.get('/operations/top-operators');
  return res.data;
};
