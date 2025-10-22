import { Injectable } from 'najm-api';
import { SettingsRepository } from './SettingsRepository';
import { SettingsValidator } from './SettingsValidator';

@Injectable()
export class SettingsService {
  constructor(
    private settingsRepository: SettingsRepository,
    private settingsValidator: SettingsValidator,
  ) {}

  async getAll() {
    return await this.settingsRepository.getAll();
  }

  async getById(id: string) {
    await this.settingsValidator.checkSettingsExists(id);
    return await this.settingsRepository.getById(id);
  }

  async getByUserId(userId: string) {
    let userSettings = await this.settingsRepository.getByUserId(userId);
    
    // If no settings exist for user, create default settings
    if (!userSettings) {
      userSettings = await this.settingsRepository.createDefaultForUser(userId);
    }
    
    return userSettings;
  }

  async getCount() {
    return await this.settingsRepository.getCount();
  }

  async create(data: any) {
    try {
      await this.settingsValidator.validateUpdateSettings(data);
      await this.settingsValidator.checkCanUpdateSettings(data.userId, data);
      
      return await this.settingsRepository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: any) {
    await this.settingsValidator.checkSettingsExists(id);
    
    const settings = await this.settingsRepository.getById(id);
    await this.settingsValidator.checkCanUpdateSettings(settings.userId, data);
    
    return await this.settingsRepository.update(id, data);
  }

  async updateByUserId(userId: string, data: any) {
    try {
      await this.settingsValidator.validateUpdateSettings(data);
      await this.settingsValidator.checkCanUpdateSettings(userId, data);
      
      // Upsert settings (create if doesn't exist, update if exists)
      const updatedSettings = await this.settingsRepository.upsert(userId, data);
      
      return updatedSettings;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    await this.settingsValidator.checkSettingsExists(id);
    return await this.settingsRepository.delete(id);
  }

  async deleteByUserId(userId: string) {
    await this.settingsValidator.checkUserSettingsExists(userId);
    return await this.settingsRepository.deleteByUserId(userId);
  }

  async resetUserSettings(userId: string) {
    try {
      await this.settingsValidator.checkCanResetSettings(userId);
      
      // Delete existing settings
      await this.settingsRepository.deleteByUserId(userId);
      
      // Create new default settings
      const defaultSettings = await this.settingsRepository.createDefaultForUser(userId);
      
      return defaultSettings;
    } catch (error) {
      throw error;
    }
  }

  async deleteAll() {
    await this.settingsValidator.checkCanDeleteAllSettings();
    return await this.settingsRepository.deleteAll();
  }

  // Helper methods to get specific preference types
  async getUserPreference(userId: string, preference: string) {
    const settings = await this.getByUserId(userId);
    return settings[preference];
  }

  async updateUserPreference(userId: string, preference: string, value: any) {
    const updateData = { [preference]: value };
    return this.updateByUserId(userId, updateData);
  }

  // Get language preference for user
  async getUserLanguage(userId: string) {
    return await this.settingsRepository.getUserLanguage(userId);
  }

  // Get theme preference for user
  async getUserTheme(userId: string) {
    return await this.settingsRepository.getUserTheme(userId);
  }

  // Get notification preferences for user
  async getNotificationPreferences(userId: string) {
    return await this.settingsRepository.getNotificationSettings(userId);
  }

  // Get security preferences for user
  async getSecurityPreferences(userId: string) {
    return await this.settingsRepository.getSecuritySettings(userId);
  }

  // Get operational preferences for user
  async getOperationalPreferences(userId: string) {
    return await this.settingsRepository.getOperationalSettings(userId);
  }

  // Get system preferences for user
  async getSystemPreferences(userId: string) {
    return await this.settingsRepository.getPreferenceSettings(userId);
  }

  // Update specific preference categories with validation
  async updateNotificationPreferences(userId: string, data: any) {
    this.settingsValidator.validateNotificationPreferences(data);
    return this.updateByUserId(userId, data);
  }

  async updateSecurityPreferences(userId: string, data: any) {
    this.settingsValidator.validateSecuritySettings(data);
    return this.updateByUserId(userId, data);
  }

  async updateOperationalPreferences(userId: string, data: any) {
    this.settingsValidator.validateOperationalSettings(data);
    return this.updateByUserId(userId, data);
  }

  // Analytics methods
  async getLanguageDistribution() {
    return await this.settingsRepository.getLanguageDistribution();
  }

  async getThemeDistribution() {
    return await this.settingsRepository.getThemeDistribution();
  }

  async getNotificationAnalytics() {
    return await this.settingsRepository.getNotificationEnabledCount();
  }

  async getSettingsWithUsers() {
    return await this.settingsRepository.getSettingsWithUsers();
  }

  // Seed demo settings for multiple users
  async seedDemoSettings(settingsData: any[]) {
    const createdSettings = [];
    for (const settingData of settingsData) {
      try {
        const settings = await this.create(settingData);
        createdSettings.push(settings);
      } catch (error) {
        continue;
      }
    }

    return createdSettings;
  }
}