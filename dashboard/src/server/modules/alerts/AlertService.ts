import { Injectable } from 'najm-api';
import { AlertRepository } from './AlertRepository';
import { AlertValidator } from './AlertValidator';
import { MaintenanceService } from '@/server/modules/maintenance/MaintenanceService';

@Injectable()
export class AlertService {
  constructor(
    private alertRepository: AlertRepository,
    private alertValidator: AlertValidator,
    private maintenanceService: MaintenanceService,
  ) { }

  async getAll() {
    return await this.alertRepository.getAll();
  }

  async getById(id) {
    return await this.alertRepository.getById(id);
  }

  async getByType(type) {

    return await this.alertRepository.getByType(type);
  }

  async getByStatus(status) {
    return await this.alertRepository.getByStatus(status);
  }

  async getByPriority(priority) {
    return await this.alertRepository.getByPriority(priority);
  }

  async getByVehicleId(vehicleId) {
    await this.alertValidator.checkVehicleExists(vehicleId);
    return await this.alertRepository.getByVehicleId(vehicleId);
  }

  async getByOperatorId(operatorId) {
    await this.alertValidator.checkOperatorExists(operatorId);
    return await this.alertRepository.getByOperatorId(operatorId);
  }

  async getActiveAlerts() {
    return await this.alertRepository.getActiveAlerts();
  }

  async getCriticalAlerts() {
    return await this.alertRepository.getCriticalAlerts();
  }

  async getRecentAlertsByHours(hours: number = 24) {
    return await this.alertRepository.getRecentAlertsByHours(hours);
  }

  async getRecentAlerts(limit: number = 10) {
    return await this.alertRepository.getRecentAlerts(limit);
  }

  async getCount() {
    return await this.alertRepository.getCount();
  }

  async getStatusCounts() {
    return await this.alertRepository.getStatusCounts();
  }

  async getPriorityCounts() {
    return await this.alertRepository.getPriorityCounts();
  }

  async getTypeCounts() {
    return await this.alertRepository.getTypeCounts();
  }

  async create(data) {
    await this.alertValidator.validateAlert(data);
    
    if (data.vehicleId) {
      await this.alertValidator.checkVehicleExists(data.vehicleId);
    }
    if (data.operatorId) {
      await this.alertValidator.checkOperatorExists(data.operatorId);
    }
    await this.alertValidator.checkDuplicateAlert(
      data.type, 
      data.vehicleId, 
      data.operatorId
    );

    const alertData = {
      ...data,
      status: 'active'
    };

    const newAlert = await this.alertRepository.create(alertData);
    return await this.getById(newAlert.id);
  }

  async update(id, data) {
    await this.alertValidator.checkAlertExists(id);
    await this.alertValidator.validateAlert(data);
    
    if (data.vehicleId) {
      await this.alertValidator.checkVehicleExists(data.vehicleId);
    }
    if (data.operatorId) {
      await this.alertValidator.checkOperatorExists(data.operatorId);
    }

    return await this.alertRepository.update(id, data);
  }

  async updateStatus(id, status) {
    await this.alertValidator.checkAlertExists(id);
    return await this.alertRepository.updateStatus(id, status);
  }

  async delete(id) {
    await this.alertValidator.checkAlertExists(id);
    return await this.alertRepository.delete(id);
  }

  async deleteAll() {
    return await this.alertRepository.deleteAll();
  }

  async deleteResolved() {
    return await this.alertRepository.deleteResolved();
  }

  async createMaintenanceAlert(vehicleId, maintenanceData) {
    const { hoursOverdue, title } = maintenanceData;
    
    const priority = hoursOverdue > 100 ? 'critical' :
                    hoursOverdue > 50 ? 'high' : 'medium';

    const alertData = {
      type: 'maintenance',
      title: `Maintenance Overdue: ${title}`,
      message: `Vehicle maintenance is overdue by ${hoursOverdue} hours. Please schedule service immediately.`,
      priority,
      vehicleId
    };

    return await this.create(alertData);
  }

