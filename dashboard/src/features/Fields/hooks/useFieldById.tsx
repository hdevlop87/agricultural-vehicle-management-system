"use client";

import { useQuery } from '@tanstack/react-query';
import * as fieldApi from '@/services/fieldApi';

export const useFieldById = (fieldId: string) => {
  const {
    data: field,
    isLoading: isFieldLoading,
    error: fieldError,
    refetch: refetchField,
    isSuccess: isFieldSuccess,
    isError: isFieldError,
  } = useQuery({
    queryKey: ['field', fieldId],
    queryFn: () => fieldApi.getFieldByIdApi(fieldId),
    enabled: !!fieldId,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
    refetchOnWindowFocus: false,
  });

  return {
    field,
    isFieldLoading,
    fieldError,
    refetchField,
    isFieldSuccess,
    isFieldError,
  };
};