import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import * as trackerApi from '@/services/trackerApi';

interface LocationData {
  latitude: number;
  longitude: number;
  altitude?: number;
  speed?: number;
  batteryLevel?: number;
}

interface UseUpdateLocationOptions {
  deviceId: string;
  interval?: number;
}

const getBatteryLevel = async (): Promise<number | undefined> => {
  try {
    if ('getBattery' in navigator) {
      // @ts-ignore
      const battery = await navigator.getBattery();
      return Math.round(battery.level * 100);
    }
  } catch (error) {
    console.warn('Battery API not supported:', error);
  }
  return undefined;
};

const getCurrentLocation = async (): Promise<LocationData> => {
  return new Promise(async (resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    const batteryLevel = await getBatteryLevel();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
          speed: position.coords.speed,
          batteryLevel,
        });
      },
      (error) => {
        const messages = {
          1: 'Location access denied',
          2: 'Location unavailable', 
          3: 'Location request timeout',
        };
        reject(new Error(messages[error.code] || 'Location error'));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  });
};

export const useUpdateLocation = (options: UseUpdateLocationOptions) => {
  const { interval = 30000, deviceId } = options;
  const queryClient = useQueryClient();
  const [isTracking, setIsTracking] = useState(false);

  const mutation = useMutation({
    mutationFn: trackerApi.updateLocationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles-locations'] });
      queryClient.invalidateQueries({ queryKey: ['trackers'] });
    },
  });

  const { data: currentLocation, error: locationError } = useQuery({
    queryKey: ['current-location', deviceId],
    queryFn: async () => {
      const location = await getCurrentLocation();

      console.log(location);
      
      
      mutation.mutate({
        deviceId,
        latitude: location.latitude,
        longitude: location.longitude,
        speed: location.speed,
        altitude: location.altitude,
        batteryLevel: location.batteryLevel,
      });
      
      return location;
    },
    enabled: isTracking && !!deviceId,
    refetchInterval: isTracking ? interval : false,
    retry: 2,
  });

  const startTracking = useCallback(() => setIsTracking(true), []);
  const stopTracking = useCallback(() => setIsTracking(false), []);

  return {
    currentLocation,
    locationError,
    isTracking,
    isLoading: mutation.isPending,
    isError: mutation.isError || !!locationError,
    error: mutation.error || locationError,
    startTracking,
    stopTracking,
    isLocationSupported: !!navigator.geolocation,
    isBatterySupported: 'getBattery' in navigator,
  };
};