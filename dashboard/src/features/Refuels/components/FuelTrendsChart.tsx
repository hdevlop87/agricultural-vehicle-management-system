'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardCard from '@/components/DashboardCard';
import { useMonthlyFuelTrends } from '../hooks/useFuelAnalytics';
import { useTranslation } from '@/hooks/useLanguage';
import { TrendingUp } from 'lucide-react';

export const FuelTrendsChart = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useMonthlyFuelTrends();

  return (
    <DashboardCard
      title={t('refuels.charts.fuelTrends.title')}
      icon={TrendingUp}
      loading={isLoading}
      error={isError}
      noData={!data?.length && !isLoading}
      loadingText={t('common.loading')}
      noDataText={t('refuels.charts.fuelTrends.noDataAvailable')}
      onRetry={refetch}
      className='h-96'
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="totalLiters"
            stroke="#3b82f6"
            strokeWidth={3}
            name={t('refuels.charts.fuelTrends.totalLiters')}
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="totalCost"
            stroke="#22c55e"
            strokeWidth={3}
            name={t('refuels.charts.fuelTrends.totalCost')}
          />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="refuelCount"
            stroke="#f59e0b"
            strokeWidth={2}
            name={t('refuels.charts.fuelTrends.refuelCount')}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
};