import { Injectable, t } from 'najm-api';
import { TrackerRepository } from './TrackerRepository';
import { VehicleRepository } from '../vehicles/VehicleRepository';

import { createTrackerSchema } from '@/server/database/schema';
import { parseSchema } from '@/server/shared/utils';

@Injectable()
export class TrackerValidator {
  constructor(
    private trackerRepository: TrackerRepository,
    private vehicleRepository: VehicleRepository,
  ) { }

  async validateCreateTracker(data: any) {
    return parseSchema(createTrackerSchema, data);
  }

  async validateCreate(data: any) {
    await this.validateCreateTracker(data);

    // Additional validations
    if (data.deviceId) {
      await this.checkDeviceIdIsUnique(data.deviceId);
    }

    if (data.vehicleId) {
      await this.checkVehicleExists(data.vehicleId);
      await this.checkVehicleHasNoTracker(data.vehicleId);
    }

    this.validateTrackerName(data.name);

    if (data.status) {
      this.validateTrackerStatus(data.status);
    }

    return true;
  }

  async validateUpdate(id: string, data: any) {
    await this.checkTrackerExists(id);

    const tracker = await this.trackerRepository.getById(id);

    if (data.deviceId && data.deviceId !== tracker.deviceId) {
      await this.checkDeviceIdIsUnique(data.deviceId);
    }

    if (data.vehicleId && data.vehicleId !== tracker.vehicleId) {
      await this.checkVehicleExists(data.vehicleId);
      await this.checkVehicleHasNoTracker(data.vehicleId);
    }

    if (data.name) {
      this.validateTrackerName(data.name);
    }

    if (data.status) {
      this.validateTrackerStatus(data.status);
    }

    if (data.batteryLevel !== undefined) {
      this.validateBatteryLevel(data.batteryLevel);
    }

    return true;
  }

  async validateDelete(id: string) {
    await this.checkTrackerExists(id);
    await this.checkTrackerCanBeDeleted(id);
    return true;
  }

  async validateLocationUpdate(deviceId: string, data: any) {
    const { latitude, longitude, timestamp, batteryLevel } = data;

    await this.checkDeviceIdExists(deviceId);

    if (!latitude || !longitude) {
      throw new Error(t('trackers.errors.invalidLocation'));
    }

    this.validateCoordinates(latitude, longitude);

    if (timestamp) {
      this.validateTimestamp(timestamp);
    }

    if (batteryLevel !== undefined) {
      this.validateBatteryLevel(batteryLevel);
    }

    return true;
  }

  async validateBulkUpdate(data: any) {
    const { ids, updates } = data;

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error(t('trackers.errors.invalidIds'));
    }

    if (!updates || typeof updates !== 'object') {
      throw new Error(t('trackers.errors.invalidUpdates'));
    }

    // Validate each ID exists
    for (const id of ids) {
      await this.checkTrackerExists(id);
    }

    // Validate update data
    if (updates.status) {
      this.validateTrackerStatus(updates.status);
    }

    if (updates.batteryLevel !== undefined) {
      this.validateBatteryLevel(updates.batteryLevel);
    }

