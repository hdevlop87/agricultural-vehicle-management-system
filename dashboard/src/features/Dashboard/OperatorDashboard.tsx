'use client'

import React from 'react';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import OperatorView from '@/features/Operators/components/OperatorView';
import useAuthStore from '@/stores/AuthStore';

const OperatorDashboard = () => {
  const { isOperator } = useRoleGuard();
  const { user } = useAuthStore();

  if (!isOperator) {
    return <div>Access denied</div>;
  }

  const operatorId = user?.operatorId || user?.id;

  return (
    <div className='flex flex-col h-full w-full gap-4 overflow-auto'>
      <OperatorView operatorId={operatorId} />
    </div>
  );
};

export default OperatorDashboard;