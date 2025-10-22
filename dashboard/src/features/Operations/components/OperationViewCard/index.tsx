import React from 'react';
import { ActiveOperationContent } from './ActiveOperationContent';
import { OperationHeader } from './OperationHeader';
import { PlannedOperationContent } from './PlannedOperationContent';
import { OperationActions } from './OperationActions';
import { Card } from '@/components/ui/card';
import { CompletedOperationContent } from './CompletedOperationContent';

export const OperationViewCard = ({ operation }) => {

  return (
    <Card className='rounded-xl shadow-lg transition-all duration-300 relative p-0'>
      <OperationHeader operation={operation} />

      <div className="flex flex-col gap-4 px-4 mb-4">
        {operation.status === 'active' && (
          <ActiveOperationContent operation={operation} />
        )}

        {operation.status === 'planned' && (
          <PlannedOperationContent operation={operation} />
        )}

        {operation.status === 'completed' && (
          <CompletedOperationContent operation={operation} />
        )}

        <div className="pt-2 space-y-2">
          <OperationActions operation={operation} />
        </div>

      </div>
    </Card>
  );
};
