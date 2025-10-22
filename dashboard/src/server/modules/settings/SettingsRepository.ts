import { DB } from '@/server/database/db';
import { settings, users } from '@/server/database/schema';
import { Repository } from '@/server/shared/decorators';
import { count, eq, desc, sql } from 'drizzle-orm';

@Repository()
export class SettingsRepository {

  declare db: DB;

  async getAll() {
    return await this.db
      .select()
      .from(settings)
      .orderBy(desc(settings.createdAt));
  }

  async getById(id: string) {
    const [existingSettings] = await this.db
      .select()
      .from(settings)
      .where(eq(settings.id, id))
      .limit(1);
    return existingSettings;
  }

  async getByUserId(userId: string) {
    const [userSettings] = await this.db
      .select()
      .from(settings)
      .where(eq(settings.userId, userId))
      .limit(1);
    return userSettings;
  }

  async getCount() {
    const [settingsCount] = await this.db
      .select({ count: count() })
      .from(settings);
    return settingsCount;
  }

  async create(data: any) {
    const [newSettings] = await this.db
      .insert(settings)
      .values(data)
      .returning();
    return newSettings;
  }

  async update(id: string, data: any) {
    const [updatedSettings] = await this.db
      .update(settings)
      .set(data)
      .where(eq(settings.id, id))
      .returning();
    return updatedSettings;
  }

  async updateByUserId(userId: string, data: any) {
    const [updatedSettings] = await this.db
      .update(settings)
      .set(data)
      .where(eq(settings.userId, userId))
      .returning();
    return updatedSettings;
  }

  async delete(id: string) {
    const [deletedSettings] = await this.db
      .delete(settings)
      .where(eq(settings.id, id))
      .returning();
    return deletedSettings;
  }

  async deleteByUserId(userId: string) {
    const [deletedSettings] = await this.db
      .delete(settings)
      .where(eq(settings.userId, userId))
      .returning();
    return deletedSettings;
  }

  async deleteAll() {
    const allSettings = await this.db
      .select()
      .from(settings)
      .orderBy(desc(settings.createdAt));

    const deletedSettings = await this.db
      .delete(settings)
      .returning();

    return {
      deletedCount: deletedSettings.length,
      deletedSettings: deletedSettings
    };
  }

  async createDefaultForUser(userId: string) {
    const defaultSettings = {
      userId,
      // Notification Settings
      maintenanceAlerts: true,
      fuelLowAlerts: true,
      operationUpdates: true,
      systemNotifications: true,
      emailNotifications: false,
      smsNotifications: false,
      
      // Security Settings
      twoFactorEnabled: false,
      sessionTimeout: '30',
      passwordRequireSymbols: true,
      loginNotifications: true,
      
      // Operational Settings
      autoTrackLocation: true,
      maintenanceReminders: true,
      fuelThresholdAlerts: true,
      operationAutoStart: false,
      fuelThreshold: '20',
      maintenanceInterval: '30',
      locationUpdateInterval: '5',
      
      // Preferences
      timeZone: 'UTC',
      language: 'en',
      theme: 'system',
    };

    return this.create(defaultSettings);
  }

  async upsert(userId: string, data: any) {
    const existing = await this.getByUserId(userId);
    if (existing) {
      return this.updateByUserId(userId, data);
    } else {
      return this.create({ ...data, userId });
    }
  }

  async getNotificationSettings(userId: string) {
    const userSettings = await this.getByUserId(userId);
    if (!userSettings) return null;

    return {
      maintenanceAlerts: userSettings.maintenanceAlerts,
      fuelLowAlerts: userSettings.fuelLowAlerts,
      operationUpdates: userSettings.operationUpdates,
      systemNotifications: userSettings.systemNotifications,
      emailNotifications: userSettings.emailNotifications,
      smsNotifications: userSettings.smsNotifications,
    };
  }

  async getSecuritySettings(userId: string) {
    const userSettings = await this.getByUserId(userId);
    if (!userSettings) return null;

    return {
      twoFactorEnabled: userSettings.twoFactorEnabled,
      sessionTimeout: userSettings.sessionTimeout,
      passwordRequireSymbols: userSettings.passwordRequireSymbols,
      loginNotifications: userSettings.loginNotifications,
    };
  }

  async getOperationalSettings(userId: string) {
    const userSettings = await this.getByUserId(userId);
    if (!userSettings) return null;

    return {
      autoTrackLocation: userSettings.autoTrackLocation,
      maintenanceReminders: userSettings.maintenanceReminders,
      fuelThresholdAlerts: userSettings.fuelThresholdAlerts,
      operationAutoStart: userSettings.operationAutoStart,
      fuelThreshold: userSettings.fuelThreshold,
      maintenanceInterval: userSettings.maintenanceInterval,
      locationUpdateInterval: userSettings.locationUpdateInterval,
    };
  }

  async getPreferenceSettings(userId: string) {
    const userSettings = await this.getByUserId(userId);
    if (!userSettings) return null;

    return {
      timeZone: userSettings.timeZone,
      language: userSettings.language,
      theme: userSettings.theme,
    };
  }

  async getUserLanguage(userId: string) {
    const userSettings = await this.getByUserId(userId);
    return userSettings?.language || 'en';
  }

  async getUserTheme(userId: string) {
    const userSettings = await this.getByUserId(userId);
    return userSettings?.theme || 'system';
  }

  async getLanguageDistribution() {
    const result = await this.db
      .select({
        language: settings.language,
        count: sql<number>`count(*)`
      })
      .from(settings)
      .groupBy(settings.language)
      .orderBy(desc(sql<number>`count(*)`));

    return result.map(item => ({
      name: item.language,
      value: Number(item.count),
      language: item.language
    }));
  }

  async getThemeDistribution() {
    const result = await this.db
      .select({
        theme: settings.theme,
        count: sql<number>`count(*)`
      })
      .from(settings)
      .groupBy(settings.theme)
      .orderBy(desc(sql<number>`count(*)`));

    return result.map(item => ({
      name: item.theme,
      value: Number(item.count),
      theme: item.theme
    }));
  }

  async getNotificationEnabledCount() {
    const [result] = await this.db
      .select({
        maintenanceAlertsCount: sql<number>`count(*) FILTER (WHERE ${settings.maintenanceAlerts} = true)`,
        fuelLowAlertsCount: sql<number>`count(*) FILTER (WHERE ${settings.fuelLowAlerts} = true)`,
        operationUpdatesCount: sql<number>`count(*) FILTER (WHERE ${settings.operationUpdates} = true)`,
        emailNotificationsCount: sql<number>`count(*) FILTER (WHERE ${settings.emailNotifications} = true)`,
        smsNotificationsCount: sql<number>`count(*) FILTER (WHERE ${settings.smsNotifications} = true)`,
      })
      .from(settings);

    return result;
  }

  async getSettingsWithUsers() {
    return await this.db
      .select({
        id: settings.id,
        userId: settings.userId,
        userName: users.name,
        userEmail: users.email,
        language: settings.language,
        theme: settings.theme,
        maintenanceAlerts: settings.maintenanceAlerts,
        fuelLowAlerts: settings.fuelLowAlerts,
        emailNotifications: settings.emailNotifications,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
      })
      .from(settings)
      .leftJoin(users, eq(settings.userId, users.id))
      .orderBy(desc(settings.createdAt));
  }
}