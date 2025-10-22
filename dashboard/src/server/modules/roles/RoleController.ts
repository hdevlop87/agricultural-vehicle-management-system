import { Controller, Get, Post, Put, Delete, Params, Body,t } from 'najm-api';
import { RoleService } from './RoleService';
import { isAdmin } from '@/server/shared/guards';


@Controller('/roles')
@isAdmin()
export class RoleController {
  constructor(
    private roleService: RoleService,
  ) { }

  @Get()
  async getRoles() {
    const roles = await this.roleService.getAll();
    return {
      data: roles,
      message: t('roles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  async getRole(@Params('id') id) {
    const role = await this.roleService.getById(id);
    return {
      data: role,
      message: t('roles.success.retrieved'),
      status: 'success'
    };
  }

  @Post()
  async createRole(@Body() body) {
    const newRole = await this.roleService.create(body);
    return {
      data: newRole,
      message: t('roles.success.created'),
      status: 'success'
    };
  }

  @Put('/:id')
  async updateRole(@Params('id') id, @Body() body) {
    const updatedRole = await this.roleService.update(id, body);
    return {
      data: updatedRole,
      message: t('roles.success.updated'),
      status: 'success'
    };
  }

  @Delete('/:id')
  async deleteRole(@Params('id') id) {
    const result = await this.roleService.delete(id);
    return {
      data: result,
      message: t('roles.success.deleted'),
      status: 'success'
    };
  }
}