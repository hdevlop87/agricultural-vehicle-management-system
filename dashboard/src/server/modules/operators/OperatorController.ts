import { Controller, Get, Post, Put, Delete, Params, Body, t, User } from 'najm-api';
import { OperatorService } from './OperatorService';
import { isAdmin, isLoggedIn } from '@/server/shared/guards';


@Controller('/operators')
@isLoggedIn()
export class OperatorController {
  constructor(
    private operatorService: OperatorService,
  ) { }

  @Get()
  @isAdmin()
  async getOperators() {
    const operators = await this.operatorService.getAll();
    return {
      data: operators,
      message: t('operators.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/count')
  @isAdmin()
  async getOperatorsCount() {
    const count = await this.operatorService.getCount();
    return {
      data: count,
      message: t('operators.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/active')
  @isAdmin()
  async getActiveOperators() {
    const operators = await this.operatorService.getByStatus('active');
    return {
      data: operators,
      message: t('operators.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/inactive')
  @isAdmin()
  async getInactiveOperators() {
    const operators = await this.operatorService.getByStatus('inactive');
    return {
      data: operators,
      message: t('operators.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/suspended')
  @isAdmin()
  async getSuspendedOperators() {
    const operators = await this.operatorService.getByStatus('suspended');
    return {
      data: operators,
      message: t('operators.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/license-expiring')
  @isAdmin()
  async getLicenseExpiringOperators() {
    const operators = await this.operatorService.getLicenseExpiringOperators();
    return {
      data: operators,
      message: t('operators.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  async getOperator(@Params('id') id, @User() user) {
    const operatorId = await this.operatorService.resolveOperatorId(id, user);
    const operator = await this.operatorService.getById(operatorId);
    return {
      data: operator,
      message: t('operators.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/user/:userId')
  @isAdmin()
  async getOperatorByUserId(@Params('userId') userId) {
    const operator = await this.operatorService.getByUserId(userId);
    return {
      data: operator,
      message: t('operators.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/license/:licenseNumber')
  @isAdmin()
  async getOperatorByLicense(@Params('licenseNumber') licenseNumber) {
    const operator = await this.operatorService.getByLicenseNumber(licenseNumber);
    return {
      data: operator,
      message: t('operators.success.retrieved'),
      status: 'success'
    };
  }

  @Post()
  @isAdmin()
  async createOperator(@Body() body) {
    const newOperator = await this.operatorService.create(body);
    return {
      data: newOperator,
      message: t('operators.success.created'),
      status: 'success'
    };
  }

  @Put('/:id')
  async updateOperator(@Params('id') id, @Body() body, @User() user) {
    const operatorId = await this.operatorService.resolveOperatorId(id, user);
    const updatedOperator = await this.operatorService.update(operatorId, body);
    return {
      data: updatedOperator,
      message: t('operators.success.updated'),
      status: 'success'
    };
  }

  @Put('/:id/status')
  @isAdmin()
  async updateOperatorStatus(@Params('id') id, @Body() body) {
    const updatedOperator = await this.operatorService.updateStatus(id, body.status);
    return {
      data: updatedOperator,
      message: t('operators.success.statusUpdated'),
      status: 'success'
    };
  }

  @Delete('/:id')
  @isAdmin()
  async deleteOperator(@Params('id') id) {
    const result = await this.operatorService.delete(id);
    return {
      data: result,
      message: t('operators.success.deleted'),
      status: 'success'
    };
  }

  @Get('/:id/operations')
  async getOperations(@Params('id') id, @User() user) {
    const operatorId = await this.operatorService.resolveOperatorId(id, user);
    const operations = await this.operatorService.getOperations(operatorId);
    return {
      data: operations,
      message: t('operators.success.retrieved'),
      status: 'success'
    };
  }


  @Get('/:id/analytics')
  async getAnalytics(@Params('id') id, @User() user) {
    const operatorId = await this.operatorService.resolveOperatorId(id, user);
    const analytics = await this.operatorService.getAnalytics(operatorId);
    return {
      data: analytics,
      message: t('operators.success.retrieved'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedDemoOperators(@Body() body) {
    const seed = await this.operatorService.seedDemoOperators(body);
    return {
      data: seed,
      message: t('operators.success.seeded'),
      status: 'success'
    };
  }

  @Delete()
  @isAdmin()
  async deleteAllOperators() {
    const result = await this.operatorService.deleteAll();
    return {
      data: result,
      message: t('operators.success.allDeleted'),
      status: 'success'
    };
  }
}