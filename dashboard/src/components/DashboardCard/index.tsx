'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import LoadingError from '@/components/LoadingError';

interface DashboardCardProps {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  loading?: boolean;
  error?: any;
  noData?: boolean;
  loadingText?: string;
  noDataText?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon: Icon,
  children,
  className = '',
  headerAction,
  loading = false,
  error,
  noData = false,
  loadingText = 'Loading...',
  noDataText = 'No data available',
  onRetry,
}) => {
  // Show LoadingError if there's loading, error, or no data state
  const hasLoadingState = loading || error || noData;

  return (
    <Card className={cn('py-4 gap-3 border-white', className)}>
      {title && (
        <CardHeader className={headerAction ? 'flex-row items-center justify-between space-y-0 pb-3 px-3' : 'px-3'}>
          <CardTitle className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5" />}
            {title}
          </CardTitle>
          {headerAction && (
            <div className="flex items-center space-x-2">
              {headerAction}
            </div>
          )}
        </CardHeader>
      )}

      <CardContent className={'p-0 h-full m-0'}>
        {hasLoadingState ? (
          <LoadingError
            isLoading={loading}
            error={error}
            noData={noData}
            loadingText={loadingText}
            noDataText={noDataText}
            onRetry={onRetry}
            fullScreen={false}
          />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;