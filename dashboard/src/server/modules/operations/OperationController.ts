import { Controller, Get, Post, Put, Delete, Params, Body, Query, t } from 'najm-api';
import { OperationService } from './OperationService';
import { isAdmin } from '@/server/shared/guards';
import { OPERATION_TYPE_VALUES } from './operationTypes';


@Controller('/operations')
export class OperationController {
  constructor(
    private operationService: OperationService,
  ) { }

  @Get()
  @isAdmin()
  async getOperations() {
    const operations = await this.operationService.getAll();
    return {
      data: operations,
      message: t('operations.success.allRetrieved'),
      status: 'success'
    };
  }

  @Get('/count')
  @isAdmin()
  async getOperationsCount() {
    const count = await this.operationService.getCount();
    return {
      data: count,
      message: t('operations.success.countRetrieved'),
      status: 'success'
    };
  }

  @Get('/operation-types')
  @isAdmin()
  async getOperationTypes() {
    const operationTypes = OPERATION_TYPE_VALUES.map(type => ({
      value: type,
      label: t(`operationTypes.types.${type}`)
    }));

    return {
      data: operationTypes,
      message: t('operationTypes.success.allRetrieved'),
      status: 'success'
    };
  }

  @Get('/recent-completed')
  @isAdmin()
  async getRecentCompletedOperations(@Query('limit') limit) {
    const operations = await this.operationService.getRecentCompletedOperations(limit ? parseInt(limit) : 5);
    return {
      data: operations,
      message: t('operations.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/top-operators')
  @isAdmin()
  async getTopOperators() {
    const operators = await this.operationService.getTopOperatorsByCompletedOperations();
    return {
      data: operators,
      message: t('operations.success.topOperatorsRetrieved'),
      status: 'success'
    };
  }

  @Get('/today')
  @isAdmin()
  async getTodayOperations() {
    const operations = await this.operationService.getTodayOperations();
    return {
      data: operations,
      message: t('operations.success.todayRetrieved'),
      status: 'success'
    };
  }

  @Get('/today/operator/:operatorId')
  async getTodayOperationsByOperatorId(@Params('operatorId') operatorId) {
    const operations = await this.operationService.getTodayOperationsByOperatorId(operatorId);
    return {
      data: operations,
      message: t('operations.success.todayRetrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @isAdmin()
  async getOperation(@Params('id') id) {
    const operation = await this.operationService.getById(id);
    return {
      data: operation,
      message: t('operations.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/status/:status')
  @isAdmin()
  async getOperationsByStatus(@Params('status') status) {
    const operations = await this.operationService.getByStatus(status);
    return {
      data: operations,
      message: t('operations.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/date/:date')
  @isAdmin()
  async getOperationsByDate(@Params('date') date) {
    const operations = await this.operationService.getByDate(date);
    return {
      data: operations,
      message: t('operations.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/vehicle/:vehicleId')
  @isAdmin()
  async getOperationsByVehicle(@Params('vehicleId') vehicleId) {
    const operations = await this.operationService.getByVehicleId(vehicleId);
    return {
      data: operations,
      message: t('operations.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/operator/:operatorId')
  @isAdmin()
  async getOperationsByOperator(@Params('operatorId') operatorId) {
    const operations = await this.operationService.getByOperatorId(operatorId);
    return {
      data: operations,
      message: t('operations.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/field/:fieldId')
  @isAdmin()
  async getOperationsByField(@Params('fieldId') fieldId) {
    const operations = await this.operationService.getByFieldId(fieldId);
    return {
      data: operations,
      message: t('operations.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/type/:operationType')
  @isAdmin()
  async getOperationsByType(@Params('operationType') operationType) {
    const operations = await this.operationService.getByOperationType(decodeURIComponent(operationType));
    return {
      data: operations,
      message: t('operations.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/duration')
  @isAdmin()
  async getOperationDuration(@Params('id') id) {
    const duration = await this.operationService.getOperationDuration(id);
    return {
      data: duration,
      message: 'Operation duration retrieved successfully',
      status: 'success'
    };
  }

  @Post()
  @isAdmin()
  async createOperation(@Body() body) {
    const newOperation = await this.operationService.create(body);
    return {
      data: newOperation,
      message: t('operations.success.created'),
      status: 'success'
    };
  }

  @Put('/:id')
  @isAdmin()
  async updateOperation(@Params('id') id, @Body() body) {
    const updatedOperation = await this.operationService.update(id, body);
    return {
      data: updatedOperation,
      message: t('operations.success.updated'),
      status: 'success'
    };
  }

  @Put('/:id/start')
  async startOperation(@Params('id') id) {
    const operation = await this.operationService.startOperation(id);
    return {
      data: operation,
      message: 'Operation started successfully',
      status: 'success'
    };
  }

  @Put('/:id/complete')
  async completeOperation(@Params('id') id) {
    const operation = await this.operationService.completeOperation(id);
    return {
      data: operation,
      message: 'Operation completed successfully',
      status: 'success'
    };
  }

  @Put('/:id/cancel')
  async cancelOperation(@Params('id') id) {
    const operation = await this.operationService.cancelOperation(id);
    return {
      data: operation,
      message: 'Operation cancelled successfully',
      status: 'success'
    };
  }

  @Delete('/:id')
  @isAdmin()
  async deleteOperation(@Params('id') id) {
    const result = await this.operationService.delete(id);
    return {
      data: result,
      message: t('operations.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @isAdmin()
  async deleteAllOperations() {
    const result = await this.operationService.deleteAll();
    return {
      data: result,
      message: t('operations.success.allDeleted'),
      status: 'success'
    };
  }




}