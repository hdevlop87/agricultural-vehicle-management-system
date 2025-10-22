import { DB } from '@/server/database/db';
import { fields, operations, vehicles, operators, users, refuels } from '@/server/database/schema';
import { Repository } from '@/server/shared/decorators';
import { count, eq, desc, sql, and, gte, lte, isNotNull, isNull, asc, sum } from 'drizzle-orm';

@Repository()
export class FieldRepository {

  declare db: DB;

  private getField() {
    return {
      id: fields.id,
      name: fields.name,
      area: fields.area,
      description: fields.description,
      location: fields.location,
      createdAt: fields.createdAt,
      updatedAt: fields.updatedAt,
    };
  }

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
      operator: {
        id: operators.id,
        name: users.name,
        image: users.image,
      },
      field: {
        id: fields.id,
        name: fields.name,
        location: fields.location,
        area: fields.area,
      }
    };
  }

  private getRefuel() {
    return {
      id: refuels.id,
      vehicleId: refuels.vehicleId,
      operatorId: refuels.operatorId,
      datetime: refuels.datetime,
      voucherNumber: refuels.voucherNumber,
      liters: refuels.liters,
      totalCost: refuels.totalCost,
      attendant: refuels.attendant,
      vehicle: {
        id: vehicles.id,
        name: vehicles.name,
        brand: vehicles.brand,
        model: vehicles.model,
        type: vehicles.type,
        status: vehicles.status,
      },
      operator: {
        id: operators.id,
        name: users.name,
        image: users.image,
      }
    };
  }

  async getCount() {
    const [fieldsCount] = await this.db
      .select({ count: count() })
      .from(fields);
    return fieldsCount;
  }

  async getTotalArea() {
    const [totalArea] = await this.db
      .select({ 
        totalArea: sql<number>`sum(${fields.area})`,
        averageArea: sql<number>`avg(${fields.area})`,
        count: count()
      })
      .from(fields)
      .where(isNotNull(fields.area));
    
    return {
      totalArea: totalArea.totalArea || 0,
      averageArea: Math.round((totalArea.averageArea || 0) * 100) / 100,
      fieldCount: totalArea.count
    };
  }

  async getAll() {
    const fieldsList = await this.db
      .select(this.getField())
      .from(fields)
      .orderBy(fields.name);

    // Add analytics to each field
    const fieldsWithAnalytics = await Promise.all(
      fieldsList.map(async (field) => {
        const analytics = await this.getFieldAnalytics(field.id);
        return {
          ...field,
          analytics
        };
      })
    );

    return fieldsWithAnalytics;
  }

  async getById(id: string) {
    const [existingField] = await this.db
      .select(this.getField())
      .from(fields)
      .where(eq(fields.id, id))
      .limit(1);

    if (!existingField) {
      return null;
    }

    const analytics = await this.getFieldAnalytics(id);

    return {
      ...existingField,
      analytics
    };
  }

  async getByName(name: string) {
    const [existingField] = await this.db
      .select(this.getField())
      .from(fields)
      .where(eq(fields.name, name))
      .limit(1);
    return existingField;
  }

  async getFieldsBySize(order: 'asc' | 'desc' = 'desc') {
    const orderBy = order === 'desc' 
      ? desc(fields.area)
      : asc(fields.area);

    return await this.db
      .select(this.getField())
      .from(fields)
      .where(isNotNull(fields.area))
      .orderBy(orderBy);
  }

  async getFieldsByMinArea(minArea: number) {
    return await this.db
      .select(this.getField())
      .from(fields)
      .where(
        and(
          isNotNull(fields.area),
          gte(fields.area, minArea.toString())
        )
      )
      .orderBy(desc(fields.area));
  }

  async getFieldsByMaxArea(maxArea: number) {
    return await this.db
      .select(this.getField())
      .from(fields)
      .where(
        and(
          isNotNull(fields.area),
          lte(fields.area, maxArea.toString())
        )
      )
      .orderBy(asc(fields.area));
  }

  async getFieldsWithActiveOperations() {
    return await this.db
      .selectDistinct(this.getField())
      .from(fields)
      .innerJoin(operations, eq(fields.id, operations.fieldId))
      .where(
        and(
          eq(operations.status, 'active'),
          isNotNull(operations.fieldId)
        )
      )
      .orderBy(fields.name);
  }

  async create(data) {
    const [newField] = await this.db
      .insert(fields)
      .values(data)
      .returning();
    return newField;
  }

  async update(id: string, data) {
    const [updatedField] = await this.db
      .update(fields)
      .set(data)
      .where(eq(fields.id, id))
      .returning();
    return updatedField;
  }

  async delete(id: string) {
    const [deletedField] = await this.db
      .delete(fields)
      .where(eq(fields.id, id))
      .returning();
    return deletedField;
  }

  async checkFieldInUse(fieldId: string) {
    const [operation] = await this.db
      .select({ id: operations.id })
      .from(operations)
      .where(
        and(
          eq(operations.fieldId, fieldId),
          eq(operations.status, 'active')
        )
      )
      .limit(1);
    
    return !!operation;
  }

  async getFieldOperations(fieldId: string) {
    return await this.db
      .select({
        id: operations.id,
        date: operations.date,
        startTime: operations.startTime,
        endTime: operations.endTime,
        status: operations.status,
        vehicleId: operations.vehicleId,
        operatorId: operations.operatorId,
        operationType: operations.operationType,
        areaCovered: operations.areaCovered,
        weather: operations.weather,
        notes: operations.notes,
      })
      .from(operations)
      .where(eq(operations.fieldId, fieldId))
      .orderBy(desc(operations.date));
  }

  async getFieldStatistics(fieldId: string) {
    // Get total operations count
    const [operationsCount] = await this.db
      .select({ count: count() })
      .from(operations)
      .where(eq(operations.fieldId, fieldId));

    // Get completed operations count
    const [completedOperations] = await this.db
      .select({ count: count() })
      .from(operations)
      .where(
        and(
          eq(operations.fieldId, fieldId),
          eq(operations.status, 'completed')
        )
      );

    // Get total area covered (may be less than field area due to partial operations)
    const [totalAreaCovered] = await this.db
      .select({ 
        totalArea: sql<number>`sum(${operations.areaCovered})` 
      })
      .from(operations)
      .where(
        and(
          eq(operations.fieldId, fieldId),
          eq(operations.status, 'completed'),
          isNotNull(operations.areaCovered)
        )
      );

    // Get most recent operation
    const [lastOperation] = await this.db
      .select({
        date: operations.date,
        status: operations.status
      })
      .from(operations)
      .where(eq(operations.fieldId, fieldId))
      .orderBy(desc(operations.date))
      .limit(1);

    // Get field details
    const fieldDetails = await this.getById(fieldId);

    return {
      totalOperations: operationsCount.count,
      completedOperations: completedOperations.count,
      totalAreaCovered: totalAreaCovered.totalArea || 0,
      fieldArea: parseFloat(fieldDetails.area || '0'),
      lastOperation: lastOperation,
      utilizationRate: operationsCount.count > 0 
        ? Math.round((completedOperations.count / operationsCount.count) * 100) 
        : 0,
    };
  }

  async getFieldUtilization(fieldId: string) {
    const field = await this.getById(fieldId);
    const fieldArea = parseFloat(field.area || '0');

    // Get operations by operation type for this field
    const operationsByOperation = await this.db
      .select({
        operationsCount: count(),
        totalAreaCovered: sql<number>`sum(${operations.areaCovered})`,
      })
      .from(operations)
      .where(
        and(
          eq(operations.fieldId, fieldId),
          eq(operations.status, 'completed')
        )
      )
      .orderBy(desc(count()));

    // Calculate utilization metrics
    const utilizationMetrics = operationsByOperation.map(operation => ({
      operationsCount: operation.operationsCount,
      totalAreaCovered: operation.totalAreaCovered || 0,
      fieldCoverage: fieldArea > 0 
        ? Math.round(((operation.totalAreaCovered || 0) / fieldArea) * 100) 
        : 0,
    }));

    return {
      fieldArea,
      operationBreakdown: utilizationMetrics,
      totalUtilization: utilizationMetrics.reduce((sum, operation) => sum + operation.fieldCoverage, 0)
    };
  }

  async getAvailableFields(date: string, operationTypeId?: string) {
    // Get fields that don't have conflicting operations on the specified date
    const conflictingOperations = this.db
      .select({ fieldId: operations.fieldId })
      .from(operations)
      .where(
        and(
          eq(operations.date, date),
          eq(operations.status, 'active'),
          isNotNull(operations.fieldId)
        )
      );

    return await this.db
      .select(this.getField())
      .from(fields)
      .where(sql`${fields.id} NOT IN (${conflictingOperations})`)
      .orderBy(fields.name);
  }

  async getFieldProductivity(fieldId: string, startDate: string, endDate: string) {
    const productivityData = await this.db
      .select({
        month: sql<string>`to_char(${operations.date}, 'YYYY-MM')`,
        operationsCount: count(),
        totalAreaCovered: sql<number>`sum(${operations.areaCovered})`,
        uniqueOperationTypes: sql<number>`count(distinct ${operations.operationType})`,
      })
      .from(operations)
      .where(
        and(
          eq(operations.fieldId, fieldId),
          eq(operations.status, 'completed'),
          gte(operations.date, startDate),
          lte(operations.date, endDate)
        )
      )
      .groupBy(sql`to_char(${operations.date}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${operations.date}, 'YYYY-MM')`);

    return productivityData;
  }

  async getFieldsWithoutRecentOperations(cutoffDate: string) {
    const fieldsWithRecentOps = this.db
      .select({ fieldId: operations.fieldId })
      .from(operations)
      .where(
        and(
          gte(operations.date, cutoffDate),
          isNotNull(operations.fieldId)
        )
      );

    return await this.db
      .select(this.getField())
      .from(fields)
      .where(sql`${fields.id} NOT IN (${fieldsWithRecentOps})`)
      .orderBy(fields.name);
  }

  async getFieldRotationRecommendations() {
    // Simple rotation logic - fields that haven't had certain operations recently
    const recommendations = await this.db
      .select({
        fieldId: fields.id,
        fieldName: fields.name,
        area: fields.area,

        lastOperationDate: sql<string>`max(${operations.date})`,
        daysSinceLastOperation: sql<number>`
          extract(day from (current_date - max(${operations.date})))
        `
      })
      .from(fields)
      .leftJoin(operations, eq(fields.id, operations.fieldId))
      .where(eq(operations.status, 'completed'))
      .having(sql`extract(day from (current_date - max(${operations.date}))) > 30`)
      .orderBy(sql`extract(day from (current_date - max(${operations.date}))) desc`);

    return recommendations;
  }

  async deleteAll() {
    const allFields = await this.db
      .select()
      .from(fields)
      .orderBy(desc(fields.createdAt));

    const deletedFields = await this.db
      .delete(fields)
      .returning();

    return {
      deletedCount: deletedFields.length,
      deletedFields: deletedFields
    };
  }

  async getFieldsInUse() {
    const fieldsInUse = await this.db
      .select({
        fieldId: operations.fieldId,
        fieldName: fields.name,
        operationId: operations.id,
      })
      .from(operations)
      .innerJoin(fields, eq(operations.fieldId, fields.id))
      .where(eq(operations.status, 'planned'))
      .groupBy(operations.fieldId, fields.name, operations.id);

    return fieldsInUse;
  }

  // ===== ANALYTICS METHODS =====

  async getFieldAnalytics(fieldId: string) {
    const totalOperationsData = await this.getTotalOperationCount(fieldId);
    const completedOperationsData = await this.getCompletedOperationCount(fieldId);
    const totalAreaCoveredData = await this.getTotalAreaCovered(fieldId);
    const productivityData = await this.getFieldProductivityMetrics(fieldId);
    const fieldRefuelsData = await this.getFieldRefuelConsumption(fieldId);

    // Get recent records using direct queries
    const recentOperations = await this.getRecentOperations(fieldId);
    const recentRefuels = await this.getRecentRefuels(fieldId);

    // Get field data for calculations
    const fieldData = await this.db
      .select(this.getField())
      .from(fields)
      .where(eq(fields.id, fieldId))
      .limit(1);

    const fieldArea = parseFloat(fieldData[0]?.area || '0');

    // Calculate efficiency and utilization
    const efficiency = totalOperationsData.count > 0
      ? (completedOperationsData.count / totalOperationsData.count) * 100
      : 0;

    const utilizationRate = fieldArea > 0 && totalAreaCoveredData.totalAreaCovered > 0
      ? Math.min(100, (totalAreaCoveredData.totalAreaCovered / fieldArea) * 100)
      : 0;

    // Calculate productivity score based on operations per hectare
    const productivityScore = fieldArea > 0 && completedOperationsData.count > 0
      ? Math.round((completedOperationsData.count / fieldArea) * 10) / 10
      : 0;

    return {
      // Main metrics
      totalOperations: totalOperationsData.count || 0,
      totalOperationsCompleted: completedOperationsData.count || 0,
      totalAreaCovered: totalAreaCoveredData.totalAreaCovered || 0,
      fieldArea: fieldArea,
      totalFuelCost: fieldRefuelsData.totalCost || 0,
      totalFuelLiters: fieldRefuelsData.totalLiters || 0,
      totalRefuels: fieldRefuelsData.refuelCount || 0,
      efficiency: Math.round(efficiency * 100) / 100,

      // Field-specific analytics
      utilizationRate: Math.round(utilizationRate * 100) / 100,
      productivityScore,
      uniqueOperationTypes: productivityData.uniqueOperationTypes || 0,
      avgAreaPerOperation: completedOperationsData.count > 0
        ? Math.round((totalAreaCoveredData.totalAreaCovered / completedOperationsData.count) * 100) / 100
        : 0,

      // Recent records (3 most recent)
      recentOperations,
      recentRefuels,
    };
  }

  async getTotalOperationCount(fieldId: string) {
    const [result] = await this.db
      .select({ count: count() })
      .from(operations)
      .where(eq(operations.fieldId, fieldId));
    return result;
  }

  async getCompletedOperationCount(fieldId: string) {
    const [result] = await this.db
      .select({ count: count() })
      .from(operations)
      .where(and(
        eq(operations.fieldId, fieldId),
        eq(operations.status, 'completed')
      ));
    return result;
  }

  async getTotalAreaCovered(fieldId: string) {
    const [result] = await this.db
      .select({
        totalAreaCovered: sql<number>`COALESCE(SUM(CAST(${operations.areaCovered} AS NUMERIC)), 0)`
      })
      .from(operations)
      .where(and(
        eq(operations.fieldId, fieldId),
        eq(operations.status, 'completed'),
        isNotNull(operations.areaCovered)
      ));
    return result;
  }

  async getFieldProductivityMetrics(fieldId: string) {
    const [result] = await this.db
      .select({
        uniqueOperationTypes: sql<number>`COUNT(DISTINCT ${operations.operationType})`,
        avgDuration: sql<number>`AVG(CAST(${operations.duration} AS NUMERIC))`,
        totalDuration: sql<number>`COALESCE(SUM(CAST(${operations.duration} AS NUMERIC)), 0)`
      })
      .from(operations)
      .where(and(
        eq(operations.fieldId, fieldId),
        eq(operations.status, 'completed')
      ));
    return result;
  }

  async getFieldRefuelConsumption(fieldId: string) {
    const [result] = await this.db
      .select({
        totalCost: sql<number>`COALESCE(SUM(CAST(${refuels.totalCost} AS NUMERIC)), 0)`,
        totalLiters: sql<number>`COALESCE(SUM(CAST(${refuels.liters} AS NUMERIC)), 0)`,
        refuelCount: count()
      })
      .from(refuels)
      .leftJoin(operations, eq(refuels.vehicleId, operations.vehicleId))
      .where(and(
        eq(operations.fieldId, fieldId),
        eq(operations.status, 'completed')
      ));
    return result;
  }

  // ===== RECENT RECORDS METHODS =====

  async getRecentOperations(fieldId: string) {
    return await this.db
      .select(this.getOperation())
      .from(operations)
      .leftJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .leftJoin(fields, eq(operations.fieldId, fields.id))
      .where(eq(operations.fieldId, fieldId))
      .orderBy(desc(operations.date), desc(operations.startTime))
      .limit(3);
  }

  async getRecentRefuels(fieldId: string) {
    // Get refuels from operations that happened in this field
    return await this.db
      .select(this.getRefuel())
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .leftJoin(operators, eq(refuels.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .leftJoin(operations, and(
        eq(refuels.vehicleId, operations.vehicleId),
        eq(operations.fieldId, fieldId)
      ))
      .where(and(
        eq(operations.fieldId, fieldId),
        isNotNull(operations.id)
      ))
      .orderBy(desc(refuels.datetime))
      .limit(3);
  }

}