import { Controller, Get, Post, Put, Delete, Params, Body, t } from 'najm-api';
import { RefuelService } from './RefuelService';
import { isAdmin } from '@/server/shared/guards';

@Controller('/refuel')
@isAdmin()
export class RefuelController {
  constructor(
    private refuelService: RefuelService,
  ) { }

  @Get()
  async getFuelRecords() {
    const refuels = await this.refuelService.getAll();
    return {
      data: refuels,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/count')
  async getFuelRecordsCount() {
    const count = await this.refuelService.getCount();
    return {
      data: count,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/recent')
  async getRecentFuelRecords() {
    const records = await this.refuelService.getRecentRecords();
    return {
      data: records,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/today')
  async getTodayFuelRecords() {
    const records = await this.refuelService.getTodayRecords();
    return {
      data: records,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/date/:date')
  async getFuelRecordsByDate(@Params('date') date) {
    const records = await this.refuelService.getByDate(date);
    return {
      data: records,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/vehicle/:vehicleId')
  async getFuelRecordsByVehicle(@Params('vehicleId') vehicleId) {
    const records = await this.refuelService.getByVehicleId(vehicleId);
    return {
      data: records,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/operator/:operatorId')
  async getFuelRecordsByOperator(@Params('operatorId') operatorId) {
    const records = await this.refuelService.getByOperatorId(operatorId);
    return {
      data: records,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/voucher/:voucherNumber')
  async getFuelRecordByVoucher(@Params('voucherNumber') voucherNumber) {
    const record = await this.refuelService.getByVoucherNumber(voucherNumber);
    return {
      data: record,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  async getFuelRecord(@Params('id') id) {
    const record = await this.refuelService.getById(id);
    return {
      data: record,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Post()
  async createFuelRecord(@Body() body) {
    const newRecord = await this.refuelService.create(body);
    return {
      data: newRecord,
      message: t('refuels.success.created'),
      status: 'success'
    };
  }

  @Put('/:id')
  async updateFuelRecord(@Params('id') id, @Body() body) {
    const updatedRecord = await this.refuelService.update(id, body);
    return {
      data: updatedRecord,
      message: t('refuels.success.updated'),
      status: 'success'
    };
  }

  @Delete('/:id')
  async deleteFuelRecord(@Params('id') id) {
    const result = await this.refuelService.delete(id);
    return {
      data: result,
      message: t('refuels.success.deleted'),
      status: 'success'
    };
  }

  @Get('/analytics/consumption')
  async getFuelConsumptionAnalytics() {
    const analytics = await this.refuelService.getFuelConsumptionAnalytics();
    return {
      data: analytics,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/efficiency')
  async getFuelEfficiencyReport() {
    const efficiency = await this.refuelService.getFuelEfficiencyReport();
    return {
      data: efficiency,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/costs')
  async getFuelCostAnalysis() {
    const costs = await this.refuelService.getFuelCostAnalysis();
    return {
      data: costs,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/summary')
  async getFuelSummary() {
    const summary = await this.refuelService.getFuelSummary();
    return {
      data: summary,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/vehicle/:vehicleId/efficiency')
  async getVehicleFuelEfficiency(@Params('vehicleId') vehicleId) {
    const efficiency = await this.refuelService.getVehicleFuelEfficiency(vehicleId);
    return {
      data: efficiency,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/vehicle/:vehicleId/costs')
  async getVehicleFuelCosts(@Params('vehicleId') vehicleId) {
    const costs = await this.refuelService.getVehicleFuelCosts(vehicleId);
    return {
      data: costs,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/trends/monthly')
  async getMonthlyFuelTrends() {
    const trends = await this.refuelService.getMonthlyFuelTrends();
    return {
      data: trends,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Delete()
  async deleteAllRefuels() {
    const result = await this.refuelService.deleteAll();
    return {
      data: result,
      message: t('refuels.success.allDeleted'),
      status: 'success'
    };
  }
}