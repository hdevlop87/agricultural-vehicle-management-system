'use client';

import * as refuelApi from '@/services/refuelApi';
import { useQuery } from '@tanstack/react-query';


export const useFuelConsumptionAnalytics = () => {
  return useQuery({
    queryKey: ['fuelConsumptionAnalytics'],
    queryFn: refuelApi.getConsumptionAnalyticsApi,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });
};

export const useFuelEfficiencyReport = () => {
  return useQuery({
    queryKey: ['fuelEfficiencyReport'],
    queryFn: refuelApi.getEfficiencyReportsApi,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });
};

export const useMonthlyFuelTrends = () => {
  return useQuery({
    queryKey: ['monthlyFuelTrends'],
    queryFn: refuelApi.getMonthlyTrendsApi,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });
};

export const useFuelCostAnalysis = () => {
  return useQuery({
    queryKey: ['fuelCostAnalysis'],
    queryFn: refuelApi.getCostAnalysisApi,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data || [],
  });
};

export const useFuelSummary = () => {
  return useQuery({
    queryKey: ['fuelSummary'],
    queryFn: refuelApi.getSummaryStatisticsApi,
    staleTime: 2 * 60 * 1000,
  });
};
