'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as vehicleApi from '@/services/vehicleApi';

export const useVehicles = (enabled = true) => {
  const crud = useEntityCRUD('vehicles', {
    getAll: vehicleApi.getVehiclesApi,
    create: vehicleApi.createVehicleApi,
    update: vehicleApi.updateVehicleApi,
    delete: vehicleApi.deleteVehicleApi,
  });

  const { data: vehicles, isLoading: isVehiclesLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createVehicle, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateVehicle, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteVehicle, isLoading: isDeleting } = crud.useDelete();

  return {
    vehicles,
    isVehiclesLoading,
    isError,
    error,
    refetch,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    isCreating,
    isUpdating,
    isDeleting,
  };
};