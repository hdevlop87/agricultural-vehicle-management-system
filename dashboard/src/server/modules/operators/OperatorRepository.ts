import { DB } from '@/server/database/db';
import { operators, operations, refuels, users, alerts, vehicles, fields, trackers } from '@/server/database/schema';
import { Repository } from '@/server/shared/decorators';
import { count, eq, desc, sql, and, or, gte, lte, isNull, isNotNull, sum } from 'drizzle-orm';

@Repository()
export class OperatorRepository {

  declare db: DB;

  // === SELECT DEFINITIONS ===
  private readonly operatorSelect = {
    id: operators.id,
    userId: operators.userId,
    name: users.name,
    image: users.image,
    phone: operators.phone,
    cin: operators.cin,
    email: users.email,
    licenseNumber: operators.licenseNumber,
    licenseExpiry: operators.licenseExpiry,
    hireDate: operators.hireDate,
    status: operators.status,
    hourlyRate: operators.hourlyRate,
    createdAt: operators.createdAt,
    updatedAt: operators.updatedAt,
  };

  private readonly operationSelect = {
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
      name: users.name,
      image: users.image,
      userId: users.id
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

  private readonly trackerSelect = {
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
  };

  private readonly refuelSelect = {
    id: refuels.id,
    vehicleId: refuels.vehicleId,
    vehicleName: vehicles.name,
    datetime: refuels.datetime,
    voucherNumber: refuels.voucherNumber,
    liters: refuels.liters,
    totalCost: refuels.totalCost,
    attendant: refuels.attendant,
  };

  private readonly alertSelect = {
    id: alerts.id,
    title: alerts.title,
    type: alerts.type,
    priority: alerts.priority,
    status: alerts.status,
    vehicleId: alerts.vehicleId,
    createdAt: alerts.createdAt,
  };

  private readonly operationSimpleSelect = {
    id: operations.id,
    date: operations.date,
    startTime: operations.startTime,
    endTime: operations.endTime,
    status: operations.status,
    vehicleId: operations.vehicleId,
    operationType: operations.operationType,
    fieldId: operations.fieldId,
    areaCovered: operations.areaCovered,
    notes: operations.notes,
  };

  private readonly operatorInUseSelect = {
    operatorId: operations.operatorId,
    operatorName: users.name,
    operationId: operations.id,
  };

  async getCount() {
    const [operatorsCount] = await this.db
      .select({ count: count() })
      .from(operators);
    return operatorsCount;
  }

  async getAll() {
    const allOperators = await this.db
      .select(this.operatorSelect)
      .from(operators)
      .leftJoin(users, eq(operators.userId, users.id))
      .orderBy(desc(operators.createdAt));

    // Calculate years of service for each operator
    return allOperators.map(operator => ({
      ...operator,
      yearsOfService: operator.hireDate
        ? new Date().getFullYear() - new Date(operator.hireDate).getFullYear()
        : 0
    }));
  }

  async getById(id) {
    const [existingOperator] = await this.db
      .select(this.operatorSelect)
      .from(operators)
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(operators.id, id))
      .limit(1);

    if (!existingOperator) return null;

    // Get operator's tracker information
    const [tracker] = await this.db
      .select(this.trackerSelect)
      .from(trackers)
      .where(eq(trackers.operatorId, id))
      .limit(1);

    const analytics = await this.getOperatorAnalytics(id);
    const todayOperations = await this.getTodayOperations(id);

    // Calculate years of service
    const yearsOfService = existingOperator.hireDate
      ? new Date().getFullYear() - new Date(existingOperator.hireDate).getFullYear()
      : 0;

    return {
      ...existingOperator,
      yearsOfService,
      analytics,
      todayOperations,
      tracker
    };
  }

