import React from 'react';
import { MapPin, Tractor, User, Calendar } from 'lucide-react';
import { StatusBadge } from '@/components/NBadge';
import { AvatarCell } from '@/components/NAvatarCell';
import { formatDate } from '@/lib/utils';
import { useTranslation } from '@/hooks/useLanguage';


export const OperationHeader = ({ operation }) => {

  const { t } = useTranslation();
  
  // Destructure operation data
  const operationType = operation.operationType;
  const status = operation.status;
  const date = operation.date;

  // Field data
  const fieldName = operation.field?.name || operation.fieldId;
  const fieldArea = operation.field?.area || '--';

  // Vehicle data
  const vehicleBrand = operation.vehicle?.brand || '';
  const vehicleModel = operation.vehicle?.model || operation.vehicle?.name || operation.vehicleId;
  const vehicleDisplay = vehicleBrand ? `${vehicleBrand} ${vehicleModel}` : vehicleModel;

  // Operator data
  const operatorImage = operation.operator?.image;
  const operatorName = operation.operator?.name || operation.operatorId;

  return (
    <div className="flex flex-col gap-4 p-4 border-b border-gray-100">
      <div className="flex items-center justify-between ">
        <h3 className="font-bold text-2xl text-foreground">{operationType}</h3>
        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-foreground">
          <MapPin className="w-4 h-4 text-green-600" />
          <span className="font-medium text-muted-foreground">{fieldName}</span>
        </div>

        <div className="flex items-center gap-2 text-foreground">
          <Tractor className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-muted-foreground">{vehicleDisplay}</span>
        </div>

        <div className="flex items-center gap-2 text-foreground">
          <div className="w-4 h-4 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
            <AvatarCell src={operatorImage} size='sm' />
          </div>
          <span className="font-medium text-muted-foreground">{operatorName}</span>
        </div>

        <div className="flex items-center gap-2 text-foreground">
          <Calendar className="w-4 h-4 text-orange-600" />
          <span className="font-medium text-muted-foreground">{formatDate(date,t)}</span>
        </div>
      </div>
    </div>

  );
};
