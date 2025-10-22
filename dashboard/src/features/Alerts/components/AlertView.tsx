"use client";

import React from 'react';
import {
  Bell, AlertTriangle, Calendar, Clock, Truck, User, Hash,
  Settings, MessageSquare, CheckCircle, Eye
} from 'lucide-react';
import { useTranslation } from '@/hooks/useLanguage';
import { useAlertById } from '../hooks/useAlertById';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatDate, cn } from '@/lib/utils';
import LoadingError from '@/components/LoadingError';
import { NSection, NSectionInfo } from '@/components/NSectionCard';

const AlertHeader = ({ alert, t }) => {
  const getTypeIcon = (type) => {
    const icons = {
      maintenance: <Settings className="h-8 w-8 text-primary" />,
      fuel: <AlertTriangle className="h-8 w-8 text-primary" />,
      security: <AlertTriangle className="h-8 w-8 text-primary" />,
      operational: <Bell className="h-8 w-8 text-primary" />,
      system: <Settings className="h-8 w-8 text-primary" />
    };
    return icons[type] || <AlertTriangle className="h-8 w-8 text-primary" />;
  };

  return (
    <Card className="flex p-5 items-center flex-col md:flex-row md:gap-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
        {getTypeIcon(alert.type)}
      </div>
      <div className="flex flex-col justify-center items-center md:items-start md:gap-0.5">
        <Label className="text-2xl font-bold">
          {alert.title}
        </Label>
        <Label className="text-md text-muted-foreground">
          {t(`alerts.types.${alert.type}`)} Alert
        </Label>
        <Label className="text-sm font-medium text-primary">
          {t(`alerts.priorities.${alert.priority}`)} Priority
        </Label>
        <Label className="text-xs text-muted-foreground">
          {formatDate(alert.createdAt, t)}
        </Label>
      </div>
    </Card>
  );
};

const AlertView = ({ alertId }) => {
  const { t } = useTranslation();
  const { alert, isAlertLoading, alertError, refetchAlert } = useAlertById(alertId);

  // ---------- Loading/Error Check ----------
  if (isAlertLoading || alertError || !alert) {
    return (
      <LoadingError
        isLoading={isAlertLoading}
        error={alertError}
        noData={!alert}
        loadingText={t('common.loading')}
        noDataText={t('alerts.errors.notFound')}
        onRetry={refetchAlert}
        fullScreen={true}
      />
    );
  }

  // Destructure alert data
  const {
    id,
    title,
    message,
    type,
    priority,
    status,
    vehicleName,
    vehicleId,
    operatorName,
    operatorId,
    createdAt,
    updatedAt,
    readAt,
    resolvedAt
  } = alert;

  // ---------- Derived Values ----------
  const priorityColor = priority === 'critical'
    ? 'text-red-800'
    : priority === 'high'
      ? 'text-red-600'
      : priority === 'medium'
        ? 'text-yellow-600'
        : 'text-green-600';

  const statusColor = status === 'resolved'
    ? 'text-green-600'
    : status === 'read'
      ? 'text-blue-600'
      : status === 'dismissed'
        ? 'text-gray-600'
        : 'text-orange-600';

  // ---------- Render ----------
  return (
    <div className="flex flex-col gap-4 h-full w-full overflow-auto">

      {/* Header */}
      <AlertHeader alert={alert} t={t} />

      {/* Alert Information */}
      <NSection
        icon={Bell}
        title="Alert Information"
        iconColor="text-blue-500"
        background="bg-card"
        className="border shadow-sm"
      >
        <NSectionInfo
          icon={Hash}
          label="Alert ID"
          value={`#${id}`}
        />
        <NSectionInfo
          icon={MessageSquare}
          label="Title"
          value={title}
        />
        <NSectionInfo
          icon={AlertTriangle}
          label="Type"
          value={t(`alerts.types.${type}`)}
        />
        <NSectionInfo
          icon={AlertTriangle}
          label="Priority"
          value={t(`alerts.priorities.${priority}`)}
          valueColor={cn("font-medium", priorityColor)}
        />
        <NSectionInfo
          icon={CheckCircle}
          label="Status"
          value={t(`alerts.statuses.${status}`)}
          valueColor={cn("font-medium", statusColor)}
        />
      </NSection>

      {/* Message & Details */}
      <NSection
        icon={MessageSquare}
        title="Alert Message"
        iconColor="text-purple-500"
        background="bg-card"
        className="border shadow-sm"
      >
        <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded">
          {message}
        </div>
      </NSection>

      {/* Related Entities */}
      {(vehicleName || operatorName) && (
        <NSection
          icon={Settings}
          title="Related Entities"
          iconColor="text-green-500"
          background="bg-card"
          className="border shadow-sm"
        >
          {vehicleName && (
            <NSectionInfo
              icon={Truck}
              label="Vehicle"
              value={vehicleName}
              valueColor="font-medium"
            />
          )}
          {operatorName && (
            <NSectionInfo
              icon={User}
              label="Operator"
              value={operatorName}
              valueColor="font-medium"
            />
          )}
        </NSection>
      )}

      {/* Timeline & Activity */}
      <NSection
        icon={Clock}
        title="Timeline & Activity"
        iconColor="text-amber-500"
        background="bg-card"
        className="border shadow-sm"
      >
        <NSectionInfo
          icon={Calendar}
          label="Created At"
          value={formatDate(createdAt, t)}
          valueColor="font-medium"
        />
        {readAt && (
          <NSectionInfo
            icon={Eye}
            label="Read At"
            value={formatDate(readAt, t)}
            valueColor="font-medium text-blue-600"
          />
        )}
        {resolvedAt && (
          <NSectionInfo
            icon={CheckCircle}
            label="Resolved At"
            value={formatDate(resolvedAt, t)}
            valueColor="font-medium text-green-600"
          />
        )}
        {updatedAt && updatedAt !== createdAt && (
          <NSectionInfo
            icon={Clock}
            label="Last Updated"
            value={formatDate(updatedAt, t)}
            valueColor="font-medium"
          />
        )}
      </NSection>

    </div>
  );
};

export default AlertView;