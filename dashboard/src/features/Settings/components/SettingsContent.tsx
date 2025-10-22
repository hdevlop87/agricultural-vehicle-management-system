'use client'

import React from 'react';
import { Settings } from 'lucide-react';
import { useTranslation } from '@/hooks/useLanguage';
import DatabaseSettings from './DatabaseSettings';
import SystemSettings from './SystemSettings';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import OperationalSettings from './OperationalSettings';

const SettingsContent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold text-foreground">
          {t('navigation.settings')}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <DatabaseSettings />
          <SystemSettings />
          <SecuritySettings />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <NotificationSettings />
          <OperationalSettings />
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;