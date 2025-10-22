'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as operatorApi from '@/services/operatorApi';

export const useOperators = (enabled = true) => {
  const crud = useEntityCRUD(['operators', 'users'], {
    getAll: operatorApi.getOperatorsApi,
    create: operatorApi.createOperatorApi,
    update: operatorApi.updateOperatorApi,
    delete: operatorApi.deleteOperatorApi,
  });

  const { data: operators, isLoading: isOperatorsLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createOperator, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateOperator, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteOperator, isLoading: isDeleting } = crud.useDelete();

  return {
    operators,
    isOperatorsLoading,
    isError,
    error,
    refetch,
    createOperator,
    updateOperator,
    deleteOperator,
    isCreating,
    isUpdating,
    isDeleting,
  };
};