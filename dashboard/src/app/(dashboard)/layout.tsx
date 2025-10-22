'use client';
import React from 'react';

import DashboardLoader from '@/components/Loader/DashboardLoader';
import Navbar from '@/components/Nnavbar';
import Sidebar from '@/components/NSidebar';
import { useSession } from '@/hooks/useSession';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { MqttProvider } from 'await-mqtt/react';
import { AutoResumeTracking } from '@/features/Operations/components/AutoResumeTracking';

const mqttConfig = {
  url: process.env.NEXT_PUBLIC_MQTT_BROKER_URL,
  username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
  password: process.env.NEXT_PUBLIC_MQTT_PASSWORD
};

const DashboardContent = ({ children }) => {
  const { sessionLoading, isAuthenticated } = useSession('/login');
  
  if (sessionLoading) {
    return <DashboardLoader/>;
  }
  
  if (!isAuthenticated) return null;

  return <AuthenticatedDashboard>{children}</AuthenticatedDashboard>;
};

const AuthenticatedDashboard = ({ children }) => {
  const { isAdmin } = useRoleGuard();

  console.log(isAdmin());
  

  return (
    <div className='flex h-full w-full p-4 gap-4'>
      <Sidebar />
      <div className='flex flex-col flex-1 gap-4'>
        <Navbar />

        {/* {!isAdmin() && <AutoResumeTracking />} */}

        {children}
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <MqttProvider options={mqttConfig}>
      <DashboardContent>
        {children}
      </DashboardContent>

    </MqttProvider>
  );
};

export default DashboardLayout;