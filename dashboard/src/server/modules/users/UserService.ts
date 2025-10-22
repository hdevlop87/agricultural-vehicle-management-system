import { Injectable, setLanguage, getCurrentLanguage } from 'najm-api';
import { UserRepository } from './UserRepository';
import { UserValidator } from './UserValidator';
import { RoleService, RoleValidator } from '../roles';
import { EncryptionService } from '../auth';
import { nanoid } from 'nanoid';
import { clean, getAvatarFile } from '@/server/shared/utils';
import { FileService } from '../files';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private roleValidator: RoleValidator,
    private encryptionService: EncryptionService,
    private userValidator: UserValidator,
    private roleService: RoleService,
    private fileService: FileService
  ) { }

  private sanitizeUser(user: any): any {
    if (!user) return user;
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  private sanitizeUsers(users: any[]): any[] {
    return users.map(user => this.sanitizeUser(user));
  }

  async getAll() {
    const users = await this.userRepository.getAll();
    return this.sanitizeUsers(users);
  }

  async getById(id) {
    await this.userValidator.checkUserExists(id);
    const user = await this.userRepository.getById(id);
    return this.sanitizeUser(user);
  }

  async getByEmail(email) {
    const user = await this.userValidator.checkUserExistsByEmail(email);
    return this.sanitizeUser(user);
  }

  async create(data) {
    const { id, name, email, image, password, roleId } = data;
    let uploadedFile = null;
    const userId = id || nanoid(5);

    try {
      await this.userValidator.validateCreateUser(data);
      await this.userValidator.checkEmailUnique(data.email);
      await this.userValidator.checkUserIdIsUnique(id);

      const pass = password || '12345678';
      const hashedPassword = await this.encryptionService.hashPassword(pass);
      const roleUser = await this.roleService.getByName('Operator');
      const imageName = await this.fileService.handleImage(image, null, userId);

      const userDetails = {
        id: userId,
        name,
        email,
        image: imageName,
        password: hashedPassword,
        roleId: roleId || roleUser.id,
        status: 'pending'
      };

      const newUser = await this.userRepository.create(userDetails);
      return this.sanitizeUser(newUser);

    } catch (error) {
      if (uploadedFile) {
        await this.fileService.delete(image);
      }
      throw error;
    }
  }

  async update(id, data) {

    const { password, image } = data;

    await this.userValidator.checkUserExists(id);
    await this.userValidator.checkEmailUnique(data.email, id);

    const currentUser = await this.userRepository.getById(id);
    const imageName = await this.fileService.handleImage(image, currentUser.image, id);
    const hashedPassword = await this.encryptionService.hashPassword(password);

    const updateData = {
      ...data,
      image: imageName,
      ...(hashedPassword && { password: hashedPassword })
    };

    const cleanedUpdateData = clean(updateData);
    const updatedUser = await this.userRepository.update(id, cleanedUpdateData);
    return this.sanitizeUser(updatedUser);
  }

  async delete(id) {
    await this.userValidator.checkUserExists(id);
    const user = await this.userRepository.delete(id);
    await this.fileService.delete(user.image);
    return this.sanitizeUser(user);
  }

  async deleteAll() {
    const deletedUsers = await this.userRepository.deleteAll();
    for (const user of deletedUsers) {
      if (user.image) await this.fileService.delete(user.image);
    }

    return this.sanitizeUsers(deletedUsers);
  }

  async getRoleName(id) {
    await this.userValidator.checkUserExists(id);
    return await this.userRepository.getRoleNameById(id);
  }

  async getPassword(email) {
    await this.userValidator.checkUserExistsByEmail(email);
    return await this.userRepository.getUserPassword(email);
  }

  async assignRole(id, roleId) {
    await this.userValidator.checkUserExists(id);
    await this.roleValidator.checkRoleExists(roleId);
    const updatedUser = await this.userRepository.update(id, { roleId });
    return this.sanitizeUser(updatedUser);
  }

  async removeRole(id) {
    await this.userValidator.checkUserExists(id);
    const updatedUser = await this.userRepository.update(id, { roleId: null });
    return this.sanitizeUser(updatedUser);
  }

  async revokeToken(userId) {
    return await this.userRepository.revokeToken(userId)
  }

  async seedAdminUser() {
    const email = 'admin@admin.com';
    const adminRole = await this.roleValidator.checkAdminRoleExists();

    const existingUser = await this.userRepository.getByEmail(email);

    if (existingUser) {
      await this.delete(existingUser.id);
    }

    const avatarFile = await getAvatarFile('admin.png');

    const newAdminUser = await this.create({
      id: 'USR00',
      name: 'System Administrator',
      email,
      password: '12345678',
      image: avatarFile,
      roleId: adminRole.id,
      status: 'active',
      emailVerified: true
    });

    return this.sanitizeUser(newAdminUser);
  }

  async updateUserLang(language) {
    setLanguage(language)
    return language
  }

  async getUserLang() {
    return getCurrentLanguage();
  }


}