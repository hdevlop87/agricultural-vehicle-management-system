import { Injectable, t } from 'najm-api';
import { AlertRepository } from './AlertRepository';
import { VehicleRepository } from '@/server/modules/vehicles/VehicleRepository';
import { OperatorRepository } from '@/server/modules/operators/OperatorRepository';
import { alertValidationSchema } from '@/server/database/schema';
import { parseSchema } from '@/server/shared/utils';

@Injectable()
export class AlertValidator {
  constructor(
    private alertRepository: AlertRepository,
    private vehicleRepository: VehicleRepository,
    private operatorRepository: OperatorRepository,
  ) { }

  async validateAlert(data) {
    return parseSchema(alertValidationSchema(t), data);
  }

  async checkAlertExists(id: string) {
    const alert = await this.alertRepository.getById(id);
    if (!alert) {
      throw new Error(t('alerts.errors.notFound'));
    }
    return alert;
  }

  async checkVehicleExists(vehicleId: string) {
    if (!vehicleId) return;
    
    const vehicle = await this.vehicleRepository.getById(vehicleId);
    if (!vehicle) {
      throw new Error(t('vehicles.errors.notFound'));
    }
    return vehicle;
  }

  async checkOperatorExists(operatorId: string) {
    if (!operatorId) return;
    
    const operator = await this.operatorRepository.getById(operatorId);
    if (!operator) {
      throw new Error(t('operators.errors.notFound'));
    }
    return operator;
  }

  async checkDuplicateAlert(type: string, vehicleId?: string, operatorId?: string) {
    const existingAlert = await this.alertRepository.checkDuplicateAlert(type, vehicleId, operatorId);
    
    if (existingAlert) {
      throw new Error(t('alerts.errors.duplicateActiveAlert'));
    }
    
    return true;
  }
}