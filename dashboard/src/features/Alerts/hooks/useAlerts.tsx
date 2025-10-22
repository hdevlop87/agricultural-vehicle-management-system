'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as alertApi from '@/services/alertApi';

export const useAlerts = (enabled = true) => {
  const crud = useEntityCRUD('alerts', {
    getAll: alertApi.getAlertsApi,
    create: alertApi.createAlertApi,
    update: alertApi.updateAlertApi,
    delete: alertApi.deleteAlertApi,
  });

  const { data: alerts, isLoading: isAlertsLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createAlert, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateAlert, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteAlert, isLoading: isDeleting } = crud.useDelete();

  return {
    alerts,
    isAlertsLoading,
    isError,
    error,
    refetch,
    createAlert,
    updateAlert,
    deleteAlert,
    isCreating,
    isUpdating,
    isDeleting,
  };
};