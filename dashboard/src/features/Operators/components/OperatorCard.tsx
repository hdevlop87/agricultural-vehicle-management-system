"use client";

import React from 'react';
import { Phone, DollarSign, Mail, Calendar, CheckCircle, Shield } from 'lucide-react';
import { AvatarCell } from '@/components/NAvatarCell';
import { useTranslation } from '@/hooks/useLanguage';
import NStatWidget from '@/components/NStatWidget';
import StatusIndicator from '@/components/NStatusBadge';
import { NSection, NSectionInfo } from '@/components/NSectionCard';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const OperatorHeader = ({ operator }) => {
  return (
    <div className="flex flex-col items-center p-4  md:flex-row md:gap-4">
      <AvatarCell src={operator.image} />
      <div className="flex flex-col justify-center items-center md:items-start">
        <Label className="text-md font-bold">{operator.name}</Label>
        <Label className="text-sm ">{operator.cin}</Label>
        <StatusIndicator status={operator.status} variant="minimal" />
      </div>
    </div>
  );
};

const OperatorCard = ({ data }) => {
  const { t } = useTranslation();
  const operator = data;

  const formatCurrency = (amount) => {
    if (!amount) return t('common.notAvailable');
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const yearsOfService = operator?.yearsOfService || 0;

  return (
    <div className="flex flex-col gap-4">
      
      <OperatorHeader operator={operator} />

      {/* Key Details Grid */}
      {(operator.hourlyRate || yearsOfService > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {operator.hourlyRate && (
            <NStatWidget
              icon={DollarSign}
              title={t('operators.table.hourlyRate')}
              value={formatCurrency(operator.hourlyRate)}
              color="green"
              variant="compact"
            />
          )}

          {yearsOfService > 0 && (
            <NStatWidget
              icon={Calendar}
              title="Experience"
              value={yearsOfService}
              unit="years"
              color="blue"
              variant="compact"
            />
          )}
        </div>
      )}

      {/* Contact Information */}
      {(operator.email || operator.phone) && (
        <NSection
          icon={Mail}
          title="Contact Information"
          iconColor="text-blue-400"
          background="bg-foreground/10"
        >
          {operator.email && (
            <NSectionInfo
              icon={Mail}
              label="Email"
              value={operator.email}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {operator.phone && (
            <NSectionInfo
              icon={Phone}
              label="Phone"
              value={operator.phone}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}

          {operator.hireDate && (
            <NSectionInfo
              icon={Calendar}
              label="Hired"
              value={operator.hireDate}
              valueColor="text-muted-foreground"
              iconColor="text-muted-foreground/60"
            />
          )}
        </NSection>
      )}
    </div>
  );
};

export default OperatorCard;