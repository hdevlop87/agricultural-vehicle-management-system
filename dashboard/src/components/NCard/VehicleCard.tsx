import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Fuel, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NStatusBadge } from '@/components/NBadge';

interface VehicleCardProps {
  data: any;
  onRowClick?: (data: any) => void;
  onView?: (data: any) => void;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  data,
  onRowClick,
  onView,
  onEdit,
  onDelete
}) => {
  const handleCardClick = () => {
    if (onRowClick) {
      onRowClick(data);
    }
  };

  const hasActions = onView || onEdit || onDelete;

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-200 ${
        onRowClick ? 'cursor-pointer hover:bg-accent/50' : ''
      } relative overflow-hidden`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg truncate">
              {data.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {data.brand} {data.model}
            </p>
          </div>
          <NStatusBadge 
            status={data.status} 
            variant={data.status === 'active' ? 'success' : 
                    data.status === 'maintenance' ? 'warning' : 'secondary'}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Vehicle Type */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {data.type}
          </Badge>
          <Badge variant="secondary">
            {data.fuelType}
          </Badge>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{data.year || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-muted-foreground" />
            <span>{data.tankCapacity ? `${data.tankCapacity}L` : 'N/A'}</span>
          </div>
        </div>

        {/* Additional Info */}
        {(data.serialNumber || data.licensePlate) && (
          <div className="text-xs text-muted-foreground space-y-1">
            {data.serialNumber && (
              <div>Serial: {data.serialNumber}</div>
            )}
            {data.licensePlate && (
              <div>License: {data.licensePlate}</div>
            )}
          </div>
        )}

        {/* Action buttons */}
        {hasActions && (
          <div className="flex gap-2 pt-3 border-t">
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(data);
                }}
                className="flex-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(data);
                }}
                className="flex-1"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(data);
                }}
                className="flex-1 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>

      {/* Status indicator stripe */}
      <div className={`absolute top-0 left-0 w-full h-1 ${
        data.status === 'active' ? 'bg-green-500' :
        data.status === 'maintenance' ? 'bg-yellow-500' : 'bg-gray-400'
      }`} />
    </Card>
  );
};