import { Controller, Get, Post, Put, Delete, Params, Body, Query, t } from 'najm-api';
import { AlertService } from './AlertService';
import { isAdmin } from '@/server/shared/guards';

@Controller('/alerts')
@isAdmin()
export class AlertController {
  constructor(
    private alertService: AlertService,
  ) { }

  @Get()
  async getAlerts() {
    const alerts = await this.alertService.getAll();
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  } 

  @Get('/count')
  async getAlertsCount() {
    const count = await this.alertService.getCount();
    return {
      data: count,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/status-counts')
  async getStatusCounts() {
    const statusCounts = await this.alertService.getStatusCounts();
    return {
      data: statusCounts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/priority-counts')
  async getPriorityCounts() {
    const priorityCounts = await this.alertService.getPriorityCounts();
    return {
      data: priorityCounts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/type-counts')
  async getTypeCounts() {
    const typeCounts = await this.alertService.getTypeCounts();
    return {
      data: typeCounts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/active')
  async getActiveAlerts() {
    const alerts = await this.alertService.getActiveAlerts();
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/critical')
  async getCriticalAlerts() {
    const alerts = await this.alertService.getCriticalAlerts();
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/recent')
  async getRecentAlerts(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    const alerts = await this.alertService.getRecentAlerts(limitNum);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/recent-by-hours')
  async getRecentAlertsByHours(@Query('hours') hours?: string) {
    const hoursNum = hours ? parseInt(hours) : 24;
    const alerts = await this.alertService.getRecentAlertsByHours(hoursNum);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }


  @Get('/dashboard')
  async getDashboardSummary() {
    const summary = await this.alertService.getDashboardSummary();
    return {
      data: summary,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/type/:type')
  async getAlertsByType(@Params('type') type: string) {
    const alerts = await this.alertService.getByType(type);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/status/:status')
  async getAlertsByStatus(@Params('status') status: string) {
    const alerts = await this.alertService.getByStatus(status);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/priority/:priority')
  async getAlertsByPriority(@Params('priority') priority: string) {
    const alerts = await this.alertService.getByPriority(priority);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/vehicle/:vehicleId')
  async getAlertsByVehicle(@Params('vehicleId') vehicleId: string) {
    const alerts = await this.alertService.getByVehicleId(vehicleId);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/operator/:operatorId')
  async getAlertsByOperator(@Params('operatorId') operatorId: string) {
    const alerts = await this.alertService.getByOperatorId(operatorId);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  async getAlertById(@Params('id') id: string) {
    const alert = await this.alertService.getById(id);
    return {
      data: alert,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Post()
  async createAlert(@Body() alertData: any) {
    const alert = await this.alertService.create(alertData);
    return {
      data: alert,
      message: t('alerts.success.created'),
      status: 'success'
    };
  }

  @Put('/:id')
  async updateAlert(@Params('id') id: string, @Body() updateData: any) {
    const alert = await this.alertService.update(id, updateData);
    return {
      data: alert,
      message: t('alerts.success.updated'),
      status: 'success'
    };
  }

  @Put('/:id/status')
  async updateAlertStatus(@Params('id') id: string, @Body() { status }: { status: string }) {
    const alert = await this.alertService.updateStatus(id, status);
    return {
      data: alert,
      message: t('alerts.success.statusUpdated'),
      status: 'success'
    };
  }

  @Delete('/:id')
  async deleteAlert(@Params('id') id: string) {
    const deleted = await this.alertService.delete(id);
    return {
      data: deleted,
      message: t('alerts.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  async deleteAllAlerts() {
    const result = await this.alertService.deleteAll();
    return {
      data: result,
      message: t('alerts.success.allDeleted'),
      status: 'success'
    };
  }

  @Delete('/resolved')
  async deleteResolvedAlerts() {
    const result = await this.alertService.deleteResolved();
    return {
      data: result,
      message: t('alerts.success.resolvedDeleted'),
      status: 'success'
    };
  }

  @Post('/generate/maintenance')
  async generateMaintenanceAlerts() {
    const result = await this.alertService.generateMaintenanceAlerts();
    return {
      data: result,
      message: t('alerts.success.maintenanceAlertsGenerated'),
      status: 'success'
    };
  }

  @Post('/fuel')
  async createFuelAlert(@Body() { vehicleId, fuelLevel }: { vehicleId: string, fuelLevel: number }) {
    const alert = await this.alertService.createFuelAlert(vehicleId, fuelLevel);
    return {
      data: alert,
      message: t('alerts.success.created'),
      status: 'success'
    };
  }

  @Post('/security')
  async createSecurityAlert(@Body() { vehicleId, alertType, location }: { vehicleId: string, alertType: string, location?: string }) {
    const alert = await this.alertService.createSecurityAlert(vehicleId, alertType, location);
    return {
      data: alert,
      message: t('alerts.success.created'),
      status: 'success'
    };
  }

  @Post('/operational')
  async createOperationalAlert(@Body() { vehicleId, operatorId, alertType, details }: { 
    vehicleId: string, 
    operatorId: string, 
    alertType: string, 
    details?: any 
  }) {
    const alert = await this.alertService.createOperationalAlert(vehicleId, operatorId, alertType, details);
    return {
      data: alert,
      message: t('alerts.success.created'),
      status: 'success'
    };
  }

  @Post('/system')
  async createSystemAlert(@Body() { message, priority }: { message: string, priority?: string }) {
    const alert = await this.alertService.createSystemAlert(message, priority);
    return {
      data: alert,
      message: t('alerts.success.created'),
      status: 'success'
    };
  }
}