import { Injectable } from 'najm-api';
import { TrackerRepository } from './TrackerRepository';
import { TrackerValidator } from './TrackerValidator';

@Injectable()
export class TrackerService {

  constructor(
    private trackerRepository: TrackerRepository,
    private trackerValidator: TrackerValidator,
  ) { }

  async getAll() {
    return await this.trackerRepository.getAll();
  }

  async getById(id) {
    await this.trackerValidator.checkTrackerExists(id);
    return await this.trackerRepository.getById(id);
  }

  async getByDeviceId(deviceId) {
    await this.trackerValidator.checkDeviceIdExists(deviceId);
    return await this.trackerRepository.getByDeviceId(deviceId);
  }

  async getByVehicleId(vehicleId) {
    await this.trackerValidator.checkVehicleExists(vehicleId);
    return await this.trackerRepository.getByVehicleId(vehicleId);
  }

  async getByOperatorId(operatorId) {
    return await this.trackerRepository.getByOperatorId(operatorId);
  }

  async getPhoneTrackers() {
    return await this.trackerRepository.getPhoneTrackers();
  }

  async getByStatus(status) {
    await this.trackerValidator.validateTrackerStatus(status);
    return await this.trackerRepository.getByStatus(status);
  }

  async getOnlineTrackers() {
    return await this.trackerRepository.getOnlineTrackers();
  }

  async getOfflineTrackers() {
    return await this.trackerRepository.getOfflineTrackers();
  }

  async getCount() {
    return await this.trackerRepository.getCount();
  }

  async create(data) {
    const {
      id,
      deviceId,
      name,
      operatorId,
      vehicleId,
      status,
      manufacturer,
      source,
      mode,
      refreshInterval,
      refreshUnit
    } = data;

    if (id) {
      await this.trackerValidator.checkTrackerIdIsUnique(id);
    }

    if (deviceId) {
      await this.trackerValidator.checkDeviceIdIsUnique(deviceId);
    }

    if (mode) {
      await this.trackerValidator.validateTrackerMode(mode);
    }

    if (refreshInterval !== undefined || refreshUnit !== undefined) {
      await this.trackerValidator.validateRefreshSettings({
        refreshInterval: refreshInterval || 60,
        refreshUnit: refreshUnit || 's'
      });
    }

    if (vehicleId) {
      await this.trackerValidator.checkVehicleExists(vehicleId);
      if (source === 'physical') {
        await this.trackerValidator.checkVehicleHasNoTracker(vehicleId);
      }
    }

    const trackerData = {
      ...(id && { id }),
      deviceId,
      name,
      ...(operatorId && { operatorId }),
      ...(vehicleId && { vehicleId }),
      manufacturer: manufacturer || 'Unknown',
      source: source || 'physical',
      mode: mode || 'tracking',
      status: status || 'active',
      refreshInterval: refreshInterval || 60,
      refreshUnit: refreshUnit || 's',
    };

    await this.trackerValidator.validateCreateTracker(trackerData);
    const newTracker = await this.trackerRepository.create(trackerData);

    return await this.getById(newTracker.id);
  }

  async createPhoneTracker(operatorId, operatorName) {

    const existingPhoneTracker = await this.trackerRepository.getByOperatorId(operatorId);
    if (existingPhoneTracker && existingPhoneTracker.source === 'phone') {
      return existingPhoneTracker;
    }

    const phoneTrackerData = {
      deviceId: `PHONE_${operatorId}`,
      name: `${operatorName} Phone`,
      operatorId: operatorId,
      vehicleId: null,
      source: 'phone',
      manufacturer: 'Mobile Device',
      mode: 'sleep_time',
      status: 'active',
      refreshInterval: 120,
      refreshUnit: 's'
    };

    return await this.create(phoneTrackerData);
  }

