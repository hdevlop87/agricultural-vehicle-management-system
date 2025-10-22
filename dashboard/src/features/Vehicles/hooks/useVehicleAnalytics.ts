'use client';

import { useQuery } from '@tanstack/react-query';
import * as vehicleApi from '@/services/vehicleApi';

// Individual Analytics Hooks
export const useVehicleStatusDistribution = () => {
  return useQuery({
    queryKey: ['vehicleStatusDistribution'],
    queryFn: vehicleApi.getVehicleStatusDistributionApi,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });
};

export const useVehicleTypeDistribution = () => {
  return useQuery({
    queryKey: ['vehicleTypeDistribution'],
    queryFn: vehicleApi.getVehicleTypeDistributionApi,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });
};

export const useVehicleFuelDistribution = () => {
  return useQuery({
    queryKey: ['vehicleFuelDistribution'],
    queryFn: vehicleApi.getVehicleFuelDistributionApi,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });
};

export const useVehicleUtilization = () => {
  return useQuery({
    queryKey: ['vehicleUtilization'],
    queryFn: vehicleApi.getVehicleUtilizationApi,
    staleTime: 2 * 60 * 1000,
    select: (response) => {
      return response?.data.map((vehicle: any) => ({
        ...vehicle,
        operationCount: parseInt(vehicle.operationCount),
        displayName:  vehicle.name
      }));
    }
  });
};

export const useTotalFleetMileage = () => {
  return useQuery({
    queryKey: ['totalFleetMileage'],
    queryFn: vehicleApi.getTotalFleetMileageApi,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });
};

export const useMonthlyFleetMileage = () => {
  return useQuery({
    queryKey: ['monthlyFleetMileage'],
    queryFn: vehicleApi.getMonthlyFleetMileageApi,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });
};

// Combined hook for all analytics
export const useVehicleAnalytics = () => {
  const statusQuery = useVehicleStatusDistribution();
  const typeQuery = useVehicleTypeDistribution();
  const fuelQuery = useVehicleFuelDistribution();
  const utilizationQuery = useVehicleUtilization();

  return {
    // Data
    statusDistribution: statusQuery.data,
    typeDistribution: typeQuery.data,
    fuelDistribution: fuelQuery.data,
    utilization: utilizationQuery.data,

    // Loading states
    isStatusLoading: statusQuery.isLoading,
    isTypeLoading: typeQuery.isLoading,
    isFuelLoading: fuelQuery.isLoading,
    isUtilizationLoading: utilizationQuery.isLoading,

    // Combined loading
    isLoading: statusQuery.isLoading || typeQuery.isLoading ||
      fuelQuery.isLoading  ||
      utilizationQuery.isLoading,

    // Error states
    isError: statusQuery.isError || typeQuery.isError || fuelQuery.isError ||
      utilizationQuery.isError,

    // Refetch functions
    refetchAll: () => {
      statusQuery.refetch();
      typeQuery.refetch();
      fuelQuery.refetch();
      utilizationQuery.refetch();
    }
  };
};
