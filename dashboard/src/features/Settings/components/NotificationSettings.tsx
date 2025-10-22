'use client'

import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useLanguage';

const NotificationSettings: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    maintenanceAlerts: true,
    fuelLowAlerts: true,
    operationUpdates: false,
    systemNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {t('settings.notifications.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t('settings.notifications.description')}
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <Label htmlFor="maintenance-alerts" className="text-sm font-medium">
                {t('settings.notifications.maintenanceAlerts')}
              </Label>
            </div>
            <Switch
              id="maintenance-alerts"
              checked={settings.maintenanceAlerts}
              onCheckedChange={() => handleToggle('maintenanceAlerts')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <Label htmlFor="fuel-alerts" className="text-sm font-medium">
                {t('settings.notifications.fuelAlerts')}
              </Label>
            </div>
            <Switch
              id="fuel-alerts"
              checked={settings.fuelLowAlerts}
              onCheckedChange={() => handleToggle('fuelLowAlerts')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-blue-500" />
              <Label htmlFor="operation-updates" className="text-sm font-medium">
                {t('settings.notifications.operationUpdates')}
              </Label>
            </div>
            <Switch
              id="operation-updates"
              checked={settings.operationUpdates}
              onCheckedChange={() => handleToggle('operationUpdates')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-green-500" />
              <Label htmlFor="system-notifications" className="text-sm font-medium">
                {t('settings.notifications.systemNotifications')}
              </Label>
            </div>
            <Switch
              id="system-notifications"
              checked={settings.systemNotifications}
              onCheckedChange={() => handleToggle('systemNotifications')}
            />
          </div>

          <hr className="my-4" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-purple-500" />
              <Label htmlFor="email-notifications" className="text-sm font-medium">
                {t('settings.notifications.emailNotifications')}
              </Label>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;