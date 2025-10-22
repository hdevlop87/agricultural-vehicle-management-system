'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as fieldApi from '@/services/fieldApi';

export const useFields = (enabled = true) => {
  const crud = useEntityCRUD('fields', {
    getAll: fieldApi.getFieldsApi,
    create: fieldApi.createFieldApi,
    update: fieldApi.updateFieldApi,
    delete: fieldApi.deleteFieldApi,
  });

  const { data: fields, isLoading: isFieldsLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createField, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateField, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteField, isLoading: isDeleting } = crud.useDelete();

  return {
    fields,
    isFieldsLoading,
    isError,
    error,
    refetch,
    createField,
    updateField,
    deleteField,
    isCreating,
    isUpdating,
    isDeleting,
  };
};
