import { DB } from '@/server/database/db';
import { alerts, vehicles, operators, users } from '@/server/database/schema';
import { Repository } from '@/server/shared/decorators';
import { count, eq, desc, sql, and, asc, or, isNull } from 'drizzle-orm';

@Repository()
export class AlertRepository {

  declare db: DB;

  private alertSelect = {
    id: alerts.id,
    type: alerts.type,
    title: alerts.title,
    message: alerts.message,
    priority: alerts.priority,
    status: alerts.status,
    vehicleId: alerts.vehicleId,
    vehicleName: vehicles.name,
    operatorId: alerts.operatorId,
    operatorName: users.name,
    createdAt: alerts.createdAt,
    updatedAt: alerts.updatedAt,
  };

  async getAll() {
    return await this.db
      .select(this.alertSelect)
      .from(alerts)
      .leftJoin(vehicles, eq(alerts.vehicleId, vehicles.id))
      .leftJoin(operators, eq(alerts.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .orderBy(desc(alerts.createdAt));
  }

  async getById(id) {
    const [alert] = await this.db
      .select(this.alertSelect)
      .from(alerts)
      .leftJoin(vehicles, eq(alerts.vehicleId, vehicles.id))
      .leftJoin(operators, eq(alerts.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(alerts.id, id))
      .limit(1);
    return alert;
  }

  async getByType(type) {
    return await this.db
      .select(this.alertSelect)
      .from(alerts)
      .leftJoin(vehicles, eq(alerts.vehicleId, vehicles.id))
      .leftJoin(operators, eq(alerts.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(alerts.type, type))
      .orderBy(desc(alerts.createdAt));
  }

  async getByStatus(status) {
    return await this.db
      .select(this.alertSelect)
      .from(alerts)
      .leftJoin(vehicles, eq(alerts.vehicleId, vehicles.id))
      .leftJoin(operators, eq(alerts.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(alerts.status, status))
      .orderBy(desc(alerts.createdAt));
  }

  async getByPriority(priority) {
    return await this.db
      .select(this.alertSelect)
      .from(alerts)
      .leftJoin(vehicles, eq(alerts.vehicleId, vehicles.id))
      .leftJoin(operators, eq(alerts.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(alerts.priority, priority))
      .orderBy(desc(alerts.createdAt));
  }

  async getByVehicleId(vehicleId) {
    return await this.db
      .select(this.alertSelect)
      .from(alerts)
      .where(eq(alerts.vehicleId, vehicleId))
      .orderBy(desc(alerts.createdAt));
  }

  async getByOperatorId(operatorId: string) {
    return await this.db
      .select(this.alertSelect)
      .from(alerts)
      .leftJoin(vehicles, eq(alerts.vehicleId, vehicles.id))
      .leftJoin(operators, eq(alerts.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(alerts.operatorId, operatorId))
      .orderBy(desc(alerts.createdAt));
  }

  async getActiveAlerts() {
    return await this.db
      .select(this.alertSelect)
      .from(alerts)
      .leftJoin(vehicles, eq(alerts.vehicleId, vehicles.id))
      .leftJoin(operators, eq(alerts.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(alerts.status, 'active'))
      .orderBy(desc(alerts.priority), desc(alerts.createdAt));
  }

  async getCriticalAlerts() {
    return await this.db
      .select(this.alertSelect)
      .from(alerts)
      .leftJoin(vehicles, eq(alerts.vehicleId, vehicles.id))
      .leftJoin(operators, eq(alerts.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(
        and(
          eq(alerts.priority, 'critical'),
          or(eq(alerts.status, 'active'), eq(alerts.status, 'acknowledged'))
        )
      )
      .orderBy(desc(alerts.createdAt));
  }

  async getRecentAlertsByHours(hours: number = 24) {
    const hoursAgo = new Date();
    hoursAgo.setHours(hoursAgo.getHours() - hours);

    return await this.db
      .select(this.alertSelect)
      .from(alerts)
      .leftJoin(vehicles, eq(alerts.vehicleId, vehicles.id))
      .leftJoin(operators, eq(alerts.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(sql`${alerts.createdAt} >= ${hoursAgo.toISOString()}`)
      .orderBy(desc(alerts.createdAt));
  }

  async getRecentAlerts(limit: number = 10) {
    return await this.db
      .select(this.alertSelect)
      .from(alerts)
      .leftJoin(vehicles, eq(alerts.vehicleId, vehicles.id))
      .leftJoin(operators, eq(alerts.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .orderBy(desc(alerts.createdAt))
      .limit(limit);
  }

  async getCount() {
    const [alertCount] = await this.db
      .select({ count: count() })
      .from(alerts);
    return alertCount;
  }

  async getStatusCounts() {
    const result = await this.db
      .select({
        status: alerts.status,
        count: sql<number>`count(*)`
      })
      .from(alerts)
      .groupBy(alerts.status)
      .orderBy(alerts.status);

    return result.map(item => ({
      status: item.status,
      count: Number(item.count)
    }));
  }

  async getPriorityCounts() {
    const result = await this.db
      .select({
        priority: alerts.priority,
        count: sql<number>`count(*)`
      })
      .from(alerts)
      .groupBy(alerts.priority)
      .orderBy(alerts.priority);

    return result.map(item => ({
      priority: item.priority,
      count: Number(item.count)
    }));
  }

  async getTypeCounts() {
    const result = await this.db
      .select({
        type: alerts.type,
        count: sql<number>`count(*)`
      })
      .from(alerts)
      .groupBy(alerts.type)
      .orderBy(alerts.type);

    return result.map(item => ({
      type: item.type,
      count: Number(item.count)
    }));
  }

  async create(data) {
    const [newAlert] = await this.db
      .insert(alerts)
      .values(data)
      .returning();
    return newAlert;
  }

  async update(id: string, data) {
    const [updatedAlert] = await this.db
      .update(alerts)
      .set(data)
      .where(eq(alerts.id, id))
      .returning();
    return updatedAlert;
  }

  async updateStatus(id: string, status: string) {
    const updateData: any = { status };
    
    if (status === 'resolved') {
      updateData.resolvedAt = new Date().toISOString();
    }

    const [updatedAlert] = await this.db
      .update(alerts)
      .set(updateData)
      .where(eq(alerts.id, id))
      .returning();
    return updatedAlert;
  }

  async acknowledge(id: string) {
    const [updatedAlert] = await this.db
      .update(alerts)
      .set({ status: 'acknowledged' })
      .where(eq(alerts.id, id))
      .returning();
    return updatedAlert;
  }


  async dismiss(id: string) {
    const [updatedAlert] = await this.db
      .update(alerts)
      .set({ status: 'dismissed' })
      .where(eq(alerts.id, id))
      .returning();
    return updatedAlert;
  }

  async delete(id: string) {
    const [deletedAlert] = await this.db
      .delete(alerts)
      .where(eq(alerts.id, id))
      .returning();
    return deletedAlert;
  }

  async deleteAll() {
    const deletedAlerts = await this.db
      .delete(alerts)
      .returning();

    return {
      deletedCount: deletedAlerts.length,
      deletedAlerts: deletedAlerts
    };
  }

  async deleteResolved() {
    const deletedAlerts = await this.db
      .delete(alerts)
      .where(eq(alerts.status, 'resolved'))
      .returning();

    return {
      deletedCount: deletedAlerts.length,
      deletedAlerts: deletedAlerts
    };
  }

  async checkDuplicateAlert(type, vehicleId?, operatorId?) {
    const conditions = [eq(alerts.type, type), eq(alerts.status, 'active')];
    
    if (vehicleId) conditions.push(eq(alerts.vehicleId, vehicleId));
    if (operatorId) conditions.push(eq(alerts.operatorId, operatorId));

    const [existingAlert] = await this.db
      .select({
        id: alerts.id,
        type: alerts.type,
        title: alerts.title,
        status: alerts.status,
        vehicleId: alerts.vehicleId,
        operatorId: alerts.operatorId,
        createdAt: alerts.createdAt,
      })
      .from(alerts)
      .where(and(...conditions))
      .limit(1);

    return existingAlert;
  }
}