"use client";
import React from 'react';
import StatusBadge from '@/components/NStatusBadge';
import { useTranslation } from '@/hooks/useLanguage';
import { formatDate, formatTime, formatTimeRange } from '@/lib/utils';
import { Clock, Truck, MapPin, Wrench, Shield, User, Calendar, Settings } from 'lucide-react';
import { Label } from '@/components/ui/label';
import NStatWidget from '@/components/NStatWidget';
import { NSection, NSectionInfo } from '@/components/NSectionCard';
import { Card } from '@/components/ui/card';

const OperationHeader = ({ operation, t }) => {
  const { status, date ,operationType} = operation;

  return (
    <div className="flex flex-col items-center p-4  md:flex-row md:gap-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
        <Wrench className="h-6 w-6 text-primary" />
      </div>
      <div className="flex flex-col justify-center items-center md:items-start flex-1">
        <Label className="text-md font-bold">{operationType}</Label>
        <Label className="text-sm text-muted-foreground"> {formatDate(date, t)}</Label>
        <StatusBadge status={status} variant="minimal" />
      </div>
    </div>
  );
};

const OperationCard = ({ data }) => {
  const { t } = useTranslation();
  const operation = data;

  // Destructure operation data
  const {
    operationType,
    date,
    startTime,
    endTime,
    startHours,
    endHours,
    status,
    operator,
    operatorId,
    vehicle,
    vehicleId,
    field,
    fieldId
  } = operation || {};

  // Processed data
  const operatorName = operator?.name || operatorId;
  const vehicleName = vehicle?.name || vehicleId;
  const fieldName = field?.name || fieldId;
  const fieldArea = field?.area;
  const fieldDisplay = fieldArea ? `${fieldName} (${fieldArea} ha)` : fieldName;



  return (
    <div className="flex flex-col gap-4">
      <OperationHeader operation={operation} t={t} />

      {/* Key Metrics Grid */}
      {(startTime || endTime) && (
        <div className="grid grid-cols-2 gap-4">
          {startTime && (
            <NStatWidget
              icon={Clock}
              title={t('operations.table.startTime')}
              value={formatTime(startTime)}
              color="blue"
              variant="compact"
            />
          )}
          {endTime && (
            <NStatWidget
              icon={Clock}
              title={t('operations.table.endTime')}
              value={formatTime(endTime)}
              color="pink"
              variant="compact"
            />
          )}
        </div>
      )}

      {/* Assignment Details */}
      <NSection
        icon={Settings}
        title={t('operations.card.assignmentInfo')}
        iconColor="text-blue-400"
        background="bg-foreground/10"
      >
        {operationType && (
          <NSectionInfo
            icon={Wrench}
            label={t('operations.table.operationType')}
            value={operationType}
            valueColor="text-muted-foreground"
            iconColor="text-muted-foreground/60"
          />
        )}

        {operatorName && (
          <NSectionInfo
            icon={User}
            label={t('operations.card.operator')}
            value={operatorName}
            valueColor="text-muted-foreground"
            iconColor="text-muted-foreground/60"
          />
        )}

        {vehicleName && (
          <NSectionInfo
            icon={Truck}
            label={t('operations.table.vehicle')}
            value={vehicleName}
            valueColor="text-muted-foreground"
            iconColor="text-muted-foreground/60"
          />
        )}

        {fieldDisplay && (
          <NSectionInfo
            icon={MapPin}
            label={t('operations.table.field')}
            value={fieldDisplay}
            valueColor="text-muted-foreground"
            iconColor="text-muted-foreground/60"
          />
        )}
      </NSection>
    </div>
  );
};

export default OperationCard;