import { DB } from '@/server/database/db';
import { operations, vehicles, operators, fields, users, trackers } from '@/server/database/schema';
import { Repository } from '@/server/shared/decorators';
import { count, eq, desc, sql, and, or, gte, lte, isNotNull, asc, sum } from 'drizzle-orm';

@Repository()
export class OperationRepository {

  declare db: DB;

  private getOperation() {
    return {
      id: operations.id,
      operatorId: operations.operatorId,
      vehicleId: operations.vehicleId,
      fieldId: operations.fieldId,
      operationType: operations.operationType,
      date: operations.date,
      startTime: operations.startTime,
      endTime: operations.endTime,
      status: operations.status,
      areaCovered: operations.areaCovered,
      duration: operations.duration,
      notes: operations.notes,
      weather: operations.weather,
      startHours: operations.startHours,
      endHours: operations.endHours,
      startMileage: operations.startMileage,
      endMileage: operations.endMileage,
      createdAt: operations.createdAt,
      updatedAt: operations.updatedAt,
      vehicle: {
        id: vehicles.id,
        name: vehicles.name,
        brand: vehicles.brand,
        model: vehicles.model,
        type: vehicles.type,
        status: vehicles.status,
      },
      field: {
        id: fields.id,
        name: fields.name,
        location: fields.location,
        area: fields.area,
      },
      operator: {
        id: operators.id,
        userId: operators.userId,
        name: users.name,
        image: users.image,
      },
      tracker: {
        id: trackers.id,
        deviceId: trackers.deviceId,
        name: trackers.name,
        status: trackers.status,
        isOnline: trackers.isOnline,
        lastSeen: trackers.lastSeen,
        manufacturer: trackers.manufacturer,
        mode: trackers.mode,
        source: trackers.source,
        refreshInterval: trackers.refreshInterval,
        refreshUnit: trackers.refreshUnit,
      }
    };
  }

  async getCount() {
    const [operationsCount] = await this.db
      .select({ count: count() })
      .from(operations);
    return operationsCount;
  }

  async getAll() {
    return await this.db
      .select(this.getOperation())
      .from(operations)
      .leftJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .leftJoin(trackers, eq(trackers.operatorId, operators.id))
      .leftJoin(fields, eq(operations.fieldId, fields.id))
      .orderBy(desc(operations.date), desc(operations.startTime));
  }

  async getById(id: string) {
    const [existingOperation] = await this.db
      .select(this.getOperation())
      .from(operations)
      .leftJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .leftJoin(trackers, eq(trackers.operatorId, operators.id))
      .leftJoin(fields, eq(operations.fieldId, fields.id))
      .where(eq(operations.id, id))
      .limit(1);
    return existingOperation;
  }

  async getByStatus(status) {
    return await this.db
      .select(this.getOperation())
      .from(operations)
      .leftJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .leftJoin(trackers, eq(trackers.operatorId, operators.id))
      .leftJoin(fields, eq(operations.fieldId, fields.id))
      .where(eq(operations.status, status))
      .orderBy(desc(operations.date), desc(operations.startTime));
  }

  async getByDate(date: string) {
    return await this.db
      .select(this.getOperation())
      .from(operations)
      .leftJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .leftJoin(trackers, eq(trackers.operatorId, operators.id))
      .leftJoin(fields, eq(operations.fieldId, fields.id))
      .where(eq(operations.date, date))
      .orderBy(operations.startTime);
  }

  async getTodayOperationsByOperatorId(operatorId: string, date: string) {
    return await this.db
      .select(this.getOperation())
      .from(operations)
      .leftJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .leftJoin(trackers, eq(trackers.operatorId, operators.id))
      .leftJoin(fields, eq(operations.fieldId, fields.id))
      .where(and(
        eq(operations.operatorId, operatorId),
        eq(operations.date, date)
      ))
      .orderBy(operations.startTime);
  }

  async getByVehicleId(vehicleId: string) {
    return await this.db
      .select(this.getOperation())
      .from(operations)
      .leftJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .leftJoin(trackers, eq(trackers.operatorId, operators.id))
      .leftJoin(fields, eq(operations.fieldId, fields.id))
      .where(eq(operations.vehicleId, vehicleId))
      .orderBy(desc(operations.date));
  }

