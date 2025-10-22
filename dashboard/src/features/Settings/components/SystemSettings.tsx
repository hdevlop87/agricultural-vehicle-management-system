'use client'

import React, { useState } from 'react';
import { Settings, Monitor, Smartphone, Globe, Languages, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useLanguage';

const SystemSettings: React.FC = () => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState({
    timeZone: 'UTC',
    language: 'en',
    theme: 'system',
  });

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
          <Settings className="h-5 w-5" />
          {t('settings.system.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              {t('settings.system.version')}
            </span>
            <span className="font-medium">v1.6</span>
          </div>
        </div>

        <hr className="my-4" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('settings.operational.timeZone')}
            </Label>
            <Select
              value={preferences.timeZone}
              onValueChange={(value) => handlePreferenceChange('timeZone', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Europe/Paris">Paris</SelectItem>
                <SelectItem value="Africa/Casablanca">Casablanca</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Languages className="h-4 w-4" />
              {t('settings.system.language')}
            </Label>
            <Select
              value={preferences.language}
              onValueChange={(value) => handlePreferenceChange('language', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              {t('settings.system.theme')}
            </Label>
            <Select
              value={preferences.theme}
              onValueChange={(value) => handlePreferenceChange('theme', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t('settings.system.lightTheme')}</SelectItem>
                <SelectItem value="dark">{t('settings.system.darkTheme')}</SelectItem>
                <SelectItem value="system">{t('settings.system.systemTheme')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;