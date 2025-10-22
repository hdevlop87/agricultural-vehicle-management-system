'use client'

import React, { useState } from 'react';
import { Tractor, MapPin, Clock, Fuel } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useLanguage';

const OperationalSettings: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    autoTrackLocation: true,
    maintenanceReminders: true,
    fuelThresholdAlerts: true,
    operationAutoStart: false,
  });

  const [preferences, setPreferences] = useState({
    fuelThreshold: '25',
    maintenanceInterval: '250',
    locationUpdateInterval: '30',
    timeZone: 'UTC',
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tractor className="h-5 w-5" />
          {t('settings.operational.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          {t('settings.operational.description')}
        </p>
        
        {/* Toggle Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <Label htmlFor="auto-track" className="text-sm font-medium">
                {t('settings.operational.autoTrackLocation')}
              </Label>
            </div>
            <Switch
              id="auto-track"
              checked={settings.autoTrackLocation}
              onCheckedChange={() => handleToggle('autoTrackLocation')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <Label htmlFor="maintenance-reminders" className="text-sm font-medium">
                {t('settings.operational.maintenanceReminders')}
              </Label>
            </div>
            <Switch
              id="maintenance-reminders"
              checked={settings.maintenanceReminders}
              onCheckedChange={() => handleToggle('maintenanceReminders')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Fuel className="h-4 w-4 text-red-500" />
              <Label htmlFor="fuel-alerts" className="text-sm font-medium">
                {t('settings.operational.fuelThresholdAlerts')}
              </Label>
            </div>
            <Switch
              id="fuel-alerts"
              checked={settings.fuelThresholdAlerts}
              onCheckedChange={() => handleToggle('fuelThresholdAlerts')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tractor className="h-4 w-4 text-green-500" />
              <Label htmlFor="auto-start" className="text-sm font-medium">
                {t('settings.operational.operationAutoStart')}
              </Label>
            </div>
            <Switch
              id="auto-start"
              checked={settings.operationAutoStart}
              onCheckedChange={() => handleToggle('operationAutoStart')}
            />
          </div>
        </div>

        <hr />

        {/* Preference Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">{t('settings.operational.preferences')}</h4>
          
          <div className="space-y-2">
            <Label className="text-sm">
              {t('settings.operational.fuelThreshold')} (%)
            </Label>
            <Input
              type="number"
              min="5"
              max="50"
              value={preferences.fuelThreshold}
              onChange={(e) => handlePreferenceChange('fuelThreshold', e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {t('settings.operational.fuelThresholdDescription')}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">
              {t('settings.operational.maintenanceInterval')} ({t('common.hours')})
            </Label>
            <Input
              type="number"
              min="50"
              max="1000"
              value={preferences.maintenanceInterval}
              onChange={(e) => handlePreferenceChange('maintenanceInterval', e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {t('settings.operational.maintenanceIntervalDescription')}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">
              {t('settings.operational.locationUpdateInterval')} ({t('common.seconds')})
            </Label>
            <Select
              value={preferences.locationUpdateInterval}
              onValueChange={(value) => handlePreferenceChange('locationUpdateInterval', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 {t('common.seconds')}</SelectItem>
                <SelectItem value="30">30 {t('common.seconds')}</SelectItem>
                <SelectItem value="60">1 {t('common.minute')}</SelectItem>
                <SelectItem value="300">5 {t('common.minutes')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OperationalSettings;