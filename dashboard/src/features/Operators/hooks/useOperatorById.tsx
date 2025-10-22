"use client";

import { useQuery } from '@tanstack/react-query';
import * as operatorApi from '@/services/operatorApi';

export const useOperatorById = (operatorId: string) => {
  const {
    data: operator,
    isLoading: isOperatorLoading,
    error: operatorError,
    refetch: refetchOperator,
    isSuccess: isOperatorSuccess,
    isError: isOperatorError,
  } = useQuery({
    queryKey: ['operator', operatorId],
    queryFn: () => operatorApi.getOperatorByIdApi(operatorId),
    enabled: !!operatorId,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
    refetchOnWindowFocus: false,
  });

  return {
    operator,
    isOperatorLoading,
    operatorError,
    refetchOperator,
    isOperatorSuccess,
    isOperatorError,
  };
};