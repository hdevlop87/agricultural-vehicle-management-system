import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DefaultCardProps {
  data: any;
  onRowClick?: (data: any) => void;
  onView?: (data: any) => void;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
}

export const DefaultCard: React.FC<DefaultCardProps> = ({
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

  // Get the first few key-value pairs to display
  const displayFields = Object.entries(data).slice(0, 4).filter(([key, value]) => {
    // Filter out common system fields and null values
    const excludeFields = ['id', 'createdAt', 'updatedAt', 'password'];
    return !excludeFields.includes(key) && value !== null && value !== undefined;
  });

  const hasActions = onView || onEdit || onDelete;

  return (
    <Card 
      className={`hover:shadow-md transition-shadow duration-200 ${
        onRowClick ? 'cursor-pointer hover:bg-accent/50' : ''
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        {/* Main content */}
        <div className="space-y-2 mb-4">
          {displayFields.map(([key, value], index) => (
            <div key={key} className={index === 0 ? 'mb-3' : ''}>
              {index === 0 ? (
                // First field as title
                <h3 className="font-semibold text-lg truncate">
                  {String(value)}
                </h3>
              ) : (
                // Other fields as key-value pairs
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="font-medium truncate ml-2 max-w-[150px]">
                    {typeof value === 'boolean' ? (
                      <Badge variant={value ? 'default' : 'secondary'}>
                        {value ? 'Yes' : 'No'}
                      </Badge>
                    ) : (
                      String(value)
                    )}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        {hasActions && (
          <div className="flex gap-2 pt-2 border-t">
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
    </Card>
  );
};