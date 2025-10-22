'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, TrendingUp, Calendar } from 'lucide-react';
import { useTranslation } from '@/hooks/useLanguage';

interface FieldUtilizationCardProps {
  fieldId: string;
  fieldStats?: any;
  className?: string;
}

const FieldUtilizationCard = ({ fieldId, fieldStats, className }: FieldUtilizationCardProps) => {
  const { t } = useTranslation();

  if (!fieldStats) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            {t('fields.analytics.noData')}
          </div>
        </CardContent>
      </Card>
    );
  }

  const utilizationRate = fieldStats.utilizationRate || 0;
  const totalOperations = fieldStats.totalOperations || 0;
  const completedOperations = fieldStats.completedOperations || 0;
  const completionRate = totalOperations > 0 ? (completedOperations / totalOperations) * 100 : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5" />
          {t('fields.analytics.utilization')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Utilization Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t('fields.analytics.utilizationRate')}
            </span>
            <span className="text-sm font-bold">
              {utilizationRate}%
            </span>
          </div>
          <Progress value={utilizationRate} className="h-2" />
        </div>

        {/* Completion Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t('fields.analytics.completionRate')}
            </span>
            <span className="text-sm font-bold">
              {Math.round(completionRate)}%
            </span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">
              {totalOperations}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('fields.analytics.totalOperations')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">
              {completedOperations}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('fields.analytics.completed')}
            </div>
          </div>
        </div>

        {/* Last Operation */}
        {fieldStats.lastOperation && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{t('fields.analytics.lastOperation')}:</span>
              <span className="font-medium">
                {new Date(fieldStats.lastOperation.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FieldUtilizationCard;