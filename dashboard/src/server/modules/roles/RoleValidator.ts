import { Injectable, t } from 'najm-api';
import { RoleRepository } from './RoleRepository';

import { parseSchema } from '@/server/shared/utils';
import { createRoleSchema } from '@/server/database/schema';


@Injectable()
export class RoleValidator {
    constructor(
        private roleService: RoleRepository,
    ) { }

    async validateCreateRole(data) {
        return parseSchema(createRoleSchema, data);
    }

    async isRoleNameExists(roleName: string) {
        const existingRole = await this.roleService.getByName(roleName);
        return !!existingRole;
    }

    async isRoleIdExists(id: string) {
        const existingRole = await this.roleService.getById(id);
        return !!existingRole;
    }

    async checkNameUnique(roleName: string, excludeId = null) {
        if (!roleName) return;
        const existingRole = await this.roleService.getByName(roleName);

        if (existingRole && existingRole.id !== excludeId) {
            throw new Error(t('roles.errors.exists'));
        }
    }

    async checkRoleExists(id: string) {
        const roleIdExists = await this.isRoleIdExists(id);
        if (!roleIdExists) {
            throw new Error(t('roles.errors.notFound'));
        }
    }

    async checkRoleExistsByName(roleName: string) {
        const roleNameExists = await this.isRoleNameExists(roleName);
        if (!roleNameExists) {
            throw new Error(t('roles.errors.notFound'));
        }
    }

    async checkAdminRoleExists() {
        const adminRole = await this.roleService.getByName('Admin');
        if (!adminRole) {
            throw new Error(t('users.errors.adminRoleNotFound'));
        }
        return adminRole;
    }
}