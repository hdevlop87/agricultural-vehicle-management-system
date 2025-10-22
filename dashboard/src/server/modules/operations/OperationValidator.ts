import { Injectable, t } from 'najm-api';
import { OperationRepository } from './OperationRepository';
import { FieldRepository } from '../fields/FieldRepository';
import { createOperationSchema } from '@/server/database/schema';
import { parseSchema } from '@/server/shared/utils';

@Injectable()
export class OperationValidator {
  constructor(
    private operationRepository: OperationRepository,
    private fieldRepository: FieldRepository,
  ) { }

  async validateCreateOperation(data) {
    return parseSchema(createOperationSchema, data);
  }

  async isOperationExists(id) {
    const existingOperation = await this.operationRepository.getById(id);
    return !!existingOperation;
  }

  //======================= Operation Type Validation

  validateOperationType(operationType) {
    if (!operationType || operationType.trim().length < 2) {
      throw new Error(t('operationTypes.validation.nameMinLength'));
    }
    
    if (operationType.length > 100) {
      throw new Error(t('operations.errors.operationTypeMaxLength'));
    }
    
    return true;
  }

  //======================= Status Validation

  validateOperationStatus(status) {
    const validStatuses = ['planned', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(t('operations.errors.invalidStatus'));
    }
    return true;
  }


  //======================= Engine Hours and Mileage Validation

  validateEngineHours(hours) {
    const numericHours = parseFloat(hours);

    if (isNaN(numericHours) || numericHours < 0) {
      throw new Error(t('vehicles.errors.invalidEngineHours'));
    }
    
    if (numericHours > 50000) {
      throw new Error(t('operations.validation.engineHoursTooHigh'));
    }
    
    return true;
  }

  validateEngineHoursProgression(startHours, endHours) {
    const start = parseFloat(startHours);
    const end = parseFloat(endHours);
    
    if (end <= start) {
      throw new Error(t('operations.validation.engineHoursProgression'));
    }
    
    const difference = end - start;
    if (difference > 18) {
      throw new Error(t('operations.errors.engineHoursDifferenceTooLarge'));
    }
    
    return true;
  }

  validateMileage(mileage) {
    if (!mileage) return true; // Mileage is optional
    
    const numericMileage = parseFloat(mileage);
    
    if (isNaN(numericMileage) || numericMileage < 0) {
      throw new Error(t('vehicles.errors.invalidMileage'));
    }
    
    return true;
  }

  validateMileageProgression(startMileage, endMileage) {
    const start = parseFloat(startMileage);
    const end = parseFloat(endMileage);
    
    if (end <= start) {
      throw new Error(t('operations.validation.mileageProgression'));
    }
    
    const difference = end - start;
    if (difference > 500) {
      console.warn(t('operations.validation.mileageTooHigh'));
    }
    
    return true;
  }

  //======================= Existence Checks (throw errors)

  async checkOperationExists(id) {
    const operationExists = await this.isOperationExists(id);
    if (!operationExists) {
      throw new Error(t('operations.errors.notFound'));
    }
    return true;
  }

  //======================= Business Rules Checks


  async checkOperationCanBeStarted(operation) {
    if (operation.status !== 'planned') {
      throw new Error(t('operations.errors.alreadyStarted'));
    }
    
    // Check if operation date is not in the future beyond reasonable limit
    const today = new Date();
    const operationDate = new Date(operation.date);
    const daysDifference = (operationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDifference > 7) {
      throw new Error(t('operations.errors.cannotStartFutureOperation'));
    }
    
    return true;
  }

  async checkOperationCanBeCompleted(operation) {
    if (operation.status !== 'active') {
      throw new Error(t('operations.errors.alreadyCompleted'));
    }
    
    if (!operation.startTime || !operation.startHours) {
      throw new Error(t('operations.errors.missingStartData'));
    }
    
    return true;
  }

  async checkOperationCanBeCancelled(operation) {
    if (operation.status === 'completed') {
      throw new Error(t('operations.errors.alreadyCompleted'));
    }
    
    if (operation.status === 'cancelled') {
      throw new Error(t('operations.errors.alreadyCancelled'));
    }
    
    return true;
  }

