
import { Injectable } from 'najm-api';
import { RoleRepository } from './RoleRepository';
import { RoleValidator } from './RoleValidator';

@Injectable()
export class RoleService {
  constructor(
    private roleRepository: RoleRepository,
    private roleValidator: RoleValidator
  ) { }

  async getAll() {
    return await this.roleRepository.getAll();
  }

  async getById(id) {
    await this.roleValidator.checkRoleExists(id);
    return await this.roleRepository.getById(id);
  }

  async getByName(name) {
    return await this.roleRepository.getByName(name);
  }

  async create(data) {
    await this.roleValidator.validateCreateRole(data);
    await this.roleValidator.checkNameUnique(data.name);
    return await this.roleRepository.create(data);
  }

  async update(id, data) {
    await this.roleValidator.checkRoleExists(id);
    await this.roleValidator.checkNameUnique(data.name, id);
    return await this.roleRepository.update(id, data);
  }

  async delete(id) {
    await this.roleValidator.checkRoleExists(id);
    return await this.roleRepository.delete(id);
  }

  async seedDefaultRoles() {
    const defaultRoles = [
      { name: 'Admin', description: 'Administrator with full system privileges' },
      { name: 'Manager', description: 'Manages operations and supervises staff' },
      { name: 'Operator', description: 'Handles day-to-day operational operations' },
      { name: 'User', description: 'Standard system user with limited access' }
    ];

    const rolesToCreate = [];

    for (const role of defaultRoles) {
      const exists = await this.roleValidator.isRoleNameExists(role.name);
      if (!exists) {
        rolesToCreate.push(role);
      }
    }

    const createdRoles = await Promise.all(
      rolesToCreate.map(role => this.roleRepository.create(role))
    );

    return createdRoles;
  }


}