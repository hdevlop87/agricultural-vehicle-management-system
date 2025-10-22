'use client';

import React from 'react';
import DashboardCard from '@/components/DashboardCard';
import { Map } from '@/features/Map/components';
import { useTranslation } from '@/hooks/useLanguage';
import { MapPin } from 'lucide-react';

const DashboardMap = () => {
  const { t } = useTranslation();

  return (
    <DashboardCard
      icon={MapPin}
      className="p-0 overflow-hidden h-96"
    >
      <Map showVehicleList={false} height="h-full" className="rounded-b-lg" />
    </DashboardCard>
  );
};

export default DashboardMap;