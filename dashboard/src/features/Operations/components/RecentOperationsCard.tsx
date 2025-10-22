'use client';

import React from 'react';
import { Calendar, Clock, MapPin, Tractor, User, History } from 'lucide-react';
import { useTranslation } from '@/hooks/useLanguage';
import { useRecentCompletedOperations } from '../../Dashboard/hooks/useDashboardHooks';
import { formatDate } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import DashboardCard from '@/components/DashboardCard';
import { NSection, NSectionInfo } from '@/components/NSectionCard';

const RecentCompletedOperationsCard = () => {
  const { t } = useTranslation();
  const { data: operations, isLoading, isError } = useRecentCompletedOperations(2);

  const operationsContent = (
    <div className="space-y-4 p-4">
      {operations?.map((operation, index) => {
        return (
          <React.Fragment key={operation.id}>
            <NSection
              icon={Tractor}
              title={operation.operationType || `Operation #${operation.id}`}
              iconColor="text-green-500"
              background="bg-foreground/5"
            >
              <NSectionInfo
                icon={User}
                label={t('operations.form.operator')}
                value={operation.operator?.name || t('common.notAvailable')}
                valueColor="text-muted-foreground"
                iconColor="text-muted-foreground/60"
              />

              <NSectionInfo
                icon={Tractor}
                label={t('operations.form.vehicle')}
                value={operation.vehicle?.name || t('common.notAvailable')}
                valueColor="text-muted-foreground"
                iconColor="text-muted-foreground/60"
              />

              {operation.field && (
                <NSectionInfo
                  icon={MapPin}
                  label={t('operations.form.field')}
                  value={operation.field.name}
                  valueColor="text-muted-foreground"
                  iconColor="text-muted-foreground/60"
                />
              )}

              <NSectionInfo
                icon={Calendar}
                label={t('operations.form.date')}
                value={formatDate(operation.date, t)}
                valueColor="text-muted-foreground"
                iconColor="text-muted-foreground/60"
              />
            </NSection>

            {index < operations.length - 1 && (
              <Separator className="my-4" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <DashboardCard
      title={t('dashboard.cards.recentOperations.title')}
      icon={History}
      loading={isLoading}
      error={isError ? t('dashboard.cards.recentOperations.errorLoadingData') : undefined}
      noData={!operations || operations.length === 0}
      noDataText={t('dashboard.cards.recentOperations.noOperations')}
    >
      {operationsContent}
    </DashboardCard>
  );
};

export default RecentCompletedOperationsCard;