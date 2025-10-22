import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Phone, Calendar, CreditCard, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import NStatusBadge  from '@/components/NStatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OperatorCardProps {
  data: any;
  onRowClick?: (data: any) => void;
  onView?: (data: any) => void;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
}

export const OperatorCard: React.FC<OperatorCardProps> = ({
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
  const isLicenseExpiring = data.licenseExpiry && 
    new Date(data.licenseExpiry) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-200 ${
        onRowClick ? 'cursor-pointer hover:bg-accent/50' : ''
      } relative overflow-hidden`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={data.user?.image ? `/storage/${data.user.image}` : undefined} />
            <AvatarFallback>
              {data.user?.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg truncate">
                {data.user?.name}
              </h3>
              <NStatusBadge 
                status={data.status} 
                variant={data.status === 'active' ? 'success' : 
                        data.status === 'inactive' ? 'secondary' : 'destructive'}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {data.user?.email}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Info */}
        {data.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{data.phone}</span>
          </div>
        )}

        {/* License Info */}
        <div className="space-y-2">
          {data.licenseNumber && (
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>License: {data.licenseNumber}</span>
              {isLicenseExpiring && (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
            </div>
          )}
          
          {data.licenseExpiry && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Expires: {new Date(data.licenseExpiry).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Employment Info */}
        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          {data.hireDate && (
            <div>
              <span className="font-medium">Hired:</span>
              <br />
              {new Date(data.hireDate).toLocaleDateString()}
            </div>
          )}
          {data.hourlyRate && (
            <div>
              <span className="font-medium">Rate:</span>
              <br />
              ${data.hourlyRate}/hr
            </div>
          )}
        </div>

        {/* Warnings */}
        {isLicenseExpiring && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2">
            <div className="flex items-center gap-2 text-sm text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              <span>License expiring soon</span>
            </div>
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
        data.status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
      }`} />
    </Card>
  );
};