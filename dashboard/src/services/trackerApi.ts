import { api } from './http';

export const getTrackersApi = async () => {
  const res = await api.get('/trackers');
  return res.data;
};

export const getTrackerByIdApi = async (id) => {
  const res = await api.get(`/trackers/${id}`);
  return res.data;
};

export const createTrackerApi = async (data) => {
  const res = await api.post('/trackers', data);
  return res.data;
};

export const updateTrackerApi = async (data) => {
  const res = await api.put(`/trackers/${data.id}`, data);
  return res.data;
};

export const deleteTrackerApi = async (id) => {
  const res = await api.delete(`/trackers/${id}`);
  return res.data;
};

export const getTrackersCountApi = async () => {
  const res = await api.get('/trackers/count');
  return res.data;
};

export const getOnlineTrackersApi = async () => {
  const res = await api.get('/trackers/online');
  return res.data;
};

export const getOfflineTrackersApi = async () => {
  const res = await api.get('/trackers/offline');
  return res.data;
};

export const getTrackersByStatusApi = async (status) => {
  const res = await api.get(`/trackers/status/${status}`);
  return res.data;
};

export const updateTrackerStatusApi = async (id, status) => {
  const res = await api.put(`/trackers/${id}/status`, { status });
  return res.data;
};

export const getLowBatteryTrackersApi = async (threshold) => {
  const params = threshold ? `?threshold=${threshold}` : '';
  const res = await api.get(`/trackers/low-battery${params}`);
  return res.data;
};

export const getTrackerByVehicleApi = async (vehicleId) => {
  const res = await api.get(`/trackers/vehicle/${vehicleId}`);
  return res.data;
};

export const getTrackerByDeviceIdApi = async (deviceId) => {
  const res = await api.get(`/trackers/device/${deviceId}`);
  return res.data;
};

export const getCurrentLocationApi = async (id) => {
  const res = await api.get(`/trackers/${id}/location/current`);
  return res.data;
};

export const getLocationHistoryApi = async (
  id: string, 
  options?: {
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
) => {
  const params = new URLSearchParams();
  
  if (options?.limit) {
    params.append('limit', options.limit.toString());
  }
  if (options?.startDate) {
    params.append('startDate', options.startDate);
  }
  if (options?.endDate) {
    params.append('endDate', options.endDate);
  }

  const queryString = params.toString();
  const url = `/trackers/${id}/location/history${queryString ? `?${queryString}` : ''}`;
  
  const res = await api.get(url);
  return res.data;
};

export const updateLocationApi = async (data) => {
  const res = await api.post(`/trackers/device/location`, data);
  return res.data;
};

export const getTrackerStatisticsApi = async (id) => {
  const res = await api.get(`/trackers/${id}/statistics`);
  return res.data;
};

export const bulkUpdateTrackersApi = async (ids, updates) => {
  const res = await api.put('/trackers/bulk', { ids, updates });
  return res.data;
};

export const markOfflineTrackersApi = async (timeoutMinutes) => {
  const res = await api.put('/trackers/offline/mark', { 
    timeoutMinutes: timeoutMinutes || 30 
  });
  return res.data;
};

export const seedTrackersApi = async (data) => {
  const res = await api.post('/trackers/seed', data);
  return res.data;
};

export const deleteAllTrackersApi = async () => {
  const res = await api.delete('/trackers');
  return res.data;
};

export const getActiveTrackersApi = async () => {
  return getTrackersByStatusApi('active');
};

export const getInactiveTrackersApi = async () => {
  return getTrackersByStatusApi('inactive');
};


