'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useVehicleUtilization } from '../hooks/useVehicleAnalytics';
import DashboardCard from '@/components/DashboardCard';
import { useTranslation } from '@/hooks/useLanguage';
import { Activity } from 'lucide-react';

export const VehicleUtilizationChart = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useVehicleUtilization();

  // Sort by operation count for better visualization
  const sortedData = data ? [...data].sort((a, b) => b.operationCount - a.operationCount) : [];

  return (
    <DashboardCard
      title={t('vehicles.charts.utilization.titleDetailed')}
      icon={Activity}
      loading={isLoading}
      error={isError}
      noData={!data?.length && !isLoading}
      loadingText={t('common.loading')}
      noDataText={t('vehicles.charts.utilization.noData')}
      onRetry={refetch}
      className='h-96'
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="displayName"
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'operationCount') return [value, t('vehicles.charts.utilization.totalOperations')];
              return [value, name];
            }}
            labelFormatter={(label) => `${t('vehicles.charts.utilization.vehicleLabel')}: ${label}`}
          />
          <Bar
            dataKey="operationCount"
            fill="#06b6d4"
            name="operationCount"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
};