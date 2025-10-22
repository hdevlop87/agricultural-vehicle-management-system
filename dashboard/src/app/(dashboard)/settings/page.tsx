'use client'

import React from 'react';
import { useTranslation } from '@/hooks/useLanguage';
import DatabaseSettings from '@/features/Settings/components/DatabaseSettings';
import NotificationSettings from '@/features/Settings/components/NotificationSettings';
import SecuritySettings from '@/features/Settings/components/SecuritySettings';
import OperationalSettings from '@/features/Settings/components/OperationalSettings';
import SystemSettings from '@/features/Settings/components/SystemSettings';

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">


      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <DatabaseSettings />
          <SecuritySettings />
          <NotificationSettings />
        </div>

        {/* Right Column */}
        <div className="flex flex-col space-y-6">
          <OperationalSettings />
          <SystemSettings/>
        </div>
      </div>
    </div>
  );
}