  async checkOperationCanBeDeleted(operation) {
    if (operation.status === 'active') {
      throw new Error(t('operations.errors.cannotDeleteActiveOperation'));
    }
    
    // Additional business rules can be added here
    // For example, don't allow deletion of operations older than 30 days
    const today = new Date();
    const operationDate = new Date(operation.date);
    const daysDifference = (today.getTime() - operationDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDifference > 30 && operation.status === 'completed') {
      throw new Error(t('operations.errors.cannotDeleteOldOperation'));
    }
    
    return true;
  }

  //======================= Resource Conflict Validation

  async checkVehicleAvailability(vehicleId, date, startTime?, endTime?, excludeOperationId?) {
    // Check if vehicle is already scheduled for the same time period
    let conflictingOperations = await this.operationRepository.getByVehicleId(vehicleId);
    
    conflictingOperations = conflictingOperations.filter(op => 
      op.date === date && 
      op.status !== 'cancelled' &&
      (excludeOperationId ? op.id !== excludeOperationId : true)
    );
    
    if (startTime && endTime) {
      conflictingOperations = conflictingOperations.filter(op => {
        if (!op.startTime || !op.endTime) return true; // Conservative check
        
        const newStart = new Date(`${date}T${startTime}`);
        const newEnd = new Date(`${date}T${endTime}`);
        const existingStart = new Date(`${op.date}T${op.startTime}`);
        const existingEnd = new Date(`${op.date}T${op.endTime}`);
        
        // Check for time overlap
        return (newStart < existingEnd && newEnd > existingStart);
      });
    }
    
    if (conflictingOperations.length > 0) {
      throw new Error(t('operations.errors.vehicleNotAvailable'));
    }
    
    return true;
  }

  async checkOperatorAvailability(operatorId, date, startTime?, endTime?, excludeOperationId?) {
    // Similar to vehicle availability check
    let conflictingOperations = await this.operationRepository.getByOperatorId(operatorId);
    
    conflictingOperations = conflictingOperations.filter(op => 
      op.date === date && 
      op.status !== 'cancelled' &&
      (excludeOperationId ? op.id !== excludeOperationId : true)
    );
    
    if (startTime && endTime) {
      conflictingOperations = conflictingOperations.filter(op => {
        if (!op.startTime || !op.endTime) return true;
        
        const newStart = new Date(`${date}T${startTime}`);
        const newEnd = new Date(`${date}T${endTime}`);
        const existingStart = new Date(`${op.date}T${op.startTime}`);
        const existingEnd = new Date(`${op.date}T${op.endTime}`);
        
        return (newStart < existingEnd && newEnd > existingStart);
      });
    }
    
    if (conflictingOperations.length > 0) {
      throw new Error(t('operations.errors.operatorNotAvailable'));
    }
    
    return true;
  }

  //======================= Input Validation Helpers

  validateOperationData(data) {
    const { operationType, startHours, endHours } = data;
    
    if (operationType) {
      this.validateOperationType(operationType);
    }
    
    if (startHours) {
      this.validateEngineHours(startHours);
    }
    
    if (endHours) {
      this.validateEngineHours(endHours);
    }
    
    return true;
  }

  //======================= Common Agricultural Operation Validations

  validateSeasonalOperation(operationType, date) {
    const month = new Date(date).getMonth() + 1; // 1-12
    
    // Basic seasonal validation (can be expanded)
    const seasonalOperations = {
      'Primary Tillage': [3, 4, 5, 9, 10, 11], // Spring and Fall
      'Precision Planting': [4, 5, 6], // Late Spring/Early Summer
      'Grain Harvesting': [8, 9, 10, 11], // Late Summer/Fall
      'Pesticide Application': [4, 5, 6, 7, 8], // Growing Season
    };
    
    if (seasonalOperations[operationType] && !seasonalOperations[operationType].includes(month)) {
      console.warn(`${operationType} scheduled outside typical season (month ${month})`);
    }
    
    return true;
  }

  validateOperationSequence(operationType, fieldId, date) {
    // Could validate that operations follow logical sequence
    // e.g., planting should come after tillage, harvesting after planting, etc.
    // This would require additional logic to check previous operations on the field
    
    return true;
  }
}