  async getByOperatorId(operatorId: string) {
    return await this.db
      .select(this.getOperation())
      .from(operations)
      .leftJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .leftJoin(trackers, eq(trackers.operatorId, operators.id))
      .leftJoin(fields, eq(operations.fieldId, fields.id))
      .where(eq(operations.operatorId, operatorId))
      .orderBy(desc(operations.date));
  }

  async getByFieldId(fieldId: string) {
    return await this.db
      .select(this.getOperation())
      .from(operations)
      .leftJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .leftJoin(trackers, eq(trackers.operatorId, operators.id))
      .leftJoin(fields, eq(operations.fieldId, fields.id))
      .where(eq(operations.fieldId, fieldId))
      .orderBy(desc(operations.date));
  }

  async getByOperationType(operationType) {
    return await this.db
      .select(this.getOperation())
      .from(operations)
      .leftJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .leftJoin(trackers, eq(trackers.operatorId, operators.id))
      .leftJoin(fields, eq(operations.fieldId, fields.id))
      .where(eq(operations.operationType, operationType))
      .orderBy(desc(operations.date));
  }

  async create(data) {
    const [newOperation] = await this.db
      .insert(operations)
      .values(data)
      .returning();
    return newOperation;
  }

  async update(id: string, data) {
    const [updatedOperation] = await this.db
      .update(operations)
      .set(data)
      .where(eq(operations.id, id))
      .returning();
    return updatedOperation;
  }

  async delete(id: string) {
    const [deletedOperation] = await this.db
      .delete(operations)
      .where(eq(operations.id, id))
      .returning();
    return deletedOperation;
  }

  async deleteAll() {
    const deletedOperations = await this.db
      .delete(operations)
      .returning();
    return deletedOperations;
  }

  async getOperationDuration(operationId: string) {
    const [operation] = await this.db
      .select({
        duration: operations.duration,
        status: operations.status,
      })
      .from(operations)
      .where(eq(operations.id, operationId))
      .limit(1);

    if (!operation) return null;

    return {
      duration: operation.duration ? Number(operation.duration) : null,
      status: operation.status,
    };
  }

  async getAvailableResources(date: string, startTime?: string, endTime?: string) {
    const availableVehicles = await this.db
      .select({
        id: vehicles.id,
        name: vehicles.name,
        vehicleType: vehicles.type,
        status: vehicles.status,
      })
      .from(vehicles)
      .where(
        and(
          eq(vehicles.status, 'active'),
          sql`${vehicles.id} NOT IN (
            SELECT DISTINCT vehicle_id FROM operations 
            WHERE date = ${date} 
            AND status IN ('planned', 'active')
            ${startTime && endTime ? sql`
              AND (
                (start_time IS NULL OR end_time IS NULL) OR
                (start_time < ${endTime} AND end_time > ${startTime})
              )
            ` : sql``}
          )`
        )
      );

    const availableOperators = await this.db
      .select({
        id: operators.id,
        name: users.name,
        status: operators.status,
      })
      .from(operators)
      .leftJoin(users, eq(operators.userId, users.id))
      .where(
        and(
          eq(operators.status, 'active'),
          sql`${operators.id} NOT IN (
            SELECT DISTINCT operator_id FROM operations 
            WHERE date = ${date} 
            AND status IN ('planned', 'active')
            ${startTime && endTime ? sql`
              AND (
                (start_time IS NULL OR end_time IS NULL) OR
                (start_time < ${endTime} AND end_time > ${startTime})
              )
            ` : sql``}
          )`
        )
      );

    return {
      availableVehicles,
      availableOperators,
    };
  }

