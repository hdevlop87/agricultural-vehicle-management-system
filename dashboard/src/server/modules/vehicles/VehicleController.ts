import { Controller, Get, Post, Put, Delete, Params, Body, t } from 'najm-api';
import { VehicleService } from './VehicleService';
import { isAdmin } from '@/server/shared/guards';


@Controller('/vehicles')
@isAdmin()
export class VehicleController {
  constructor(
    private vehicleService: VehicleService,
  ) { }

  @Get()
  async getVehicles() {
    const vehicles = await this.vehicleService.getAll();
    return {
      data: vehicles,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/locations')
  async getVehiclesLocations() {
    const vehiclesLocations = await this.vehicleService.getVehiclesLocations();
    return {
      data: vehiclesLocations,
      message: t('vehicles.success.locationsRetrieved'),
      status: 'success'
    };
  }

  @Get('/count')
  async getVehiclesCount() {
    const count = await this.vehicleService.getCount();
    return {
      data: count,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/types')
  async getVehicleTypes() {
    const types = await this.vehicleService.getVehicleTypes();
    return {
      data: types,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/by-type/:type')
  async getVehiclesByType(@Params('type') type) {
    const vehicles = await this.vehicleService.getByType(type);
    return {
      data: vehicles,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/active')
  async getActiveVehicles() {
    const vehicles = await this.vehicleService.getActiveVehicles();
    return {
      data: vehicles,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/maintenance')
  async getMaintenanceVehicles() {
    const vehicles = await this.vehicleService.getByStatus('maintenance');
    return {
      data: vehicles,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/license/:licensePlate')
  async getVehicleByLicense(@Params('licensePlate') licensePlate) {
    const vehicle = await this.vehicleService.getByLicensePlate(licensePlate);
    return {
      data: vehicle,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Post()
  async createVehicle(@Body() body) {
    const newVehicle = await this.vehicleService.create(body);
    return {
      data: newVehicle,
      message: t('vehicles.success.created'),
      status: 'success'
    };
  }

  @Put('/:id')
  async updateVehicle(@Params('id') id, @Body() body) {
    const updatedVehicle = await this.vehicleService.update(id, body);
    return {
      data: updatedVehicle,
      message: t('vehicles.success.updated'),
      status: 'success'
    };
  }

  @Put('/:id/status')
  async updateVehicleStatus(@Params('id') id, @Body() body) {
    const updatedVehicle = await this.vehicleService.updateStatus(id, body.status);
    return {
      data: updatedVehicle,
      message: t('vehicles.success.statusUpdated'),
      status: 'success'
    };
  }

  @Delete('/:id')
  async deleteVehicle(@Params('id') id) {
    const result = await this.vehicleService.delete(id);
    return {
      data: result,
      message: t('vehicles.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  async deleteAllVehicles() {
    const result = await this.vehicleService.deleteAll();
    return {
      data: result,
      message: t('vehicles.success.allDeleted'),
      status: 'success'
    };
  }

  @Get('/analytics/in-use')
  async getVehiclesInUse() {
    const vehiclesInUse = await this.vehicleService.getVehiclesInUse();
    return {
      data: vehiclesInUse,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/status-distribution')
  async getVehicleStatusDistribution() {
    const distribution = await this.vehicleService.getStatusDistribution();
    return {
      data: distribution,
      message: 'Vehicle status distribution retrieved successfully',
      status: 'success'
    };
  }

  @Get('/analytics/type-distribution')
  async getVehicleTypeDistribution() {
    const distribution = await this.vehicleService.getTypeDistribution();
    return {
      data: distribution,
      message: 'Vehicle type distribution retrieved successfully',
      status: 'success'
    };
  }

  @Get('/analytics/age-analysis')
  async getVehicleAgeAnalysis() {
    const analysis = await this.vehicleService.getAgeAnalysis();
    return {
      data: analysis,
      message: 'Vehicle age analysis retrieved successfully',
      status: 'success'
    };
  }

  @Get('/analytics/fuel-distribution')
  async getVehicleFuelDistribution() {
    const distribution = await this.vehicleService.getFuelDistribution();
    return {
      data: distribution,
      message: 'Vehicle fuel distribution retrieved successfully',
      status: 'success'
    };
  }

  @Get('/analytics/brand-analysis')
  async getVehicleBrandAnalysis() {
    const analysis = await this.vehicleService.getBrandAnalysis();
    return {
      data: analysis,
      message: 'Vehicle brand analysis retrieved successfully',
      status: 'success'
    };
  }

  @Get('/analytics/utilization')
  async getVehicleUtilization() {
    const utilization = await this.vehicleService.getUtilizationAnalytics();
    return {
      data: utilization,
      message: 'Vehicle utilization analytics retrieved successfully',
      status: 'success'
    };
  }

  @Post('/seed')
  async seedDemoVehicles(@Body() body) {
    const seed = await this.vehicleService.seedDemoVehicles(body);
    return {
      data: seed,
      message: t('vehicles.success.seeded'),
      status: 'success'
    };
  }

  @Get('/analytics/total-fleet-mileage')
  async getTotalFleetMileage() {
    const data = await this.vehicleService.getTotalFleetMileage();
    return {
      data,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/monthly-fleet-mileage')
  async getMonthlyFleetMileage() {
    const data = await this.vehicleService.getMonthlyFleetMileage();
    return {
      data,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  async getVehicle(@Params('id') id) {
    const vehicle = await this.vehicleService.getById(id);
    return {
      data: vehicle,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }
}