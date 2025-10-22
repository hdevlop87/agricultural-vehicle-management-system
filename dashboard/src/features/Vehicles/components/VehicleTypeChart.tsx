'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useVehicleTypeDistribution } from '../hooks/useVehicleAnalytics';
import DashboardCard from '@/components/DashboardCard';
import { useTranslation } from '@/hooks/useLanguage';
import { Truck } from 'lucide-react';

export const VehicleTypeChart = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useVehicleTypeDistribution();

  // Translate vehicle type names in the chart data
  const translatedData = data?.map(item => ({
    ...item,
    name: t(`vehicles.types.${item.name}`) || item.name
  }));

  return (
    <DashboardCard
      title={t('vehicles.charts.types.title')}
      icon={Truck}
      loading={isLoading}
      error={isError}
      noData={!data?.length && !isLoading}
      loadingText={t('common.loading')}
      noDataText={t('vehicles.charts.types.noData')}
      onRetry={refetch}
      className='h-96'
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={translatedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
};