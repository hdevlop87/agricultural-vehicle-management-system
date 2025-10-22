'use client';

import React from 'react';
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import DashboardCard from '@/components/DashboardCard';
import { useFuelCostAnalysis } from '../hooks/useFuelAnalytics';
import { useTranslation } from '@/hooks/useLanguage';
import { BarChart3 } from 'lucide-react';

export const FuelCostChart = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useFuelCostAnalysis();

  // Colors for pie chart segments
  const PIE_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <DashboardCard
      title={t('refuels.charts.fuelCostAnalysis.costByVehicleType')}
      icon={BarChart3}
      loading={isLoading}
      error={isError}
      noData={!data?.length && !isLoading}
      loadingText={t('common.loading')}
      noDataText={t('refuels.charts.fuelCostAnalysis.noDataAvailable')}
      onRetry={refetch}
      className='h-96'
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart  height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="totalCost"
            nameKey="vehicleType"
            label={({ vehicleType, percent }) => `${vehicleType} ${(percent * 100).toFixed(1)}%`}
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`$${value}`, t('refuels.charts.fuelCostAnalysis.totalCost')]}
            labelFormatter={(label) => `${t('refuels.charts.fuelCostAnalysis.vehicleType')}: ${label}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
};