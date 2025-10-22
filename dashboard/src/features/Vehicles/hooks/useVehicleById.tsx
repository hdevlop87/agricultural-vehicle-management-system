"use client";

import { useQuery } from '@tanstack/react-query';
import * as vehicleApi from '@/services/vehicleApi';

export const useVehicleById = (vehicleId: string) => {
  const {
    data: vehicle,
    isLoading: isVehicleLoading,
    error: vehicleError,
    refetch: refetchVehicle,
    isSuccess: isVehicleSuccess,
    isError: isVehicleError,
  } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => vehicleApi.getVehicleByIdApi(vehicleId),
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
    refetchOnWindowFocus: false,
  });

  return {
    vehicle,
    isVehicleLoading,
    vehicleError,
    refetchVehicle,
    isVehicleSuccess,
    isVehicleError,
  };
};