  async createFuelAlert(vehicleId, fuelLevel) {
    const priority = fuelLevel < 10 ? 'critical' :
                    fuelLevel < 20 ? 'high' : 'medium';

    const alertData = {
      type: 'fuel',
      title: 'Low Fuel Level',
      message: `Vehicle fuel level is at ${fuelLevel}%. Refueling recommended.`,
      priority,
      vehicleId
    };

    return await this.create(alertData);
  }

  async createSecurityAlert(vehicleId, alertType, location?) {
    const alertData = {
      type: 'security',
      title: alertType === 'unauthorized_movement' ? 'Unauthorized Movement Detected' : 
             alertType === 'geofence_violation' ? 'Geofence Violation' : 'Security Alert',
      message: alertType === 'unauthorized_movement' ? 
               `Vehicle moved outside authorized hours${location ? ` at ${location}` : ''}.` :
               alertType === 'geofence_violation' ?
               `Vehicle has left authorized area${location ? ` - Current location: ${location}` : ''}.` :
               'Security breach detected for vehicle.',
      priority: 'critical',
      vehicleId
    };

    return await this.create(alertData);
  }

  async createOperationalAlert(vehicleId, operatorId, alertType, details?) {
    const alertData = {
      type: 'operational',
      title: alertType === 'excessive_idle' ? 'Excessive Idle Time' :
             alertType === 'operation_overdue' ? 'Operation Overdue' : 'Operational Issue',
      message: alertType === 'excessive_idle' ? 
               `Vehicle has been idle for ${details?.idleTime || 'extended'} period during active operation.` :
               alertType === 'operation_overdue' ?
               `Scheduled operation is overdue by ${details?.overdueTime || 'unknown'} time.` :
               'Operational issue detected requiring attention.',
      priority: 'medium',
      vehicleId,
      operatorId
    };

    return await this.create(alertData);
  }

  async createSystemAlert(message, priority = 'medium') {
    const alertData = {
      type: 'system',
      title: 'System Alert',
      message,
      priority
    };

    return await this.create(alertData);
  }

  async generateMaintenanceAlerts() {
    const maintenanceAlerts = await this.maintenanceService.checkMaintenanceAlerts();
    const createdAlerts = [];
    for (const maintenance of maintenanceAlerts.overdueList) {
      try {
        const alert = await this.createMaintenanceAlert(maintenance.vehicleId, {
          hoursOverdue: maintenance.hoursOverdue,
          title: maintenance.title
        });
        createdAlerts.push(alert);
      } catch (error) {
        continue;
      }
    }

    const urgentUpcoming = maintenanceAlerts.upcomingList.filter(m => m.hoursUntilDue <= 20);
    for (const maintenance of urgentUpcoming) {
      try {
        const alert = await this.create({
          type: 'maintenance',
          title: `Maintenance Due Soon: ${maintenance.title}`,
          message: `Vehicle maintenance is due in ${maintenance.hoursUntilDue} hours. Please schedule service.`,
          priority: 'medium',
          vehicleId: maintenance.vehicleId
        });
        createdAlerts.push(alert);
      } catch (error) {
        continue;
      }
    }

    return {
      overdueAlerts: createdAlerts.filter(a => a.title.includes('Overdue')).length,
      upcomingAlerts: createdAlerts.filter(a => a.title.includes('Due Soon')).length,
      totalCreated: createdAlerts.length,
      alerts: createdAlerts
    };
  }

  async getDashboardSummary() {
    const [active, critical, recent, statusCounts, typeCounts] = await Promise.all([
      this.getActiveAlerts(),
      this.getCriticalAlerts(),
      this.getRecentAlertsByHours(24),
      this.getStatusCounts(),
      this.getTypeCounts()
    ]);

    return {
      activeCount: active.length,
      criticalCount: critical.length,
      recentCount: recent.length,
      statusBreakdown: statusCounts,
      typeBreakdown: typeCounts,
      criticalAlerts: critical.slice(0, 5), 
      recentAlerts: recent.slice(0, 10) 
    };
  }

  async seedDemoAlerts(alertsData) {
    const createdAlerts = [];
    for (const alert of alertsData) {
      try {
        const createdAlert = await this.create(alert);
        createdAlerts.push(createdAlert);
      } catch (error) {
        continue;
      }
    }

    return createdAlerts;
  }
}