    return true;
  }

  //======================= Existence Checks

  async isTrackerExists(id: string) {
    const existingTracker = await this.trackerRepository.getById(id);
    return !!existingTracker;
  }

  async isDeviceIdExists(deviceId: string) {
    if (!deviceId) return false;
    const existingTracker = await this.trackerRepository.getByDeviceId(deviceId);
    return !!existingTracker;
  }

  async isVehicleExists(vehicleId: string) {
    if (!vehicleId) return false;
    const existingVehicle = await this.vehicleRepository.getById(vehicleId);
    return !!existingVehicle;
  }

  async checkTrackerExists(id: string) {
    const trackerExists = await this.isTrackerExists(id);
    if (!trackerExists) {
      throw new Error(t('trackers.errors.notFound'));
    }
    return true;
  }

  async checkDeviceIdExists(deviceId: string) {
    const tracker = await this.trackerRepository.getByDeviceId(deviceId);
    if (!tracker) {
      throw new Error(t('trackers.errors.deviceNotFound'));
    }
    return tracker;
  }

  async checkVehicleExists(vehicleId: string) {
    const vehicleExists = await this.isVehicleExists(vehicleId);
    if (!vehicleExists) {
      throw new Error(t('vehicles.errors.notFound'));
    }
    return true;
  }

  //======================= Uniqueness Checks

  async checkTrackerIdIsUnique(id: string) {
    const existingTracker = await this.trackerRepository.getById(id);
    if (existingTracker) {
      throw new Error(t('trackers.errors.idExists'));
    }
  }

  async checkDeviceIdIsUnique(deviceId: string, excludeId = null) {
    if (!deviceId) return;

    this.validateDeviceId(deviceId);

    const existingTracker = await this.trackerRepository.getByDeviceId(deviceId);
    if (existingTracker && existingTracker.id !== excludeId) {
      throw new Error(t('trackers.errors.deviceIdExists'));
    }
  }

  async checkVehicleHasNoTracker(vehicleId: string, excludeId = null) {
    const existingTracker = await this.trackerRepository.getByVehicleId(vehicleId);
    if (existingTracker && existingTracker.id !== excludeId) {
      throw new Error(t('trackers.errors.vehicleAlreadyHasTracker'));
    }
  }

  //======================= Business Rules Checks

  async checkTrackerCanBeDeleted(trackerId: string) {
    // For now, we allow deletion. Add business rules if needed
    // For example, check if tracker is currently tracking active operations
    return true;
  }

  async checkTrackerCanBeUpdated(trackerId: string, newStatus: string) {
    if (newStatus === 'inactive') {
      // Add any business rules for deactivating trackers
    }
    return true;
  }

  //======================= Input Validation Helpers

  validateTrackerName(name: string) {
    if (!name || name.trim().length < 2) {
      throw new Error(t('trackers.errors.invalidName'));
    }
    return true;
  }

  validateDeviceId(deviceId: string) {
    if (!deviceId || deviceId.trim().length < 3) {
      throw new Error(t('trackers.errors.invalidDeviceId'));
    }

    // Basic device ID format validation (adjust based on your device format)
    const deviceIdRegex = /^[A-Za-z0-9_-]{3,50}$/;
    if (!deviceIdRegex.test(deviceId.trim())) {
      throw new Error(t('trackers.errors.invalidDeviceIdFormat'));
    }

    return true;
  }

  validateTrackerStatus(status: string) {
    const validStatuses = ['active', 'inactive'];
    if (!validStatuses.includes(status)) {
      throw new Error(t('trackers.errors.invalidStatus'));
    }
    return true;
  }

  validateBatteryLevel(batteryLevel: any) {
    if (batteryLevel === null || batteryLevel === undefined) {
      return true; // Allow null battery levels
    }

    const numericLevel = parseInt(batteryLevel);
    if (isNaN(numericLevel) || numericLevel < 0 || numericLevel > 100) {
      throw new Error(t('trackers.errors.invalidBatteryLevel'));
    }
    return true;
  }

  validateCoordinates(latitude: any, longitude: any) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error(t('trackers.errors.invalidCoordinates'));
    }

    if (lat < -90 || lat > 90) {
      throw new Error(t('trackers.errors.invalidLatitude'));
    }

    if (lng < -180 || lng > 180) {
      throw new Error(t('trackers.errors.invalidLongitude'));
    }

    return true;
  }

  validateTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();

    if (isNaN(date.getTime())) {
      throw new Error(t('trackers.errors.invalidTimestamp'));
    }

    // Allow timestamps up to 1 hour in the future (for clock sync issues)
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    if (date > oneHourFromNow) {
      throw new Error(t('trackers.errors.futureTimestamp'));
    }

    return true;
  }

  validateDateRange(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error(t('trackers.errors.invalidDateRange'));
    }

    if (end <= start) {
      throw new Error(t('trackers.errors.endBeforeStart'));
    }

    // Limit date range to avoid performance issues
    const maxRangeDays = 365; // 1 year
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > maxRangeDays) {
      throw new Error(t('trackers.errors.dateRangeTooLarge'));
    }

    return true;
  }

  //======================= Additional Validations

  async validateExists(id: string) {
    return await this.checkTrackerExists(id);
  }

  validateOnlineStatus(isOnline: any) {
    if (typeof isOnline !== 'boolean') {
      throw new Error(t('trackers.errors.invalidOnlineStatus'));
    }
    return true;
  }

  validateLimit(limit: any) {
    const numericLimit = parseInt(limit);
    if (isNaN(numericLimit) || numericLimit < 1 || numericLimit > 1000) {
      throw new Error(t('trackers.errors.invalidLimit'));
    }
    return true;
  }

  validateOffset(offset: any) {
    const numericOffset = parseInt(offset);
    if (isNaN(numericOffset) || numericOffset < 0) {
      throw new Error(t('trackers.errors.invalidOffset'));
    }
    return true;
  }

  async validateTrackerMode(mode: string) {
    const validModes = ['tracking', 'monitoring', 'gprs', 'sms', 'sleep_time', 'sleep_shock', 'sleep_deep'];
    if (!validModes.includes(mode)) {
      throw new Error(`Invalid tracker mode: ${mode}`);
    }
  }

  async validateRefreshSettings({ refreshInterval, refreshUnit }: { refreshInterval: number, refreshUnit: string }) {
    const validUnits = ['s', 'm', 'h'];

    if (!validUnits.includes(refreshUnit)) {
      throw new Error(`Invalid refresh unit: ${refreshUnit}`);
    }

    if (refreshInterval < 20 || refreshInterval > 999) {
      throw new Error('Refresh interval must be between 20 and 999');
    }

    // Additional validation for specific unit constraints if needed
    if (refreshUnit === 's' && refreshInterval < 20) {
      throw new Error('Minimum refresh interval for seconds is 20');
    }
  }
}