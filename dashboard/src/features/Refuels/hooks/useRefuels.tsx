'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as refuelApi from '@/services/refuelApi';

export const useRefuels = (enabled = true) => {
  const crud = useEntityCRUD('refuels', {
    getAll: refuelApi.getRefuelRecordsApi,
    create: refuelApi.createRefuelRecordApi,
    update: refuelApi.updateRefuelRecordApi,
    delete: refuelApi.deleteRefuelRecordApi,
  });

  const { data: refuels, isLoading: isRefuelsLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createRefuel, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateRefuel, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteRefuel, isLoading: isDeleting } = crud.useDelete();

  return {
    refuels,
    isRefuelsLoading,
    isError,
    error,
    refetch,
    createRefuel,
    updateRefuel,
    deleteRefuel,
    isCreating,
    isUpdating,
    isDeleting,
  };
};
