"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useLanguage';

const vehicleStatusColors = {
  active: '#10b981',
  maintenance: '#f59e0b',
  idle: '#6b7280',
};

interface MapLegendProps {
  vehicleCount?: number;
}

const MapLegend: React.FC<MapLegendProps> = ({ vehicleCount = 0 }) => {
  const { t } = useTranslation();

  return (
    <Card className="absolute top-4 right-4 p-3 bg-background/95 backdrop-blur z-10 rounded-xl border shadow-lg">
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-sm mb-2">{t('map.legend')}</h4>
          <div className="space-y-2">
            {Object.entries(vehicleStatusColors).map(([status, color]) => (
              <div key={status} className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span>{t(`vehicles.statuses.${status}`)}</span>
              </div>
            ))}
          </div>
        </div>

        {vehicleCount > 0 && (
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              <p>{t('vehicles.title')}: {vehicleCount}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MapLegend;