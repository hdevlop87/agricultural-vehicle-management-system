"use client";

import React from 'react';
import { MapPin, Fuel, Navigation, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';


const vehicleStatusColors = {
  active: '#10b981',
  maintenance: '#f59e0b',
  idle: '#6b7280',
};

const MapVehicleCard = ({ data }) => (
  <div className="rounded-lg hover:bg-muted/50 transition-colors">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: vehicleStatusColors[data.status] || vehicleStatusColors.idle }} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{data.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{data.brand} • {data.model}</p>
        </div>
      </div>
      <div className="flex items-center space-x-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-6 w-6"
          disabled={!data.location}
        >
          <Navigation className="h-3 w-3" />
        </Button>
      </div>
    </div>

    {data.location && (
      <div className="mt-2 pt-2 text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{data.location.latitude.toFixed(4)}, {data.location.longitude.toFixed(4)}</span>
          </div>
          {data.analytics?.fuelLevel && (
            <div className="flex items-center space-x-1">
              <Fuel className="h-3 w-3" />
              <span>{data.analytics.fuelLevel}%</span>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);


export default MapVehicleCard;