'use client'

import React, { useState } from 'react';
import { Shield, Key, Clock, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useLanguage';

const SecuritySettings: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: true,
    passwordExpiry: false,
    loginNotifications: true,
  });
  
  const [showApiKey, setShowApiKey] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_SEED_API_KEY || 'sk-************************';

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
          <Shield className="h-5 w-5" />
          {t('settings.security.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t('settings.security.description')}
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-blue-500" />
              <Label htmlFor="two-factor" className="text-sm font-medium">
                {t('settings.security.twoFactorAuth')}
              </Label>
            </div>
            <Switch
              id="two-factor"
              checked={settings.twoFactorAuth}
              onCheckedChange={() => handleToggle('twoFactorAuth')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <Label htmlFor="session-timeout" className="text-sm font-medium">
                {t('settings.security.sessionTimeout')}
              </Label>
            </div>
            <Switch
              id="session-timeout"
              checked={settings.sessionTimeout}
              onCheckedChange={() => handleToggle('sessionTimeout')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-red-500" />
              <Label htmlFor="password-expiry" className="text-sm font-medium">
                {t('settings.security.passwordExpiry')}
              </Label>
            </div>
            <Switch
              id="password-expiry"
              checked={settings.passwordExpiry}
              onCheckedChange={() => handleToggle('passwordExpiry')}
            />
          </div>

          <hr className="my-4" />

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t('settings.security.apiKey')}
            </Label>
            <div className="flex gap-2">
              <Input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('settings.security.apiKeyDescription')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;