  async getOperationMetrics(startDate: string, endDate: string) {
    const metrics = await this.db
      .select({
        date: operations.date,
        totalOperations: count(),
        completedOperations: sql<number>`sum(case when ${operations.status} = 'completed' then 1 else 0 end)`,
        totalAreaCovered: sql<number>`sum(${operations.areaCovered})`,
        totalEngineHours: sql<number>`sum(${operations.endHours} - ${operations.startHours})`,
        uniqueVehicles: sql<number>`count(distinct ${operations.vehicleId})`,
        uniqueOperators: sql<number>`count(distinct ${operations.operatorId})`,
      })
      .from(operations)
      .where(
        and(
          gte(operations.date, startDate),
          lte(operations.date, endDate)
        )
      )
      .groupBy(operations.date)
      .orderBy(operations.date);

    return metrics;
  }

  async getOperationTypeStats() {
    const stats = await this.db
      .select({
        operationType: operations.operationType,
        totalOperations: count(),
        completedOperations: sql<number>`sum(case when ${operations.status} = 'completed' then 1 else 0 end)`,
        totalAreaCovered: sql<number>`sum(${operations.areaCovered})`,
        avgEngineHours: sql<number>`avg(${operations.endHours} - ${operations.startHours})`,
      })
      .from(operations)
      .groupBy(operations.operationType)
      .orderBy(desc(count()));

    return stats;
  }

  async getOperationDistribution() {
    const result = await this.db
      .select({
        operationType: operations.operationType,
        count: count(operations.id).as('count'),
        totalArea: sum(operations.areaCovered).as('totalArea'),
        avgDuration: sql`AVG(EXTRACT(EPOCH FROM (${operations.endTime} - ${operations.startTime}))/3600)`.as('avgDuration'),
      })
      .from(operations)
      .groupBy(operations.operationType)
      .orderBy(desc(count(operations.id)));

    return {
      chartType: 'pie',
      data: result,
      labels: result.map(r => r.operationType),
      datasets: [
        {
          data: result.map(r => r.count),
          backgroundColor: [
            '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
            '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6'
          ],
        }
      ]
    };
  }

  async getOperationDurationAnalysis() {
    const result = await this.db
      .select({
        operationType: operations.operationType,
        avgDuration: sql`AVG(EXTRACT(EPOCH FROM (${operations.endTime} - ${operations.startTime}))/3600)`.as('avgDuration'),
        minDuration: sql`MIN(EXTRACT(EPOCH FROM (${operations.endTime} - ${operations.startTime}))/3600)`.as('minDuration'),
        maxDuration: sql`MAX(EXTRACT(EPOCH FROM (${operations.endTime} - ${operations.startTime}))/3600)`.as('maxDuration'),
        operationCount: count(operations.id).as('operationCount'),
      })
      .from(operations)
      .where(and(
        eq(operations.status, 'completed'),
        sql`${operations.endTime} IS NOT NULL AND ${operations.startTime} IS NOT NULL`
      ))
      .groupBy(operations.operationType)
      .orderBy(desc(sql`AVG(EXTRACT(EPOCH FROM (${operations.endTime} - ${operations.startTime}))/3600)`));

    return {
      chartType: 'radar',
      data: result,
      labels: result.map(r => r.operationType),
      datasets: [
        {
          label: 'Average Duration (hours)',
          data: result.map((r: any) => parseFloat(r.avgDuration || '0')),
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
        }
      ]
    };
  }

  async getRecentCompletedOperations(limit = 5) {
    return await this.db
      .select(this.getOperation())
      .from(operations)
      .leftJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .leftJoin(trackers, eq(trackers.operatorId, operators.id))
      .leftJoin(fields, eq(operations.fieldId, fields.id))
      .where(eq(operations.status, 'completed'))
      .orderBy(desc(operations.createdAt))
      .limit(limit);
  }

  async getTopOperatorsByCompletedOperations(limit = 3) {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const result = await this.db
      .select({
        operatorId: operations.operatorId,
        operatorName: users.name,
        operatorImage: users.image,
        completedOperations: count(operations.id),
      })
      .from(operations)
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(
        and(
          eq(operations.status, "completed"),
          gte(operations.date, firstDayOfMonth.toISOString().split('T')[0]),
          lte(operations.date, lastDayOfMonth.toISOString().split('T')[0])
        )
      )
      .groupBy(operations.operatorId, users.name, users.image)
      .orderBy(desc(count(operations.id)))
      .limit(limit);

    return result;
  }
}