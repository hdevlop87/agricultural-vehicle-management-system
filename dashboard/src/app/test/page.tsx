'use client'
import { useUpdateLocation } from '@/features/Trackers/hooks/useUpdateLocation';
import React from 'react';


const LocationTrackerPage = () => {
  const {
    currentLocation,
    locationError,
    isTracking,
    isLoading,
    isError,
    error,
    startTracking,
    stopTracking,
    isLocationSupported,
    isBatterySupported,
  } = useUpdateLocation({ 
    deviceId: 'device-123',
    interval: 10000 // Update every 10 seconds
  });

  if (!isLocationSupported) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Location Not Supported
              </h3>
              <p className="mt-1 text-sm text-red-700">
                Your device doesn't support geolocation services.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Location Tracker
        </h1>

        {/* Control Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={startTracking}
            disabled={isTracking || isLoading}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              isTracking || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Starting...' : 'Start Tracking'}
          </button>
          
          <button
            onClick={stopTracking}
            disabled={!isTracking}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              !isTracking
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            Stop Tracking
          </button>
        </div>

        {/* Status */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isTracking 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isTracking ? 'bg-green-400' : 'bg-gray-400'
            }`}></div>
            {isTracking ? 'Tracking Active' : 'Tracking Stopped'}
          </div>
        </div>

        {/* Error Display */}
        {isError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">
                {error?.message || 'An error occurred'}
              </p>
            </div>
          </div>
        )}

        {/* Location Data */}
        {currentLocation && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Current Location</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Latitude:</span>
                <span className="font-mono">{currentLocation.latitude.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Longitude:</span>
                <span className="font-mono">{currentLocation.longitude.toFixed(6)}</span>
              </div>
 
              {currentLocation.speed && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Speed:</span>
                  <span>{Math.round(currentLocation.speed * 3.6)} km/h</span>
                </div>
              )}
              {currentLocation.altitude && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Altitude:</span>
                  <span>{Math.round(currentLocation.altitude)}m</span>
                </div>
              )}
              {currentLocation.batteryLevel !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Battery:</span>
                  <span className="flex items-center">
                    {currentLocation.batteryLevel}%
                    <div className="ml-2 w-6 h-3 bg-gray-200 rounded-sm overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          currentLocation.batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${currentLocation.batteryLevel}%` }}
                      ></div>
                    </div>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Support Info */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Location: {isLocationSupported ? '✓' : '✗'} Supported</p>
          <p>Battery: {isBatterySupported ? '✓' : '✗'} Supported</p>
        </div>
      </div>
    </div>
  );
};

export default LocationTrackerPage;