  async getByStatus(status) {
    return await this.db
      .select(this.operatorSelect)
      .from(operators)
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(operators.status, status))
      .orderBy(desc(operators.createdAt));
  }

  async getByUserId(userId) {
    const [existingOperator] = await this.db
      .select(this.operatorSelect)
      .from(operators)
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(operators.userId, userId))
      .limit(1);
    return existingOperator;
  }

  async getByLicenseNumber(licenseNumber) {
    const [existingOperator] = await this.db
      .select(this.operatorSelect)
      .from(operators)
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(operators.licenseNumber, licenseNumber))
      .limit(1);
    return existingOperator;
  }

  async getByCin(cin) {
    const [existingOperator] = await this.db
      .select(this.operatorSelect)
      .from(operators)
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(operators.cin, cin))
      .limit(1);
    return existingOperator;
  }

  async getByEmail(email) {
    const [existingOperator] = await this.db
      .select(this.operatorSelect)
      .from(operators)
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(users.email, email))
      .limit(1);
    return existingOperator;
  }

  async getLicenseExpiringOperators(daysAhead: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return await this.db
      .select(this.operatorSelect)
      .from(operators)
      .leftJoin(users, eq(operators.userId, users.id))
      .where(
        and(
          eq(operators.status, 'active'),
          lte(operators.licenseExpiry, futureDate.toISOString().split('T')[0]),
          gte(operators.licenseExpiry, new Date().toISOString().split('T')[0])
        )
      )
      .orderBy(operators.licenseExpiry);
  }

  async create(data) {
    const [newOperator] = await this.db
      .insert(operators)
      .values(data)
      .returning();
    return newOperator;
  }

  async update(id, data) {
    const [updatedOperator] = await this.db
      .update(operators)
      .set(data)
      .where(eq(operators.id, id))
      .returning();
    return updatedOperator;
  }

  async delete(id) {
    const [deletedOperator] = await this.db
      .delete(operators)
      .where(eq(operators.id, id))
      .returning();
    return deletedOperator;
  }

  async checkOperatorInUse(operatorId) {
    const [activeOperation] = await this.db
      .select({ id: operations.id })
      .from(operations)
      .where(
        and(
          eq(operations.operatorId, operatorId),
          or(
            eq(operations.status, 'active'),
            eq(operations.status, 'planned')
          )
        )
      )
      .limit(1);

    return !!activeOperation;
  }

  async getOperatorOperations(operatorId) {
    return await this.db
      .select(this.operationSimpleSelect)
      .from(operations)
      .where(eq(operations.operatorId, operatorId))
      .orderBy(desc(operations.date));
  }

  async getAvailableOperators(date, startTime?, endTime?) {
    const conflictingOperations = this.db
      .select({ operatorId: operations.operatorId })
      .from(operations)
      .where(
        and(
          eq(operations.date, date),
          or(
            eq(operations.status, 'planned'),
            eq(operations.status, 'active')
          ),
          startTime && endTime
            ? and(
              lte(operations.startTime, endTime),
              gte(operations.endTime, startTime)
            )
            : sql`true`
        )
      );

    return await this.db
      .select(this.operatorSelect)
      .from(operators)
      .leftJoin(users, eq(operators.userId, users.id))
      .where(
        and(
          eq(operators.status, 'active'),
          sql`${operators.id} NOT IN (${conflictingOperations})`
        )
      )
      .orderBy(users.name);
  }

  async deleteAll() {
    const allOperators = await this.db
      .select(this.operatorSelect)
      .from(operators)
      .leftJoin(users, eq(operators.userId, users.id))
      .orderBy(desc(operators.createdAt));

    const deletedOperators = await this.db
      .delete(operators)
      .returning();

    return {
      deletedCount: deletedOperators.length,
      deletedOperators: deletedOperators
    };
  }

  async getOperatorsInUse() {
    return await this.db
      .select(this.operatorInUseSelect)
      .from(operations)
      .innerJoin(operators, eq(operations.operatorId, operators.id))
      .innerJoin(users, eq(operators.userId, users.id))
      .where(eq(operations.status, 'planned'))
      .groupBy(operations.operatorId, users.name, operations.id);
  }

  async getCompletedOperationCount(operatorId) {
    const [completedCount] = await this.db
      .select({ count: count() })
      .from(operations)
      .where(
        and(
          eq(operations.operatorId, operatorId),
          eq(operations.status, 'completed')
        )
      );
    return completedCount;
  }

  async getCompletedOperationDuration(operatorId) {
    const [durationData] = await this.db
      .select({
        totalDuration: sum(operations.duration),
      })
      .from(operations)
      .where(
        and(
          eq(operations.operatorId, operatorId),
          eq(operations.status, 'completed'),
          isNotNull(operations.duration)
        )
      );

    return {
      totalDuration: Number(durationData.totalDuration) || 0,
    };
  }

  async getAllOperationCount(operatorId) {
    const [allCount] = await this.db
      .select({ count: count() })
      .from(operations)
      .where(eq(operations.operatorId, operatorId));
    return allCount;
  }

  async getFuelConsumption(operatorId) {
    const [consumption] = await this.db
      .select({
        refuelCount: count(),
        totalLiters: sum(refuels.liters),
        totalCost: sum(refuels.totalCost),
      })
      .from(refuels)
      .where(
        and(
          eq(refuels.operatorId, operatorId),
          isNotNull(refuels.liters),
          isNotNull(refuels.totalCost)
        )
      );

    return {
      refuelCount: Number(consumption.refuelCount) || 0,
      totalLiters: Number(consumption.totalLiters) || 0,
      totalCost: Number(consumption.totalCost) || 0,
    };
  }

  async getTotalAreaCovered(operatorId) {
    const [areaData] = await this.db
      .select({
        totalArea: sum(operations.areaCovered)
      })
      .from(operations)
      .where(
        and(
          eq(operations.operatorId, operatorId),
          eq(operations.status, 'completed'),
          isNotNull(operations.areaCovered)
        )
      );

    return {
      totalAreaCovered: Number(areaData.totalArea) || 0,
    };
  }

  async getRecentFuelRecords(operatorId) {
    return await this.db
      .select(this.refuelSelect)
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .where(eq(refuels.operatorId, operatorId))
      .orderBy(desc(refuels.datetime))
      .limit(3);
  }

  async getRecentOperations(operatorId) {
    return await this.db
      .select(this.operationSelect)
      .from(operations)
      .leftJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .leftJoin(fields, eq(operations.fieldId, fields.id))
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .leftJoin(trackers, eq(trackers.operatorId, operators.id))
      .where(eq(operations.operatorId, operatorId))
      .orderBy(desc(operations.date), desc(operations.startTime))
      .limit(3);
  }

  async getRecentAlerts(operatorId) {
    return await this.db
      .select(this.alertSelect)
      .from(alerts)
      .where(eq(alerts.operatorId, operatorId))
      .orderBy(desc(alerts.createdAt))
      .limit(3);
  }

  async getTodayOperations(operatorId) {
    const today = new Date().toISOString().split('T')[0];

    return await this.db
      .select(this.operationSelect)
      .from(operations)
      .leftJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .leftJoin(fields, eq(operations.fieldId, fields.id))
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .leftJoin(trackers, eq(trackers.operatorId, operators.id))
      .where(and(
        eq(operations.operatorId, operatorId),
        eq(operations.date, today)
      ))
      .orderBy(operations.startTime);
  }

  async getOperatorAnalytics(operatorId) {
    const completedOpsData = await this.getCompletedOperationCount(operatorId);
    const allOpsData = await this.getAllOperationCount(operatorId);
    const durationData = await this.getCompletedOperationDuration(operatorId);
    const areaData = await this.getTotalAreaCovered(operatorId);
    const fuelData = await this.getFuelConsumption(operatorId);

    // Get recent records using direct queries
    const recentFuelRecords = await this.getRecentFuelRecords(operatorId);
    const recentOperations = await this.getRecentOperations(operatorId);
    const recentAlerts = await this.getRecentAlerts(operatorId);

    // Calculate efficiency
    const efficiency = allOpsData.count > 0
      ? (completedOpsData.count / allOpsData.count) * 100
      : 0;

    // Calculate derived analytics
    const avgHoursPerOperation = completedOpsData.count > 0
      ? Math.round((durationData.totalDuration / completedOpsData.count) * 10) / 10
      : 0;

    const avgFuelCostPerRefuel = fuelData.refuelCount > 0
      ? fuelData.totalCost / fuelData.refuelCount
      : 0;

    const avgHectaresPerOperation = completedOpsData.count > 0
      ? Math.round((areaData.totalAreaCovered / completedOpsData.count) * 10) / 10
      : 0;

    return {
      // Main metrics
      totalOperationsCompleted: completedOpsData.count || 0,
      totalHoursWorked: durationData.totalDuration || 0,
      totalHectaresCovered: areaData.totalAreaCovered || 0,
      totalFuelCost: fuelData.totalCost || 0,
      totalOperations: allOpsData.count || 0,
      efficiency: Math.round(efficiency * 100) / 100,
      totalRefuels: fuelData.refuelCount || 0,
      totalLiters: fuelData.totalLiters || 0,

      // Derived analytics
      avgHoursPerOperation,
      avgFuelCostPerRefuel,
      avgHectaresPerOperation,

      // Recent records (3 most recent)
      recentFuelRecords,
      recentOperations,
      recentAlerts,
    };
  }

}