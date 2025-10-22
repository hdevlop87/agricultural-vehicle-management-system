import { Controller, Get, Post, Put, Delete, Params, Body, t } from 'najm-api';
import { FieldService } from './FieldService';
import { isAdmin } from '@/server/shared/guards';


@Controller('/fields')
@isAdmin()
export class FieldController {
  constructor(
    private fieldService: FieldService,
  ) { }

  @Get()
  async getFields() {
    const fields = await this.fieldService.getAll();
    return {
      data: fields,
      message: t('fields.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/count')
  async getFieldsCount() {
    const count = await this.fieldService.getCount();
    return {
      data: count,
      message: t('fields.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/total-area')
  async getTotalArea() {
    const totalArea = await this.fieldService.getTotalArea();
    return {
      data: totalArea,
      message: t('fields.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/by-size')
  async getFieldsBySize() {
    const fields = await this.fieldService.getFieldsBySize();
    return {
      data: fields,
      message: t('fields.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/large')
  async getLargeFields() {
    const fields = await this.fieldService.getLargeFields();
    return {
      data: fields,
      message: t('fields.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/small')
  async getSmallFields() {
    const fields = await this.fieldService.getSmallFields();
    return {
      data: fields,
      message: t('fields.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/active-operations')
  async getFieldsWithActiveOperations() {
    const fields = await this.fieldService.getFieldsWithActiveOperations();
    return {
      data: fields,
      message: t('fields.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  async getField(@Params('id') id) {
    const field = await this.fieldService.getById(id);
    return {
      data: field,
      message: t('fields.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/name/:name')
  async getFieldByName(@Params('name') name) {
    const field = await this.fieldService.getByName(name);
    return {
      data: field,
      message: t('fields.success.retrieved'),
      status: 'success'
    };
  }

  @Post()
  async createField(@Body() body) {
    const newField = await this.fieldService.create(body);
    return {
      data: newField,
      message: t('fields.success.created'),
      status: 'success'
    };
  }

  @Put('/:id')
  async updateField(@Params('id') id, @Body() body) {
    const updatedField = await this.fieldService.update(id, body);
    return {
      data: updatedField,
      message: t('fields.success.updated'),
      status: 'success'
    };
  }

  @Delete('/:id')
  async deleteField(@Params('id') id) {
    const result = await this.fieldService.delete(id);
    return {
      data: result,
      message: t('fields.success.deleted'),
      status: 'success'
    };
  }

  @Get('/:id/operations')
  async getFieldOperations(@Params('id') id) {
    const operations = await this.fieldService.getFieldOperations(id);
    return {
      data: operations,
      message: t('fields.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/statistics')
  async getFieldStatistics(@Params('id') id) {
    const statistics = await this.fieldService.getFieldStatistics(id);
    return {
      data: statistics,
      message: t('fields.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/utilization')
  async getFieldUtilization(@Params('id') id) {
    const utilization = await this.fieldService.getFieldUtilization(id);
    return {
      data: utilization,
      message: t('fields.success.retrieved'),
      status: 'success'
    };
  }

  @Post('/seed')
  async seedDemoFields(@Body() body) {
    const seed = await this.fieldService.seedDemoFields(body);
    return {
      data: seed,
      message: t('fields.success.seeded'),
      status: 'success'
    };
  }

  @Delete()
  async deleteAllFields() {
    const result = await this.fieldService.deleteAll();
    return {
      data: result,
      message: t('fields.success.allDeleted'),
      status: 'success'
    };
  }

}