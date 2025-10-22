import { Card } from '@/components/ui/card';
import React from 'react';

export const OperationNotes = ({ operation }) => {
  if (!operation.notes) return null;

  return (
    <Card className=" rounded-lg p-4 border-l-4 border-gray-400 gap-2">
      <h4 className="text-sm font-semibold text-muted-foreground  flex items-center gap-2">
        Notes
      </h4>
      <p className="text-sm text-foreground leading-relaxed">{operation.notes}</p>
    </Card>
  );
};
