import { Injectable, t } from 'najm-api';
import { OperatorRepository } from './OperatorRepository';

import { createOperatorSchema } from '@/server/database/schema';
import { parseSchema } from '@/server/shared/utils';
import { UserRepository } from '../users';

@Injectable()
export class OperatorValidator {
  constructor(
    private operatorRepository: OperatorRepository,
    private userRepository: UserRepository,
  ) { }

  async validateCreateOperator(data) {
    return parseSchema(createOperatorSchema, data);
  }

  async checkUserIdIsUnique(id: string) {
    const existingUser = await this.userRepository.getById(id);
    if (existingUser) {
      throw new Error(t('operators.errors.userIdExists'));
    }
  }

  async checkOperatorIdIsUnique(id: string) {
    const existingOperator = await this.operatorRepository.getById(id);
    if (existingOperator) {
      throw new Error(t('operators.errors.idExists'));
    }
  }

  async isOperatorExists(id) {
    const existingOperator = await this.operatorRepository.getById(id);
    return !!existingOperator;
  }

  async isCinExists(cin) {
    if (!cin) return false;
    const existingOperator = await this.operatorRepository.getByCin(cin);
    return !!existingOperator;
  }

  async isLicenseNumberExists(licenseNumber) {
    if (!licenseNumber) return false;
    const existingOperator = await this.operatorRepository.getByLicenseNumber(licenseNumber);
    return !!existingOperator;
  }

  async isEmailExists(email) {
    if (!email) return false;
    const existingOperator = await this.operatorRepository.getByEmail(email);
    return !!existingOperator;
  }

  async isOperatorInUse(operatorId) {
    return await this.operatorRepository.checkOperatorInUse(operatorId);
  }

  validateOperatorStatus(status) {
    const validStatuses = ['active', 'inactive', 'suspended'];
    if (!validStatuses.includes(status)) {
      throw new Error(t('operators.errors.invalidStatus'));
    }
    return true;
  }

  validateCin(cin) {
    if (!cin) return true;

    // Basic CIN validation - adjust regex based on your country's format
    // This example assumes alphanumeric format (adjust as needed)
    const cinRegex = /^[A-Z0-9]{8,12}$/;
    if (!cinRegex.test(cin.replace(/[\s\-]/g, ''))) {
      throw new Error(t('operators.errors.invalidCin'));
    }
    return true;
  }

  validateLicenseExpiry(licenseExpiry) {
    const expiryDate = new Date(licenseExpiry);
    const today = new Date();

    if (expiryDate < today) {
      throw new Error(t('operators.errors.licenseExpired'));
    }
    return true;
  }

  validateHourlyRate(hourlyRate) {
    const numericRate = parseFloat(hourlyRate);
    if (isNaN(numericRate) || numericRate < 0) {
      throw new Error(t('operators.errors.invalidHourlyRate'));
    }
    return true;
  }

  validatePhoneNumber(phone) {
    if (!phone) return true;

    // Basic phone number validation - adjust regex based on your requirements
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      throw new Error(t('validation.formats.invalidPhoneNumber'));
    }
    return true;
  }

  validateEmail(email) {
    if (!email) return true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(t('validation.formats.invalidEmail'));
    }
    return true;
  }

  validateDateRange(operationDate, startTime?, endTime?) {
    const date = new Date(operationDate);
    const today = new Date();

    const todayStart = new Date(today.setHours(0, 0, 0, 0));

    if (date < todayStart) {
      throw new Error(t('operators.errors.invalidOperationDate'));
    }

    if (startTime && endTime) {
      const start = new Date(`${date}T${startTime}`);
      const end = new Date(`${date}T${endTime}`);

      if (end <= start) {
        throw new Error(t('operators.errors.invalidTimeRange'));
      }
    }

    return true;
  }

  //======================= Existence Checks (throw errors)

  async checkOperatorExists(id) {
    const operatorExists = await this.isOperatorExists(id);
    if (!operatorExists) {
      throw new Error(t('operators.errors.notFound'));
    }
    return true;
  }

  async checkCinExists(cin) {
    const operator = await this.operatorRepository.getByCin(cin);
    if (!operator) {
      throw new Error(t('operators.errors.notFound'));
    }
    return operator;
  }

  async checkLicenseNumberExists(licenseNumber) {
    const operator = await this.operatorRepository.getByLicenseNumber(licenseNumber);
    if (!operator) {
      throw new Error(t('operators.errors.notFound'));
    }
    return operator;
  }

  //======================= Uniqueness Checks (throw errors)

  async checkCinIsUnique(cin, excludeId = null) {
    if (!cin) return;

    this.validateCin(cin);

    const existingOperator = await this.operatorRepository.getByCin(cin);
    if (existingOperator && existingOperator.id !== excludeId) {
      throw new Error(t('operators.errors.cinExists'));
    }
  }

  async checkLicenseNumberIsUnique(licenseNumber, excludeId = null) {
    if (!licenseNumber) return;

    const existingOperator = await this.operatorRepository.getByLicenseNumber(licenseNumber);
    if (existingOperator && existingOperator.id !== excludeId) {
      throw new Error(t('operators.errors.licenseExists'));
    }
  }

  async checkEmailIsUnique(email, excludeId = null) {
    if (!email) return;

    this.validateEmail(email);

    const existingOperator = await this.operatorRepository.getByEmail(email);
    if (existingOperator && existingOperator.id !== excludeId) {
      throw new Error(t('operators.errors.emailExists'));
    }
  }

  //======================= Business Rules Checks

  async checkOperatorNotInUse(operatorId) {
    const inUse = await this.isOperatorInUse(operatorId);
    if (inUse) {
      throw new Error(t('operators.errors.inUse'));
    }
    return true;
  }

  async checkOperatorCanBeUpdated(operatorId, newStatus) {
    if (newStatus === 'suspended') {
      await this.checkOperatorNotInUse(operatorId);
    }
    return true;
  }

  async checkLicenseNotExpired(operatorId) {
    const operator = await this.operatorRepository.getById(operatorId);
    if (operator.licenseExpiry) {
      const expiryDate = new Date(operator.licenseExpiry);
      const today = new Date();

      if (expiryDate < today) {
        throw new Error(t('operators.errors.licenseExpired'));
      }
    }
    return true;
  }

  //======================= Input Validation Helpers

  validateHireDate(hireDate) {
    if (!hireDate) return true;

    const hireDateObj = new Date(hireDate);
    const today = new Date();

    if (hireDateObj > today) {
      throw new Error(t('operators.errors.invalidHireDate'));
    }
    return true;
  }

  validateName(name) {
    if (!name || name.trim().length < 2) {
      throw new Error(t('operators.errors.invalidName'));
    }
    return true;
  }

  //======================= Delete All Validation

  async checkNoOperatorsInUse() {
    const operatorsInUse = await this.operatorRepository.getOperatorsInUse();
    if (operatorsInUse.length > 0) {
      const operatorNames = operatorsInUse.map(o => o.operatorName).join(', ');
      throw new Error(t('operators.errors.operatorsInUseCannotDelete', { operatorNames }));
    }
    return true;
  }

  async validateDeleteAllOperation() {
    // Check if any operators are currently in use
    await this.checkNoOperatorsInUse();
    
    // Get operator count for confirmation
    const count = await this.operatorRepository.getCount();
    if (count.count === 0) {
      throw new Error(t('operators.errors.noOperatorsToDelete'));
    }
    
    return {
      operatorCount: count.count,
      canDelete: true
    };
  }

}