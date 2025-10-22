"use client";

import React from 'react';
import { MapPin, Ruler, FileText, Hash, Settings, Activity, TrendingUp, Fuel, Target, BarChart3 } from 'lucide-react';
import { useTranslation } from '@/hooks/useLanguage';
import NStatWidget from '@/components/NStatWidget';
import { NSection, NSectionInfo } from '@/components/NSectionCard';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatArea, formatCoordinates, formatCurrency } from '@/lib/utils';

const FieldHeader = ({ field, t }) => {
  return (
    <div className="flex flex-col items-center p-4  md:flex-row md:gap-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
        <MapPin className="h-6 w-6 text-primary" />
      </div>
      <div className="flex flex-col justify-center items-center md:items-start flex-1">
        <Label className="text-md font-bold">{field.name || t('common.notAvailable')}</Label>
        <Label className="text-sm font-medium text-primary">{formatArea(field.area,t)}</Label>
        {/* Status Badge placeholder - fields don't have status yet */}
      </div>
    </div>
  );
};

const FieldCard = ({ data }) => {
  const { t } = useTranslation();
  const field = data;



  return (
    <div className="flex flex-col gap-4">
      <FieldHeader field={field} t={t} />

      {/* Field Analytics - Key Metrics */}
      {field.analytics && (
        <div className="grid grid-cols-2 gap-3">
          <NStatWidget
            icon={Activity}
            title={t('fields.analytics.operations')}
            value={field.analytics.totalOperationsCompleted || 0}
            subtitle={`${field.analytics.efficiency || 0}% ${t('fields.analytics.efficiency')}`}
            unit={t('common.total')}
            color="blue"
            variant="compact"
          />
          <NStatWidget
            icon={Fuel}
            title={t('fields.analytics.fuelCost')}
            value={formatCurrency(field.analytics.totalFuelCost || 0)}
            subtitle={`${field.analytics.totalRefuels || 0} ${t('fields.analytics.refuels')}`}
            unit="USD"
            color="yellow"
            variant="compact"
          />
        </div>
      )}

      {/* Field Details */}
      <NSection
        icon={Settings}
        title={t('fields.card.fieldInfo')}
        iconColor="text-blue-400"
        background="bg-foreground/10"
      >

        <NSectionInfo
          icon={Ruler}
          label={t('fields.table.area')}
          value={`${formatArea(field.area,t)} ${t('fields.units.hectares')}`}
          valueColor="text-muted-foreground"
          iconColor="text-muted-foreground/60"
        />

        <NSectionInfo
          icon={MapPin}
          label={t('fields.table.location')}
          value={formatCoordinates(field.location,t)}
          valueColor="text-muted-foreground"
          iconColor="text-muted-foreground/60"
        />

        {/* Analytics Section */}
        {field.analytics && (
          <>

            <NSectionInfo
              icon={Target}
              label={t('fields.analytics.efficiency')}
              value={`${field.analytics.efficiency || 0}%`}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />

            <NSectionInfo
              icon={BarChart3}
              label={t('fields.analytics.productivityScore')}
              value={`${field.analytics.productivityScore || 0} ${t('fields.analytics.productivity')}`}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          </>
        )}
      </NSection>
    </div>
  );
};

export default FieldCard;