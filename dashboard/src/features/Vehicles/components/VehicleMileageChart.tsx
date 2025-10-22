'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardCard from '@/components/DashboardCard';
import { useMonthlyFleetMileage } from '../hooks/useVehicleAnalytics';
import { useTranslation } from '@/hooks/useLanguage';
import { BarChart3 } from 'lucide-react';

export const VehicleMileageChart = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useMonthlyFleetMileage();

  const formatMileage = (value) => {
    return `${value} km`;
  };

  return (
    <DashboardCard
      title={t('vehicles.charts.monthlyMileage.title')}
      icon={BarChart3}
      loading={isLoading}
      error={isError}
      noData={!data?.length && !isLoading}
      loadingText={t('common.loading')}
      noDataText={t('vehicles.charts.monthlyMileage.noDataAvailable')}
      onRetry={refetch}
      className='h-96'
    >
      <ResponsiveContainer width="100%" height={330}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis tickFormatter={formatMileage} />
          <Tooltip
            formatter={(value, name) => [formatMileage(value), t('vehicles.charts.monthlyMileage.totalMileage')]}
            labelFormatter={(label) => `${t('vehicles.charts.monthlyMileage.month')}: ${label}`}
          />
          <Legend />
          <Bar
            dataKey="totalMileage"
            fill="#3b82f6"
            name={t('vehicles.charts.monthlyMileage.totalMileage')}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
};