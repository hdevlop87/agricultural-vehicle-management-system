import { Repository } from '@/server/shared/decorators';
import { DB } from '@/server/database/db'
import { roles, tokens, users, operators } from '@/server/database/schema';
import { eq, ne, notInArray } from 'drizzle-orm';

@Repository()
export class UserRepository {
  declare db: DB;

  private getUser() {
    return {
      id: users.id,
      name: users.name,
      email: users.email,
      emailVerified: users.emailVerified,
      image: users.image,
      status: users.status,
      roleId: users.roleId,
      role: roles.name,
      // ✅ Get operator information if user is an operator
      operatorId: operators.id,
      operatorCin: operators.cin,
      operatorPhone: operators.phone,
      operatorStatus: operators.status,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    };
  }

  async getAll() {
    return await this.db
      .select(this.getUser())
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .leftJoin(operators, eq(users.id, operators.userId)); // ✅ Join with operators
  }

  async getById(id) {
    const [user] = await this.db
      .select(this.getUser())
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .leftJoin(operators, eq(users.id, operators.userId)) // ✅ Join with operators
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }

  async getByEmail(email) {
    const [existingUser] = await this.db
      .select(this.getUser())
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .leftJoin(operators, eq(users.id, operators.userId)) // ✅ Join with operators
      .where(eq(users.email, email));
    return existingUser;
  }

  // ✅ Specific method to get operator details for a user
  async getUserWithOperatorDetails(userId) {
    const [result] = await this.db
      .select({
        ...this.getUser(),
        // Additional operator fields
        operatorHireDate: operators.hireDate,
        operatorHourlyRate: operators.hourlyRate,
        operatorLicenseNumber: operators.licenseNumber,
        operatorLicenseExpiry: operators.licenseExpiry,
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .leftJoin(operators, eq(users.id, operators.userId))
      .where(eq(users.id, userId))
      .limit(1);
    return result;
  }

  // ✅ Get only users who are operators
  async getAllOperatorUsers() {
    return await this.db
      .select(this.getUser())
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .innerJoin(operators, eq(users.id, operators.userId)) // ✅ Inner join to get only operators
      .where(eq(roles.name, 'operator'));
  }

  async create(data) {
    const [newUser] = await this.db.insert(users).values(data).returning();
    return newUser;
  }

  async update(id, data) {
    const [updatedUser] = await this.db.update(users).set(data).where(eq(users.id, id)).returning();
    return updatedUser;
  }

  async delete(id) {
    const [deletedUser] = await this.db.delete(users).where(eq(users.id, id)).returning();
    return deletedUser;
  }

  async deleteAll() {
    const adminRole = await this.db
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.name, 'Admin'))
      .limit(1);
        
    if (adminRole.length === 0) {
      const deletedUsers = await this.db.delete(users).returning();
      return deletedUsers;
    }
    const deletedUsers = await this.db
      .delete(users)
      .where(ne(users.roleId, adminRole[0].id))
      .returning();
        
    return deletedUsers;
  }

  async getRoleNameById(userId) {
    const [role] = await this.db.select({
      roleName: roles.name
    })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, userId))
     
    return role.roleName
  }

  async getUserPassword(email) {
    const [user] = await this.db
      .select({
        id: users.id,
        email: users.email,
        password: users.password
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user.password;
  }

  async storeRefreshToken(tokenData) {
    return await this.db
      .insert(tokens)
      .values(tokenData)
      .onConflictDoUpdate({
        target: tokens.userId,
        set: {
          token: tokenData.token,
          expiresAt: tokenData.expiresAt,
        }
      }).returning();
  }

  async getRefreshToken(id) {
    const [token] = await this.db.select().from(tokens).where(eq(tokens.userId, id));
    return token.token
  }

  async revokeToken(userId) {
    const [deletedToken] = await this.db.delete(tokens).where(eq(tokens.userId, userId)).returning();
    return deletedToken;
  }
}