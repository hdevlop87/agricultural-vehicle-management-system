import { Injectable } from 'najm-api';
import { OperationRepository } from './OperationRepository';
import { OperationValidator } from './OperationValidator';
import { VehicleValidator } from '../vehicles/VehicleValidator';
import { OperatorValidator } from '../operators/OperatorValidator';
import { FieldValidator } from '../fields/FieldValidator';
import { VehicleService } from '../vehicles/VehicleService';
import { MaintenanceService } from '../maintenance/MaintenanceService';
import { AlertService } from '../alerts/AlertService';
import { nanoid } from 'nanoid';

@Injectable()
export class OperationService {
  constructor(
    private operationRepository: OperationRepository,
    private operationValidator: OperationValidator,
    private vehicleValidator: VehicleValidator,
    private operatorValidator: OperatorValidator,
    private fieldValidator: FieldValidator,
    private vehicleService: VehicleService,
    private maintenanceService: MaintenanceService,
    private alertService: AlertService,
  ) { }

  async getAll() {
    return await this.operationRepository.getAll();
  }

  async getById(id) {
    await this.operationValidator.checkOperationExists(id);
    return await this.operationRepository.getById(id);
  }

  async getByStatus(status) {
    await this.operationValidator.validateOperationStatus(status);
    return await this.operationRepository.getByStatus(status);
  }

  async getByDate(date) {
    return await this.operationRepository.getByDate(date);
  }

  async getTodayOperations() {
    const today = new Date().toISOString().split('T')[0];
    return await this.operationRepository.getByDate(today);
  }

  async getTodayOperationsByOperatorId(operatorId) {
    await this.operatorValidator.checkOperatorExists(operatorId);
    const today = new Date().toISOString().split('T')[0];
    return await this.operationRepository.getTodayOperationsByOperatorId(operatorId, today);
  }

  async getByVehicleId(vehicleId) {
    await this.vehicleValidator.checkVehicleExists(vehicleId);
    return await this.operationRepository.getByVehicleId(vehicleId);
  }

  async getByOperatorId(operatorId) {
    await this.operatorValidator.checkOperatorExists(operatorId);
    return await this.operationRepository.getByOperatorId(operatorId);
  }

  async getByFieldId(fieldId) {
    await this.fieldValidator.checkFieldExists(fieldId);
    return await this.operationRepository.getByFieldId(fieldId);
  }

  async getByOperationType(operationType) {
    await this.operationValidator.validateOperationType(operationType);
    return await this.operationRepository.getByOperationType(operationType);
  }

  async getCount() {
    return await this.operationRepository.getCount();
  }

  async getOperationDistribution() {
    return await this.operationRepository.getOperationDistribution();
  }

  async create(data) {
    const {
      id,
      vehicleId,
      operatorId,
      operationType,
      fieldId,
      date,
      startTime,
      endTime,
      startHours,
      endHours,
      startMileage,
      endMileage,
      areaCovered,
      weather,
      status,
      notes
    } = data;


    await this.operationValidator.validateCreateOperation(data);
    await this.vehicleValidator.checkVehicleExists(vehicleId);
    await this.operatorValidator.checkOperatorExists(operatorId);
    await this.operationValidator.validateOperationType(operationType);

    if (fieldId) {
      await this.fieldValidator.checkFieldExists(fieldId);
    }

    if (startHours) {
      await this.operationValidator.validateEngineHours(startHours);
    }

    const operationDetails = {
      id: id || nanoid(5),
      vehicleId,
      operatorId,
      operationType,
      fieldId,
      date,
      startTime,
      endTime,
      startHours,
      endHours,
      startMileage,
      endMileage,
      areaCovered,
      weather,
      status: status || 'planned',
      notes,
    }

    return await this.operationRepository.create(operationDetails);

  }

  async update(id, data) {
    await this.operationValidator.checkOperationExists(id);

    if (data.vehicleId) {
      await this.vehicleValidator.checkVehicleExists(data.vehicleId);
    }

    if (data.operatorId) {
      await this.operatorValidator.checkOperatorExists(data.operatorId);
    }

    if (data.operationType) {
      await this.operationValidator.validateOperationType(data.operationType);
    }

    if (data.fieldId) {
      await this.fieldValidator.checkFieldExists(data.fieldId);
    }

    return await this.operationRepository.update(id, data);
  }

  async startOperation(id) {

    await this.operationValidator.isOperationExists(id);
    const operation = await this.operationRepository.getById(id);
    await this.operationValidator.checkOperationCanBeStarted(operation);
    await this.operationValidator.validateEngineHours(operation.startHours);

    const updateData = {
      status: 'active',
    };

    return await this.update(id, updateData);
  }

  async completeOperation(id) {
    await this.operationValidator.checkOperationExists(id);

    const operation = await this.operationRepository.getById(id);
    await this.operationValidator.checkOperationCanBeCompleted(operation);
    await this.operationValidator.validateEngineHours(operation.endHours);
    await this.operationValidator.validateEngineHoursProgression(operation.startHours, operation.endHours);

    if (operation.endMileage && operation.startMileage) {
      await this.operationValidator.validateMileageProgression(operation.startMileage, operation.endMileage);
    }

    if (operation.endMileage) {
      await this.vehicleService.updateCurrentMileage(operation.vehicleId, operation.endMileage);
    }

    if (operation.endHours) {
      await this.vehicleService.updateCurrentHours(operation.vehicleId, operation.endHours);

      const alertToCreate = await this.maintenanceService.checkVehicleMaintenanceAlerts(operation.vehicleId, operation.endHours);

      if (alertToCreate) await this.alertService.create(alertToCreate);

    }

    const updateData = {
      status: 'completed',
    };

    return await this.operationRepository.update(id, updateData);
  }

  async cancelOperation(id) {
    await this.operationValidator.checkOperationExists(id);

    const operation = await this.operationRepository.getById(id);
    await this.operationValidator.checkOperationCanBeCancelled(operation);

    const updateData = {
      status: 'cancelled',
    };

    return await this.operationRepository.update(id, updateData);
  }

  async delete(id) {
    await this.operationValidator.checkOperationExists(id);

    const operation = await this.operationRepository.getById(id);
    await this.operationValidator.checkOperationCanBeDeleted(operation);

    return await this.operationRepository.delete(id);
  }

  async deleteAll() {
    return await this.operationRepository.deleteAll();
  }

  async getOperationDuration(id) {
    await this.operationValidator.checkOperationExists(id);
    return await this.operationRepository.getOperationDuration(id);
  }

  async seedDemoOperations(operationsData) {
    const createdOperations = [];
    for (const operationData of operationsData) {
      try {
        const operation = await this.create(operationData);
        createdOperations.push(operation);
      } catch (error) {
        continue;
      }
    }

    return createdOperations;
  }

  async getRecentCompletedOperations(limit = 5) {
    return await this.operationRepository.getRecentCompletedOperations(limit);
  }

  async getTopOperatorsByCompletedOperations() {
    return await this.operationRepository.getTopOperatorsByCompletedOperations();
  }
}