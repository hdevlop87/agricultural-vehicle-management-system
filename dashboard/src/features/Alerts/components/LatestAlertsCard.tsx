'use client';

import React from 'react';
import { Bell, AlertTriangle, Calendar, Clock, Truck, User, Settings, Hash } from 'lucide-react';
import { useTranslation } from '@/hooks/useLanguage';
import { useLatestAlerts } from '../hooks/useLatestAlerts';
import { formatDate } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import DashboardCard from '@/components/DashboardCard';
import { NSection, NSectionInfo } from '@/components/NSectionCard';

const LatestAlertsCard = () => {
  const { t } = useTranslation();
  const { data: alerts, isLoading, isError } = useLatestAlerts(2);

  const getTypeIcon = (type) => {
    const iconMap = {
      maintenance: Settings,
      fuel: AlertTriangle,
      security: AlertTriangle,
      operational: Bell,
      system: Settings
    };
    return iconMap[type] || AlertTriangle;
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      critical: 'text-red-500',
      high: 'text-orange-500',
      medium: 'text-yellow-500',
      low: 'text-blue-500'
    };
    return colorMap[priority] || 'text-gray-500';
  };

  const alertsContent = (
    <div className="space-y-4 p-4">
      {alerts?.map((alert, index) => {
        const TypeIcon = getTypeIcon(alert.type);

        return (
          <React.Fragment key={alert.id}>
            <NSection
              icon={AlertTriangle}
              title={alert.title || `Alert #${alert.id}`}
              iconColor={getPriorityColor(alert.priority)}
              background="bg-foreground/5"
            >
              <NSectionInfo
                icon={Bell}
                label={t('alerts.form.type')}
                value={t(`alerts.types.${alert.type}`)}
                valueColor="text-muted-foreground"
                iconColor="text-muted-foreground/60"
              />

              <NSectionInfo
                icon={Hash}
                label={t('alerts.form.priority')}
                value={t(`alerts.priorities.${alert.priority}`)}
                valueColor={getPriorityColor(alert.priority)}
                iconColor="text-muted-foreground/60"
              />

              {alert.vehicleName && (
                <NSectionInfo
                  icon={Truck}
                  label={t('alerts.form.vehicle')}
                  value={alert.vehicleName}
                  valueColor="text-muted-foreground"
                  iconColor="text-muted-foreground/60"
                />
              )}

              <NSectionInfo
                icon={Calendar}
                label={t('alerts.table.createdAt')}
                value={formatDate(alert.createdAt, t)}
                valueColor="text-muted-foreground"
                iconColor="text-muted-foreground/60"
              />

              {alert.readAt && (
                <NSectionInfo
                  icon={Clock}
                  label={t('alerts.table.readAt')}
                  value={formatDate(alert.readAt, t)}
                  valueColor="text-muted-foreground"
                  iconColor="text-muted-foreground/60"
                />
              )}
            </NSection>

            {index < alerts.length - 1 && (
              <Separator className="my-4" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <DashboardCard
      title={t('dashboard.cards.latestAlerts.title')}
      icon={Bell}
      loading={isLoading}
      error={isError ? t('dashboard.cards.latestAlerts.errorLoadingData') : undefined}
      noData={!alerts || alerts.length === 0}
      noDataText={t('dashboard.cards.latestAlerts.noAlerts')}
    >
      {alertsContent}
    </DashboardCard>
  );
};

export default LatestAlertsCard;