
'use client'
import AdminDashboard from '@/features/Dashboard/AdminDashboard'
import OperatorDashboard from '@/features/Dashboard/OperatorDashboard'
import { useRoleGuard } from '@/hooks/useRoleGuard'

import React from 'react'

const Dashboard = () => {

  const { isAdmin, isOperator } = useRoleGuard();

  if (isAdmin()) {
    return <AdminDashboard />
  }

  if (isOperator()) {
    return <OperatorDashboard />
  }
}

export default Dashboard