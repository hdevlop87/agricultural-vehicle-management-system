'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  MapPin, 
  TrendingUp, 
  Activity, 
  Zap, 
  Calendar,
  Ruler,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { useFieldAnalytics } from '../hooks/useFieldAnalytics';
import { useTranslation } from '@/hooks/useLanguage';
import { Spinner } from '@/components/Spinner';

interface FieldStatsDashboardProps {
  fieldId?: string;
  showGlobalStats?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const FieldStatsDashboard = ({ fieldId, showGlobalStats = true }: FieldStatsDashboardProps) => {
  const { t } = useTranslation();
  const {
    fieldStats,
    fieldUtilization,
    fieldOperations,
    summaryData,
    fieldsBySize,
    isLoading,
    hasError
  } = useFieldAnalytics(fieldId);

  if (isLoading) {
    return <Spinner variant="circle" className="w-14 h-14 text-primary" />;
  }

  if (hasError) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        {t('fields.analytics.errorLoading')}
      </div>
    );
  }

  // Prepare chart data
  const sizeDistributionData = fieldsBySize?.map((field, index) => ({
    name: field.name,
    area: parseFloat(field.area || '0'),
    color: COLORS[index % COLORS.length]
  })) || [];

  const operationsTimelineData = fieldOperations?.slice(0, 10).map(op => ({
    date: new Date(op.date).toLocaleDateString(),
    operations: 1,
    areaCovered: parseFloat(op.areaCovered || '0')
  })) || [];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {showGlobalStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('fields.analytics.totalFields')}
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.totalFields}</div>
              <p className="text-xs text-muted-foreground">
                {t('fields.analytics.fieldsRegistered')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('fields.analytics.totalArea')}
              </CardTitle>
              <Ruler className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryData.totalArea.toFixed(1)} ha
              </div>
              <p className="text-xs text-muted-foreground">
                {t('fields.analytics.averageArea')}: {summaryData.averageArea.toFixed(1)} ha
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('fields.analytics.activeFields')}
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.activeFields}</div>
              <Progress 
                value={(summaryData.activeFields / summaryData.totalFields) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('fields.analytics.utilization')}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.utilizationRate}%</div>
              <Progress value={summaryData.utilizationRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Individual Field Statistics */}
      {fieldId && fieldStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t('fields.analytics.fieldStatistics')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {fieldStats.totalOperations}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('fields.analytics.totalOperations')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {fieldStats.completedOperations}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('fields.analytics.completed')}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('fields.analytics.areaCovered')}</span>
                  <span>{fieldStats.totalAreaCovered.toFixed(2)} ha</span>
                </div>
                <Progress 
                  value={(fieldStats.totalAreaCovered / fieldStats.fieldArea) * 100} 
                />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('fields.analytics.lastOperation')}
                  </span>
                  <Badge variant={fieldStats.lastOperation?.status === 'completed' ? 'default' : 'secondary'}>
                    {fieldStats.lastOperation?.date ? 
                      new Date(fieldStats.lastOperation.date).toLocaleDateString() : 
                      t('common.none') 
                    }
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                {t('fields.analytics.utilization')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: t('fields.analytics.utilized'), value: fieldStats.utilizationRate },
                        { name: t('fields.analytics.available'), value: 100 - fieldStats.utilizationRate }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#E5E7EB" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-4">
                <div className="text-3xl font-bold">{fieldStats.utilizationRate}%</div>
                <div className="text-sm text-muted-foreground">
                  {t('fields.analytics.utilizationRate')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field Size Distribution */}
        {sizeDistributionData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('fields.analytics.sizeDistribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sizeDistributionData.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(2)} ha`, t('fields.table.area')]}
                    />
                    <Bar dataKey="area" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Operations Timeline */}
        {operationsTimelineData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('fields.analytics.operationsTimeline')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={operationsTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="areaCovered" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FieldStatsDashboard;