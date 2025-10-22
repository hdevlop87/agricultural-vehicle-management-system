import { Injectable } from 'najm-api';
import { OperatorRepository } from './OperatorRepository';
import { OperatorValidator } from './OperatorValidator';
import { UserService } from '../users/UserService';
import { TrackerService } from '../trackers/TrackerService';
import { formatDate, getAvatarFile } from '@/server/shared/utils';

@Injectable()
export class OperatorService {

  constructor(
    private operatorRepository: OperatorRepository,
    private operatorValidator: OperatorValidator,
    private userService: UserService,
    private trackerService: TrackerService,
  ) { }

  async getAll() {
    return await this.operatorRepository.getAll();
  }

  async getById(id) {
    await this.operatorValidator.checkOperatorExists(id);
    return await this.operatorRepository.getById(id);
  }

  async getByCin(cin) {
    await this.operatorValidator.checkCinExists(cin);
    return await this.operatorRepository.getByCin(cin);
  }

  async getByUserId(userId) {
    return await this.operatorRepository.getByUserId(userId);
  }

  async resolveOperatorId(requestedId, user) {
    if (user?.role === 'Admin') {
      return requestedId;
    }
    const operator = await this.getByUserId(user.id);
    return operator?.id;
  }

  async getByStatus(status) {
    await this.operatorValidator.validateOperatorStatus(status);
    return await this.operatorRepository.getByStatus(status);
  }

  async getByLicenseNumber(licenseNumber) {
    await this.operatorValidator.checkLicenseNumberExists(licenseNumber);
    return await this.operatorRepository.getByLicenseNumber(licenseNumber);
  }

  async getLicenseExpiringOperators() {
    return await this.operatorRepository.getLicenseExpiringOperators();
  }

  async getCount() {
    return await this.operatorRepository.getCount();
  }

  async create(data) {
    const {
      // Optional custom IDs
      userId,
      operatorId,
      // User data
      name,
      email,
      image,
      // Operator data
      cin,
      phone,
      licenseNumber,
      licenseExpiry,
      hireDate,
      status,
      hourlyRate,
      role
    } = data;

    if (userId) {
      await this.operatorValidator.checkUserIdIsUnique(userId);
    }

    if (operatorId) {
      await this.operatorValidator.checkOperatorIdIsUnique(operatorId);
    }

    if (cin) {
      await this.operatorValidator.checkCinIsUnique(cin);
    }

    if (licenseNumber) {
      await this.operatorValidator.checkLicenseNumberIsUnique(licenseNumber);
    }

    if (licenseExpiry) {
      await this.operatorValidator.validateLicenseExpiry(licenseExpiry);
    }

    let createdUser = null;
    let phoneTracker = null;

    try {
      const userData = {
        ...(userId && { id: userId }),
        name,
        email,
        image,
        role
      };

      createdUser = await this.userService.create(userData);

      const operatorDetails = {
        ...(operatorId && { id: operatorId }),
        userId: createdUser.id,
        cin,
        phone,
        licenseNumber,
        licenseExpiry: formatDate(licenseExpiry),
        hireDate: formatDate(hireDate),
        status: status || 'active',
        hourlyRate,
      };

      await this.operatorValidator.validateCreateOperator(operatorDetails);
      const newOperator = await this.operatorRepository.create(operatorDetails);
      phoneTracker = await this.trackerService.createPhoneTracker(newOperator.id, createdUser.name);

      return {
        ...newOperator,
        user: createdUser,
        phoneTracker: phoneTracker
      };

    } catch (error) {
      if (createdUser) {
        await this.userService.delete(createdUser.id);
      }
      if (phoneTracker) {
        await this.trackerService.delete(phoneTracker.id);
      }
      throw error;
    }
  }

