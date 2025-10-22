'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardCard from '@/components/DashboardCard';
import { useVehicleStatusDistribution } from '../hooks/useVehicleAnalytics';
import { useTranslation } from '@/hooks/useLanguage';
import { BarChart3 } from 'lucide-react';

export const VehicleStatusChart = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useVehicleStatusDistribution();

  // Translate status names in the chart data
  const translatedData = data?.map(item => ({
    ...item,
    name: t(`vehicles.statuses.${item.name.toLowerCase()}`) || item.name
  }));

  return (
    <DashboardCard
      title={t('vehicles.charts.status.title')}
      icon={BarChart3}
      loading={isLoading}
      error={isError}
      noData={!data?.length && !isLoading}
      loadingText={t('common.loading')}
      noDataText={t('vehicles.charts.status.noDataAvailable')}
      onRetry={refetch}
      className='h-full'
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={translatedData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {translatedData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
};