import { Injectable, t } from 'najm-api';
import { SettingsRepository } from './SettingsRepository';
import { updateSettingsSchema } from '@/server/database/schema';
import { parseSchema } from '@/server/shared/utils';

@Injectable()
export class SettingsValidator {
  constructor(
    private settingsRepository: SettingsRepository,
  ) {}

  async validateUpdateSettings(data) {
    return parseSchema(updateSettingsSchema, data);
  }

  async isSettingsExists(id: string) {
    const existingSettings = await this.settingsRepository.getById(id);
    return !!existingSettings;
  }

  async isUserHasSettings(userId: string) {
    const userSettings = await this.settingsRepository.getByUserId(userId);
    return !!userSettings;
  }

  validateLanguage(language: string) {
    const validLanguages = ['en', 'fr', 'ar', 'es'];
    if (!validLanguages.includes(language)) {
      throw new Error(t('settings.errors.invalidLanguage'));
    }
    return true;
  }

  validateTheme(theme: string) {
    const validThemes = ['light', 'dark', 'system'];
    if (!validThemes.includes(theme)) {
      throw new Error(t('settings.errors.invalidTheme'));
    }
    return true;
  }

  validateTimeZone(timeZone: string) {
    // Basic timezone validation
    if (!timeZone || timeZone.trim().length === 0) {
      throw new Error(t('settings.errors.invalidTimeZone'));
    }
    return true;
  }

  validateSessionTimeout(timeout: string) {
    const numericTimeout = parseInt(timeout);
    if (isNaN(numericTimeout) || numericTimeout < 5 || numericTimeout > 1440) {
      throw new Error(t('settings.errors.invalidSessionTimeout'));
    }
    return true;
  }

  validateFuelThreshold(threshold: string) {
    const numericThreshold = parseFloat(threshold);
    if (isNaN(numericThreshold) || numericThreshold < 0 || numericThreshold > 100) {
      throw new Error(t('settings.errors.invalidFuelThreshold'));
    }
    return true;
  }

  validateMaintenanceInterval(interval: string) {
    const numericInterval = parseInt(interval);
    if (isNaN(numericInterval) || numericInterval < 1 || numericInterval > 365) {
      throw new Error(t('settings.errors.invalidMaintenanceInterval'));
    }
    return true;
  }

  validateLocationUpdateInterval(interval: string) {
    const numericInterval = parseInt(interval);
    if (isNaN(numericInterval) || numericInterval < 1 || numericInterval > 60) {
      throw new Error(t('settings.errors.invalidLocationUpdateInterval'));
    }
    return true;
  }

  //======================= Existence Checks (throw errors)

  async checkSettingsExists(id: string) {
    const settingsExists = await this.isSettingsExists(id);
    if (!settingsExists) {
      throw new Error(t('settings.errors.notFound'));
    }
    return true;
  }

  async checkUserSettingsExists(userId: string) {
    const userSettings = await this.settingsRepository.getByUserId(userId);
    if (!userSettings) {
      throw new Error(t('settings.errors.userSettingsNotFound'));
    }
    return userSettings;
  }

  //======================= Business Rules Checks

  async checkCanUpdateSettings(userId: string, data: any) {
    // Validate individual fields if provided
    if (data.language) {
      this.validateLanguage(data.language);
    }

    if (data.theme) {
      this.validateTheme(data.theme);
    }

    if (data.timeZone) {
      this.validateTimeZone(data.timeZone);
    }

    if (data.sessionTimeout) {
      this.validateSessionTimeout(data.sessionTimeout);
    }

    if (data.fuelThreshold) {
      this.validateFuelThreshold(data.fuelThreshold);
    }

    if (data.maintenanceInterval) {
      this.validateMaintenanceInterval(data.maintenanceInterval);
    }

    if (data.locationUpdateInterval) {
      this.validateLocationUpdateInterval(data.locationUpdateInterval);
    }

    return true;
  }

  async checkCanResetSettings(userId: string) {
    // Ensure user exists and has settings
    await this.checkUserSettingsExists(userId);
    return true;
  }

  async checkCanDeleteAllSettings() {
    // Get settings count for confirmation
    const count = await this.settingsRepository.getCount();
    if (count.count === 0) {
      throw new Error(t('settings.errors.noSettingsToDelete'));
    }

    return {
      settingsCount: count.count,
      canDelete: true
    };
  }

  //======================= Input Validation Helpers

  validateNotificationPreferences(data: any) {
    const validBooleanFields = [
      'maintenanceAlerts',
      'fuelLowAlerts',
      'operationUpdates',
      'systemNotifications',
      'emailNotifications',
      'smsNotifications'
    ];

    for (const field of validBooleanFields) {
      if (data[field] !== undefined && typeof data[field] !== 'boolean') {
        throw new Error(t('settings.errors.invalidNotificationPreference', { field }));
      }
    }
    return true;
  }

  validateSecuritySettings(data: any) {
    const validBooleanFields = [
      'twoFactorEnabled',
      'passwordRequireSymbols',
      'loginNotifications'
    ];

    for (const field of validBooleanFields) {
      if (data[field] !== undefined && typeof data[field] !== 'boolean') {
        throw new Error(t('settings.errors.invalidSecuritySetting', { field }));
      }
    }

    if (data.sessionTimeout) {
      this.validateSessionTimeout(data.sessionTimeout);
    }

    return true;
  }

  validateOperationalSettings(data: any) {
    const validBooleanFields = [
      'autoTrackLocation',
      'maintenanceReminders',
      'fuelThresholdAlerts',
      'operationAutoStart'
    ];

    for (const field of validBooleanFields) {
      if (data[field] !== undefined && typeof data[field] !== 'boolean') {
        throw new Error(t('settings.errors.invalidOperationalSetting', { field }));
      }
    }

    if (data.fuelThreshold) {
      this.validateFuelThreshold(data.fuelThreshold);
    }

    if (data.maintenanceInterval) {
      this.validateMaintenanceInterval(data.maintenanceInterval);
    }

    if (data.locationUpdateInterval) {
      this.validateLocationUpdateInterval(data.locationUpdateInterval);
    }

    return true;
  }
}