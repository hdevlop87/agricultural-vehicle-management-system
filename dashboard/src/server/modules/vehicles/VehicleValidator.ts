import { Injectable, t } from 'najm-api';
import { VehicleRepository } from './VehicleRepository';
import { createVehicleSchema } from '@/server/database/schema';
import { parseSchema } from '@/server/shared/utils';

@Injectable()
export class VehicleValidator {
  constructor(
    private vehicleRepository: VehicleRepository,
  ) { }

  async validateCreateVehicle(data) {
    return parseSchema(createVehicleSchema, data);
  }

  async checkVehicleIdIsUnique(id) {
    const existingVehicle = await this.vehicleRepository.getById(id);
    if (existingVehicle) {
      throw new Error(t('vehicles.errors.idExists'));
    }
  }

  async isVehicleExists(id) {
    const existingVehicle = await this.vehicleRepository.getById(id);
    return !!existingVehicle;
  }


  async isLicensePlateExists(licensePlate) {
    if (!licensePlate) return false;
    const existingVehicle = await this.vehicleRepository.getByLicensePlate(licensePlate);
    return !!existingVehicle;
  }

  async isVehicleInUse(vehicleId) {
    return await this.vehicleRepository.checkVehicleInUse(vehicleId);
  }

  validateVehicleType(type) {
    const validTypes = ['tractor', 'harvester', 'sprayer', 'seeder', 'cultivator', 'other'];
    if (!validTypes.includes(type)) {
      throw new Error(t('vehicles.errors.invalidType'));
    }
    return true;
  }

  validateVehicleStatus(status) {
    const validStatuses = ['active', 'maintenance', 'retired'];
    if (!validStatuses.includes(status)) {
      throw new Error(t('vehicles.errors.invalidStatus'));
    }
    return true;
  }

  validateFuelType(fuelType) {
    const validFuelTypes = ['diesel', 'gasoline', 'electric', 'hybrid'];
    if (!validFuelTypes.includes(fuelType)) {
      throw new Error(t('vehicles.errors.invalidFuelType'));
    }
    return true;
  }

  checkYearIsValid(year) {
    const currentYear = new Date().getFullYear();
    const minYear = 1900;

    if (year < minYear || year > currentYear) {
      throw new Error(t('vehicles.errors.invalidYear', { minYear, currentYear }));
    }
    return true;
  }

  //======================= Existence Checks (throw errors)

  async checkVehicleExists(id) {
    const vehicleExists = await this.isVehicleExists(id);
    if (!vehicleExists) {
      throw new Error(t('vehicles.errors.notFound'));
    }
    return true;
  }


  async checkLicensePlateExists(licensePlate) {
    const vehicle = await this.vehicleRepository.getByLicensePlate(licensePlate);
    if (!vehicle) {
      throw new Error(t('vehicles.errors.notFound'));
    }
    return vehicle;
  }

  //======================= Uniqueness Checks (throw errors)

  async checkLicensePlateIsUnique(licensePlate, excludeId = null) {
    if (!licensePlate) return;

    const existingVehicle = await this.vehicleRepository.getByLicensePlate(licensePlate);
    if (existingVehicle && existingVehicle.id !== excludeId) {
      throw new Error(t('vehicles.errors.licensePlateExists'));
    }
  }

  //======================= Business Rules Checks

  async checkVehicleNotInUse(vehicleId) {
    const inUse = await this.isVehicleInUse(vehicleId);
    if (inUse) {
      throw new Error(t('vehicles.errors.inUse'));
    }
    return true;
  }

  async checkVehicleCanBeUpdated(vehicleId, newStatus) {
    if (newStatus === 'retired') {
      await this.checkVehicleNotInUse(vehicleId);
    }
    return true;
  }

  //======================= Input Validation Helpers

  validateEngineHours(hours) {
    const numericHours = parseFloat(hours);
    if (isNaN(numericHours) || numericHours < 0) {
      throw new Error(t('vehicles.errors.invalidEngineHours'));
    }
    return true;
  }

  validateMileage(mileage) {
    const numericMileage = parseFloat(mileage);
    if (isNaN(numericMileage) || numericMileage < 0) {
      throw new Error(t('vehicles.errors.invalidMileage'));
    }
    return true;
  }

  validateFuelCapacity(capacity) {
    if (!capacity) return true;

    const numericCapacity = parseFloat(capacity);
    if (isNaN(numericCapacity) || numericCapacity <= 0) {
      throw new Error(t('vehicles.errors.invalidFuelCapacity'));
    }
    return true;
  }

  validatePurchasePrice(price) {
    if (!price) return true;

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      throw new Error(t('vehicles.errors.invalidPurchasePrice'));
    }
    return true;
  }

  //======================= Delete All Validation

  async checkNoVehiclesInUse() {
    const vehiclesInUse = await this.vehicleRepository.getVehiclesInUse();
    if (vehiclesInUse.length > 0) {
      const vehicleNames = vehiclesInUse.map(v => v.vehicleName).join(', ');
      throw new Error(t('vehicles.errors.vehiclesInUseCannotDelete', { vehicleNames }));
    }
    return true;
  }

  async validateDeleteAllOperation() {
    // Check if any vehicles are currently in use
    await this.checkNoVehiclesInUse();

    // Get vehicle count for confirmation
    const count = await this.vehicleRepository.getCount();
    if (count.count === 0) {
      throw new Error(t('vehicles.errors.noVehiclesToDelete'));
    }

    return {
      vehicleCount: count.count,
      canDelete: true
    };
  }

}