import { Injectable, t } from 'najm-api';
import { UserRepository } from './UserRepository';
import { EncryptionService } from '../auth';

import { createUserSchema } from '@/server/database/schema';
import { parseSchema } from '@/server/shared/utils';

@Injectable()
export class UserValidator {
   constructor(
      private userService: UserRepository,
      private encryptionService: EncryptionService,
   ) { }

   async validateCreateUser(data) {
      return parseSchema(createUserSchema, data);
   }

   async isEmailExists(email) {
      const existingUser = await this.userService.getByEmail(email);
      return !!existingUser
   }

   async isPasswordValid(password, hashedPassword) {
      const isPasswordValid = await this.encryptionService.comparePassword(password, hashedPassword);
      return !!isPasswordValid
   }

   async isUserExist(id) {
      const existingUser = await this.userService.getById(id);
      return !!existingUser
   }

   async checkUserIdIsUnique(id) {
      if (!id) return;
      const existingUser = await this.userService.getById(id);
      if (existingUser) {
         throw new Error(t('users.errors.idExists'));
      }
   }

   async isCorrectPass(password) {
      return password &&
         typeof password === 'string' &&
         password.trim().length > 0;
   }

   async hasRole(userId, roles) {
      const roleName = await this.userService.getRoleNameById(userId);

      if (!roleName) {
         throw Error(t('auth.errors.accessDenied'))
      }

      const hasRole = roles.some(
         item => roleName.toLowerCase() === item.toLowerCase()
      )

      if (!hasRole) {
         throw Error(t('auth.errors.accessDenied'))
      }

      return true

   }

   //======================= throw errors

   async checkUserExistsByEmail(email) {
      const user = await this.userService.getByEmail(email);
      if (!user) {
         throw new Error(t('auth.errors.invalidCredentials'))
      }
      return user
   }

   async checkUserExists(id) {
      const userExists = await this.isUserExist(id);
      if (!userExists) {
         throw new Error(t('users.errors.notFound'));
      }
      return userExists;
   }


   async checkEmailUnique(email, excludeId = null) {
      if (!email) return;
      const existingUser = await this.userService.getByEmail(email);
      if (existingUser && existingUser.id !== excludeId) {
         throw new Error(t('auth.errors.emailExists'));
      }
   }

   async checkPasswordValid(password, hashedPassword) {
      const isPasswordValid = await this.isPasswordValid(password, hashedPassword);
      if (!isPasswordValid) {
         throw new Error(t('auth.errors.invalidCredentials'))
      }
   }

}