  async update(id, data) {
    await this.trackerValidator.checkTrackerExists(id);

    const tracker = await this.trackerRepository.getById(id);
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.deviceId !== undefined) updateData.deviceId = data.deviceId;
    if (data.vehicleId !== undefined) updateData.vehicleId = data.vehicleId;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.manufacturer !== undefined) updateData.manufacturer = data.manufacturer;
    if (data.mode !== undefined) updateData.mode = data.mode;
    if (data.refreshInterval !== undefined) updateData.refreshInterval = data.refreshInterval;
    if (data.refreshUnit !== undefined) updateData.refreshUnit = data.refreshUnit;

    if (updateData.deviceId && updateData.deviceId !== tracker.deviceId) {
      await this.trackerValidator.checkDeviceIdIsUnique(updateData.deviceId);
    }

    if (updateData.vehicleId && updateData.vehicleId !== tracker.vehicleId) {
      await this.trackerValidator.checkVehicleExists(updateData.vehicleId);
      await this.trackerValidator.checkVehicleHasNoTracker(updateData.vehicleId);
    }

    if (updateData.status) {
      await this.trackerValidator.validateTrackerStatus(updateData.status);
    }

    if (updateData.mode) {
      await this.trackerValidator.validateTrackerMode(updateData.mode);
    }

    if (updateData.refreshInterval !== undefined || updateData.refreshUnit !== undefined) {
      await this.trackerValidator.validateRefreshSettings({
        refreshInterval: updateData.refreshInterval !== undefined ? updateData.refreshInterval : tracker.refreshInterval,
        refreshUnit: updateData.refreshUnit !== undefined ? updateData.refreshUnit : tracker.refreshUnit
      });
    }

    if (Object.keys(updateData).length > 0) {
      await this.trackerRepository.update(id, updateData);
    }

    return await this.getById(id);
  }

  async updateStatus(id, status) {
    await this.trackerValidator.checkTrackerExists(id);
    await this.trackerValidator.validateTrackerStatus(status);

    return await this.trackerRepository.update(id, { status });
  }

  async updateMode(id, mode) {
    await this.trackerValidator.checkTrackerExists(id);
    await this.trackerValidator.validateTrackerMode(mode);

    return await this.trackerRepository.update(id, { mode });
  }

  async updateRefreshSettings(id, refreshInterval, refreshUnit) {
    await this.trackerValidator.checkTrackerExists(id);
    await this.trackerValidator.validateRefreshSettings({ refreshInterval, refreshUnit });

    return await this.trackerRepository.update(id, {
      refreshInterval,
      refreshUnit
    });
  }

  async bulkUpdate(ids, updates) {
    await this.trackerValidator.validateBulkUpdate({ ids, updates });

    const results = [];
    for (const id of ids) {
      try {
        const result = await this.update(id, updates);
        results.push(result);
      } catch (error) {
        continue;
      }
    }

    return {
      successful: results.length,
      total: ids.length,
      results
    };
  }

  async delete(id) {
    await this.trackerValidator.checkTrackerExists(id);
    await this.trackerValidator.checkTrackerCanBeDeleted(id);

    return await this.trackerRepository.delete(id);
  }

  async deleteAll() {
    return await this.trackerRepository.deleteAll();
  }

  async markOfflineTrackers(timeoutMinutes = 30) {
    return await this.trackerRepository.markOfflineTrackers(timeoutMinutes);
  }

  async updateLocation(data) {
    const { deviceId, latitude, longitude, altitude, speed, batteryLevel, isMoving } = data;

    await this.trackerValidator.checkDeviceIdExists(deviceId);
    const tracker = await this.trackerRepository.getByDeviceId(deviceId);

    const locationData = {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude)
    };

    await this.trackerRepository.createLocationHistory({
      trackerId: tracker.id,
      location: locationData,
      altitude: altitude ? parseFloat(altitude) : null,
      speed: speed ? parseFloat(speed) : null,
      batteryLevel: batteryLevel ? parseInt(batteryLevel) : null,
      isMoving: isMoving || false,
    });

    await this.trackerRepository.update(tracker.id, {
      lastSeen: new Date().toISOString(),
      isOnline: true
    });

    return {
      success: true,
      trackerId: tracker.id,
      timestamp: new Date().toISOString()
    };
  }

  async getCurrentLocation(trackerId) {
    await this.trackerValidator.checkTrackerExists(trackerId);
    const currentLocation = await this.trackerRepository.getLocationHistory(trackerId, 1);
    return currentLocation[0] || null;
  }

  async getLocationHistory(trackerId, limit: number = 50) {
    await this.trackerValidator.checkTrackerExists(trackerId);
    return await this.trackerRepository.getLocationHistory(trackerId, limit);
  }

  async updateStatusFromDevice(data) {
    await this.trackerValidator.checkDeviceIdExists(data.deviceId);
    const tracker = await this.trackerRepository.getByDeviceId(data.deviceId);

    await this.trackerRepository.update(tracker.id, {
      lastSeen: data.lastSeen || new Date().toISOString(),
      isOnline: data.isOnline !== undefined ? data.isOnline : true
    });

    return tracker;
  }

  async seedDemoTrackers(trackersData) {
    const updatedTrackers = [];
    const createdTrackers = [];

    for (const trackerData of trackersData) {
      try {
        // Check if this is updating an existing operator tracker
        if (trackerData.deviceId && trackerData.deviceId.startsWith('PHONE_')) {
          const existingTracker = await this.trackerRepository.getByDeviceId(trackerData.deviceId);
          if (existingTracker) {
            await this.trackerRepository.update(existingTracker.id, trackerData);
            const updatedTracker = await this.getById(existingTracker.id);
            updatedTrackers.push(updatedTracker);
            continue;
          }
        }

        // Create new tracker if it doesn't exist
        const tracker = await this.create(trackerData);
        createdTrackers.push(tracker);
      } catch (error) {
        console.log(error.message);
        
        continue;
      }
    }

    return {
      updated: updatedTrackers.length,
      created: createdTrackers.length,
      total: trackersData.length,
      trackers: [...updatedTrackers, ...createdTrackers]
    };
  }
}