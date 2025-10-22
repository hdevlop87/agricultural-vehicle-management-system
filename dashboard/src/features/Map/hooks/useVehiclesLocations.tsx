import { useQuery } from '@tanstack/react-query';
import { vehicleApi } from '@/services/vehicleApi';

export const useVehiclesLocations = () => {
  const {
    data: vehiclesLocations,
    isLoading: isVehiclesLocationsLoading,
    error: vehiclesLocationsError,
    refetch: refetchVehiclesLocations,
  } = useQuery({
    queryKey: ['vehicles-locations'],
    queryFn: vehicleApi.getVehiclesLocationsApi,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    staleTime: 15000, 
  });

  return {
    vehiclesLocations: vehiclesLocations?.data || [],
    isVehiclesLocationsLoading,
    vehiclesLocationsError,
    refetchVehiclesLocations,
  };
};