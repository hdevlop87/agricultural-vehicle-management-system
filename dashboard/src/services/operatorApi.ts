import { api, formApi } from './http';

// Basic CRUD Operations
export const getOperatorsApi = async () => {
  const res = await api.get('/operators');
  return res.data;
};

export const getOperatorByIdApi = async (id) => {
  const res = await api.get(`/operators/${id}`);
  return res.data;
};

export const createOperatorApi = async (data) => {
  const res = await formApi.post('/operators', data);
  return res.data;
};

export const updateOperatorApi = async (data) => {
  const res = await formApi.put(`/operators/${data.id}`, data);
  return res.data;
};

export const deleteOperatorApi = async (id) => {
  const res = await api.delete(`/operators/${id}`);
  return res.data;
};

export const getOperatorCountApi = async () => {
  const res = await api.get('/operators/count'); 
  return res.data;
};

export const getActiveOperatorsApi = async () => {
  const res = await api.get('/operators/active');
  return res.data;
};

export const getInactiveOperatorsApi = async () => {
  const res = await api.get('/operators/inactive');
  return res.data;
};

export const getSuspendedOperatorsApi = async () => {
  const res = await api.get('/operators/suspended');
  return res.data;
};

export const getLicenseExpiringOperatorsApi = async () => {
  const res = await api.get('/operators/license-expiring');
  return res.data;
};

export const getOperatorByLicenseApi = async (licenseNumber) => {
  const res = await api.get(`/operators/license/${licenseNumber}`);
  return res.data;
};

export const getOperatorOperationsApi = async (operatorId) => {
  const res = await api.get(`/operators/${operatorId}/operations`);
  return res.data;
};

export const getOperatorPerformanceApi = async (operatorId) => {
  const res = await api.get(`/operators/${operatorId}/performance`);
  return res.data;
};

export const updateOperatorStatusApi = async (id: string, status: string) => {
  const res = await api.put(`/operators/${id}/status`, { status });
  return res.data;
};
