'use client'

import React from 'react';
import AdminWidgets from './InfoWidgets/AdminWidgets';
import { FuelCostChart } from '@/features/Refuels/components/FuelCostChart';
import { FuelTrendsChart } from '@/features/Refuels/components/FuelTrendsChart';
import { VehicleStatusChart } from '@/features/Vehicles/components/VehicleStatusChart';
import { VehicleMileageChart } from '@/features/Vehicles/components/VehicleMileageChart';
import { DashboardMap } from './components';
import RecentOperationsCard from '../Operations/components/RecentOperationsCard';
import LatestAlertsCard from '../Alerts/components/LatestAlertsCard';

const AdminDashboard = () => {
  return (
    <div className='flex flex-col h-full w-full gap-4 overflow-auto'>
      {/* Admin Widgets */}
      <AdminWidgets />

      {/* Main Dashboard Content - 60/40 Split per Row */}
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1'>
        {/* Row 1 */}
        <div className='lg:col-span-3'>
          <DashboardMap />
        </div>
        <div className='lg:col-span-2'>
          <FuelCostChart />
        </div>
        
        {/* Row 2 */}
        <div className='lg:col-span-3'>
          <FuelTrendsChart />
        </div>
        <div className='lg:col-span-2'>
          <VehicleMileageChart />
        </div>
        
        {/* Row 3 */}
        <div className='lg:col-span-1'>
          <VehicleStatusChart />
        </div>
        <div className='lg:col-span-2'>
          <LatestAlertsCard />
        </div>
        <div className='lg:col-span-2'>
          <RecentOperationsCard />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;