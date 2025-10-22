'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as operationApi from '@/services/operationApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useOperations = (enabled = true) => {
  const crud = useEntityCRUD('operations', {
    getAll: operationApi.getOperationsApi,
    create: operationApi.createOperationApi,
    update: operationApi.updateOperationApi,
    delete: operationApi.deleteOperationApi,
  });

  const { data: operations, isLoading: isOperationsLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createOperation, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateOperation, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteOperation, isLoading: isDeleting } = crud.useDelete();

  return {
    operations,
    isOperationsLoading,
    isError,
    error,
    refetch,
    createOperation,
    updateOperation,
    deleteOperation,
    isCreating,
    isUpdating,
    isDeleting,
  };
};

export const useOperationsType = () => {
  const { data: operationsType, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['operationTypes'],
    queryFn: operationApi.getOperationsTypeApi,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });

  return {
    operationsType,
    isLoading,
    isError,
    error,
    refetch,
  };
};


export const useStartOperation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: operationApi.startOperationApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['operator'] });
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(getError(error));
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const useCompleteOperation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: operationApi.completeOperationApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['operator'] });
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(getError(error));
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const useCancelOperation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: operationApi.cancelOperationApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['operator'] });
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(getError(error));
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const useOperationStatus = (operationId?: string, enabled = true) => {
  const { data: operationStatus, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['operationStatus', operationId],
    queryFn: () => operationApi.getOperationStatusApi(operationId),
    enabled: enabled && !!operationId,
    staleTime: 30 * 1000,
    select: (response) => response?.data,
  });

  return {
    operationStatus,
    isLoading,
    isError,
    error,
    refetch,
  };
};


const getError = (error: any) => {
  return error?.response?.data?.message;
};