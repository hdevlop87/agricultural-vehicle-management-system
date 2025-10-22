'use client'
import { useQuery } from '@tanstack/react-query';
import * as fieldApi from '@/services/fieldApi';

export const useFieldAnalytics = (fieldId?: string, enabled = true) => {
  // Field Statistics
  const {
    data: fieldStats,
    isLoading: isStatsLoading,
    error: statsError
  } = useQuery({
    queryKey: ['field-statistics', fieldId],
    queryFn: () => fieldApi.getFieldStatisticsApi(fieldId!),
    enabled: enabled && !!fieldId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Field Utilization
  const {
    data: fieldUtilization,
    isLoading: isUtilizationLoading,
    error: utilizationError
  } = useQuery({
    queryKey: ['field-utilization', fieldId],
    queryFn: () => fieldApi.getFieldUtilizationApi(fieldId!),
    enabled: enabled && !!fieldId,
    staleTime: 1000 * 60 * 5,
  });

  // Field Operations History
  const {
    data: fieldOperations,
    isLoading: isOperationsLoading,
    error: operationsError
  } = useQuery({
    queryKey: ['field-operations', fieldId],
    queryFn: () => fieldApi.getFieldOperationsApi(fieldId!),
    enabled: enabled && !!fieldId,
    staleTime: 1000 * 60 * 2,
  });

  // Total Area Analytics
  const {
    data: totalArea,
    isLoading: isTotalAreaLoading,
    error: totalAreaError
  } = useQuery({
    queryKey: ['fields-total-area'],
    queryFn: () => fieldApi.getTotalAreaApi(),
    enabled: enabled,
    staleTime: 1000 * 60 * 10,
  });

  // Fields by Size Categories
  const {
    data: fieldsBySize,
    isLoading: isFieldsBySizeLoading,
    error: fieldsBySizeError
  } = useQuery({
    queryKey: ['fields-by-size'],
    queryFn: () => fieldApi.getFieldsBySizeApi(),
    enabled: enabled,
    staleTime: 1000 * 60 * 10,
  });

  // Fields with Active Operations
  const {
    data: activeFields,
    isLoading: isActiveFieldsLoading,
    error: activeFieldsError
  } = useQuery({
    queryKey: ['fields-active-operations'],
    queryFn: () => fieldApi.getFieldsWithActiveOperationsApi(),
    enabled: enabled,
    staleTime: 1000 * 60 * 2,
  });

  // Summary Analytics
  const summaryData = {
    totalFields: totalArea?.data?.fieldCount || 0,
    totalArea: totalArea?.data?.totalArea || 0,
    averageArea: totalArea?.data?.averageArea || 0,
    activeFields: activeFields?.data?.length || 0,
    utilizationRate: fieldStats?.data?.utilizationRate || 0,
  };

  return {
    // Individual Field Analytics
    fieldStats: fieldStats?.data,
    fieldUtilization: fieldUtilization?.data,
    fieldOperations: fieldOperations?.data,
    
    // Global Analytics
    totalArea: totalArea?.data,
    fieldsBySize: fieldsBySize?.data,
    activeFields: activeFields?.data,
    summaryData,
    
    // Loading States
    isStatsLoading,
    isUtilizationLoading,
    isOperationsLoading,
    isTotalAreaLoading,
    isFieldsBySizeLoading,
    isActiveFieldsLoading,
    
    // Error States
    statsError,
    utilizationError,
    operationsError,
    totalAreaError,
    fieldsBySizeError,
    activeFieldsError,
    
    // Combined States
    isLoading: isStatsLoading || isUtilizationLoading || isOperationsLoading,
    hasError: !!(statsError || utilizationError || operationsError),
  };
};