  async update(id, data) {
    await this.operatorValidator.checkOperatorExists(id);

    const operator = await this.operatorRepository.getById(id);

    const userData: any = {};
    const operatorData: any = {};

    if (data.name !== undefined) userData.name = data.name;
    if (data.email !== undefined) userData.email = data.email;
    if (data.image !== undefined) userData.image = data.image;
    if (data.password !== undefined) userData.password = data.password;

    if (data.cin !== undefined) operatorData.cin = data.cin;
    if (data.phone !== undefined) operatorData.phone = data.phone;
    if (data.licenseNumber !== undefined) operatorData.licenseNumber = data.licenseNumber;
    if (data.licenseExpiry !== undefined) operatorData.licenseExpiry = formatDate(data.licenseExpiry);
    if (data.hireDate !== undefined) operatorData.hireDate = formatDate(data.hireDate);
    if (data.status !== undefined) operatorData.status = data.status;
    if (data.hourlyRate !== undefined) operatorData.hourlyRate = data.hourlyRate;

    if (operatorData.cin) {
      await this.operatorValidator.checkCinIsUnique(operatorData.cin, id);
    }

    if (operatorData.licenseNumber) {
      await this.operatorValidator.checkLicenseNumberIsUnique(operatorData.licenseNumber, id);
    }

    if (operatorData.status) {
      await this.operatorValidator.validateOperatorStatus(operatorData.status);
    }

    if (operatorData.licenseExpiry) {
      await this.operatorValidator.validateLicenseExpiry(operatorData.licenseExpiry);
    }

    if (operatorData.hourlyRate) {
      await this.operatorValidator.validateHourlyRate(operatorData.hourlyRate);
    }



    if (Object.keys(userData).length > 0) {
      await this.userService.update(operator.userId, userData);
    }

    if (Object.keys(operatorData).length > 0) {
      await this.operatorRepository.update(id, operatorData);
    }

    return await this.getById(id);
  }

  async updateStatus(id, status) {
    await this.operatorValidator.checkOperatorExists(id);
    await this.operatorValidator.validateOperatorStatus(status);

    return await this.operatorRepository.update(id, { status });
  }

  async delete(id) {
    await this.operatorValidator.checkOperatorExists(id);
    await this.operatorValidator.checkOperatorNotInUse(id);
    const operator = await this.operatorRepository.getById(id);
    const deletedOperator = await this.operatorRepository.delete(id);
    await this.userService.delete(operator.userId);
    return deletedOperator;
  }

  async deleteAll() {
    return await this.operatorRepository.deleteAll();
  }

  async getOperations(id) {
    await this.operatorValidator.checkOperatorExists(id);
    return await this.operatorRepository.getOperatorOperations(id);
  }

  async getFuelConsumption(operatorId) {
    await this.operatorValidator.checkOperatorExists(operatorId);
    return await this.operatorRepository.getFuelConsumption(operatorId);
  }

  async getCompletedOperationCount(id) {
    await this.operatorValidator.checkOperatorExists(id);
    return await this.operatorRepository.getCompletedOperationCount(id);
  }

  async getCompletedOperationDuration(id) {
    await this.operatorValidator.checkOperatorExists(id);
    return await this.operatorRepository.getCompletedOperationDuration(id);
  }

  async getAllOperationCount(id) {
    await this.operatorValidator.checkOperatorExists(id);
    return await this.operatorRepository.getAllOperationCount(id);
  }

  async getAnalytics(id) {
    await this.operatorValidator.checkOperatorExists(id);
    return await this.operatorRepository.getOperatorAnalytics(id);
  }

  async getAvailableOperators(date, startTime, endTime) {
    await this.operatorValidator.validateDateRange(date, startTime, endTime);
    return await this.operatorRepository.getAvailableOperators(date, startTime, endTime);
  }

  async seedDemoOperators(operatorsData) {
    const createdOperators = [];

    for (let index = 0; index < operatorsData.length; index++) {
      const operatorData = operatorsData[index];
      const avatarNumber = index + 1;

      try {
        const fileName = `avatar${avatarNumber}.png`;
        const avatarFile = await getAvatarFile(fileName);
        const operator = await this.create({
          ...operatorData,
          image: avatarFile
        });

        createdOperators.push(operator);
      } catch (error) {
        continue;
      }
    }

    return createdOperators;
  }

}