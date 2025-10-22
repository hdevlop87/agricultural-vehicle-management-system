'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as maintenanceApi from '@/services/maintenanceApi';

export const useMaintenance = (enabled = true) => {
  const crud = useEntityCRUD('maintenances', {
    getAll: maintenanceApi.getMaintenancesApi,
    create: maintenanceApi.createMaintenanceApi,
    update: maintenanceApi.updateMaintenanceApi,
    delete: maintenanceApi.deleteMaintenanceApi,
  });

  const { data: maintenances, isLoading: isMaintenancesLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createMaintenance, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateMaintenance, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteMaintenance, isLoading: isDeleting } = crud.useDelete();

  return {
    maintenances,
    isMaintenancesLoading,
    isError,
    error,
    refetch,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    isCreating,
    isUpdating,
    isDeleting,
  };
};