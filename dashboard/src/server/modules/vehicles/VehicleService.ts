import { Injectable } from 'najm-api';
import { VehicleRepository } from './VehicleRepository';
import { VehicleValidator } from './VehicleValidator';
import { FileService } from '../files';
import { TrackerService } from '../trackers/TrackerService';
import { nanoid } from 'nanoid';
import { formatDate, getAvatarFile } from '@/server/shared/utils';

@Injectable()
export class VehicleService {
  constructor(
    private vehicleRepository: VehicleRepository,
    private vehicleValidator: VehicleValidator,
    private fileService: FileService,
    private trackerService: TrackerService,
  ) { }

  async getAll() {
    return await this.vehicleRepository.getAll();
  }

  async getById(id) {
    await this.vehicleValidator.checkVehicleExists(id);
    return await this.vehicleRepository.getById(id);
  }

  async getByType(type) {
    await this.vehicleValidator.validateVehicleType(type);
    return await this.vehicleRepository.getByType(type);
  }

  async getByStatus(status) {
    await this.vehicleValidator.validateVehicleStatus(status);
    return await this.vehicleRepository.getByStatus(status);
  }

  async getActiveVehicles() {
    return await this.vehicleRepository.getByStatus('active');
  }

  async getByLicensePlate(licensePlate) {
    await this.vehicleValidator.checkLicensePlateExists(licensePlate);
    return await this.vehicleRepository.getByLicensePlate(licensePlate);
  }

  async getVehicleTypes() {
    return await this.vehicleRepository.getVehicleTypes();
  }

  async getCount() {
    return await this.vehicleRepository.getCount();
  }

  async create(data) {
    const {
      id,
      type,
      name,
      brand,
      model,
      year,
      licensePlate,
      image,
      purchaseDate,
      purchasePrice,
      status,
      fuelType,
      tankCapacity,
      initialHours,
      initialMileage,
      currentHours,
      currentMileage,
      notes
    } = data;

    const vehicleId = id || nanoid(5);

    if (id) {
      await this.vehicleValidator.checkVehicleIdIsUnique(id);
    }

    if (licensePlate) {
      await this.vehicleValidator.checkLicensePlateIsUnique(licensePlate);
    }

    if (year) {
      await this.vehicleValidator.checkYearIsValid(year);
    }

    const imageName = await this.fileService.handleImage(image, null, vehicleId);

    const vehicleDetails = {
      ...(id && { id }),
      type,
      name,
      brand,
      model,
      year,
      licensePlate,
      image: imageName,
      purchaseDate: formatDate(purchaseDate),
      purchasePrice,
      status: status || 'active',
      fuelType: fuelType || 'diesel',
      tankCapacity,
      initialHours: initialHours || '0',
      initialMileage: initialMileage || '0',
      currentHours,
      currentMileage,
      notes,
    }

    await this.vehicleValidator.validateCreateVehicle(vehicleDetails);

    return await this.vehicleRepository.create(vehicleDetails);

  }

  async update(id, data) {
    await this.vehicleValidator.checkVehicleExists(id);


    if (data.licensePlate) {
      await this.vehicleValidator.checkLicensePlateIsUnique(data.licensePlate, id);
    }

    if (data.year) {
      await this.vehicleValidator.checkYearIsValid(parseInt(data.year));
    }

    if (data.type) {
      await this.vehicleValidator.validateVehicleType(data.type);
    }

    if (data.status) {
      await this.vehicleValidator.validateVehicleStatus(data.status);
    }

    if (data.fuelType) {
      await this.vehicleValidator.validateFuelType(data.fuelType);
    }

    // Handle image update
    if (data.image !== undefined) {
      const currentVehicle = await this.vehicleRepository.getById(id);
      const imageName = await this.fileService.handleImage(data.image, currentVehicle.image, id);
      data.image = imageName;
    }

    return await this.vehicleRepository.update(id, data);
  }

  async updateStatus(id, status) {
    await this.vehicleValidator.checkVehicleExists(id);
    await this.vehicleValidator.validateVehicleStatus(status);

    return await this.vehicleRepository.update(id, { status });
  }

  async delete(id) {
    await this.vehicleValidator.checkVehicleExists(id);
    await this.vehicleValidator.checkVehicleNotInUse(id);

    const vehicle = await this.vehicleRepository.delete(id);
    return vehicle;
  }

  async getVehicleUsageStats(id) {
    await this.vehicleValidator.checkVehicleExists(id);
    return await this.vehicleRepository.getUsageStats(id);
  }

  async getMaintenanceDueVehicles() {
    return await this.vehicleRepository.getMaintenanceDueVehicles();
  }

  async deleteAll() {
    return await this.vehicleRepository.deleteAll();
  }

  async getVehiclesInUse() {
    return await this.vehicleRepository.getVehiclesInUse();
  }

  async getStatusDistribution() {
    return await this.vehicleRepository.getStatusDistribution();
  }

  async getTypeDistribution() {
    return await this.vehicleRepository.getTypeDistribution();
  }

  async getAgeAnalysis() {
    return await this.vehicleRepository.getAgeAnalysis();
  }

  async getFuelDistribution() {
    return await this.vehicleRepository.getFuelDistribution();
  }

  async getBrandAnalysis() {
    return await this.vehicleRepository.getBrandAnalysis();
  }

  async getUtilizationAnalytics() {
    return await this.vehicleRepository.getUtilizationAnalytics();
  }

  async updateCurrentMileage(id, mileage) {
    await this.vehicleValidator.checkVehicleExists(id);
    await this.vehicleValidator.validateMileage(mileage);

    const updateData = {
      currentMileage: mileage.toString()
    };
    return await this.vehicleRepository.update(id, updateData);
  }

  async updateCurrentHours(id, hours) {
    await this.vehicleValidator.checkVehicleExists(id);
    await this.vehicleValidator.validateEngineHours(hours);

    const updateData = {
      currentHours: hours.toString()
    };
    return await this.vehicleRepository.update(id, updateData);
  }

  async getTotalFleetMileage() {
    return await this.vehicleRepository.getTotalFleetMileage();
  }

  async getMonthlyFleetMileage() {
    return await this.vehicleRepository.getMonthlyFleetMileage();
  }

  async getVehiclesLocations() {
    return await this.vehicleRepository.getVehiclesLocations();
  }

  async seedDemoVehicles(vehiclesData) {
    const createdVehicles = [];

    const vehicleTypeImages = {
      'tractor': 'tractor.png',
      'harvester': 'harvester.png',
      'sprayer': 'sprayer.png',
      'seeder': 'seeder.png',
      'cultivator': 'cultivator.png'
    };

    for (const vehicleData of vehiclesData) {
      try {
        const imageFileName = vehicleTypeImages[vehicleData.type] || 'tractor.png';
        const avatarFile = await getAvatarFile(imageFileName);
        
        const vehicle = await this.create({
          ...vehicleData,
          image: avatarFile
        });

        createdVehicles.push(vehicle);
      } catch (error) {
        continue;
      }
    }
    return createdVehicles;
  }

}