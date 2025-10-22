import { DB } from '@/server/database/db';
import { vehicles, operations, refuels, alerts, maintenance, users, operators, fields, trackers, trackerHistory } from '@/server/database/schema';
import { Repository } from '@/server/shared/decorators';
import { count, eq, desc, sql, and, gte, sum } from 'drizzle-orm';

@Repository()
export class VehicleRepository {

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
        name: users.name,
        image: users.image,
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

  private getMaintenance() {
    return {
      id: maintenance.id,
      vehicleId: maintenance.vehicleId,
      type: maintenance.type,
      title: maintenance.title,
      scheduledDate: maintenance.scheduledDate,
      status: maintenance.status,
      dueHours: maintenance.dueHours,
      cost: maintenance.cost,
      priority: maintenance.priority,
      partsUsed: maintenance.partsUsed,
      assignedTo: maintenance.assignedTo,
      notes: maintenance.notes,
      createdAt: maintenance.createdAt,
      updatedAt: maintenance.updatedAt,
      vehicle: {
        id: vehicles.id,
        name: vehicles.name,
        brand: vehicles.brand,
        model: vehicles.model,
        type: vehicles.type,
        status: vehicles.status,
      },
    };
  }

  private getAlert() {
    return {
      id: alerts.id,
      vehicleId: alerts.vehicleId,
      operatorId: alerts.operatorId,
      type: alerts.type,
      title: alerts.title,
      message: alerts.message,
      priority: alerts.priority,
      status: alerts.status,
      createdAt: alerts.createdAt,
      updatedAt: alerts.updatedAt,
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
    const [vehiclesCount] = await this.db
      .select({ count: count() })
      .from(vehicles);
    return vehiclesCount;
  }

  async getAll() {
    return await this.db
      .select()
      .from(vehicles)
      .orderBy(desc(vehicles.createdAt));
  }

  async getById(id) {
    const [existingVehicle] = await this.db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, id))
      .limit(1);

    if (!existingVehicle) return null;

    const analytics = await this.getVehicleAnalytics(id);

    // Calculate vehicle age
    const currentYear = new Date().getFullYear();
    const vehicleAge = existingVehicle?.year ? currentYear - parseInt(existingVehicle.year) : 0;

    // Calculate total mileage from vehicle data
    const totalMileageCalculated = existingVehicle?.currentMileage && existingVehicle?.initialMileage
      ? parseFloat(existingVehicle.currentMileage) - parseFloat(existingVehicle.initialMileage)
      : 0;

    return {
      ...existingVehicle,
      vehicleAge,
      totalMileageCalculated,
      analytics
    };
  }

  async getByType(type) {
    return await this.db
      .select()
      .from(vehicles)
      .where(eq(vehicles.type, type))
      .orderBy(desc(vehicles.createdAt));
  }

  async getByStatus(status) {
    return await this.db
      .select()
      .from(vehicles)
      .where(eq(vehicles.status, status))
  }

  async getByLicensePlate(licensePlate) {
    const [existingVehicle] = await this.db
      .select()
      .from(vehicles)
      .where(eq(vehicles.licensePlate, licensePlate))
      .limit(1);
    return existingVehicle;
  }

  async getVehicleTypes() {
    const types = await this.db
      .selectDistinct({
        type: vehicles.type,
        count: sql<number>`count(*)`
      })
      .from(vehicles)
      .groupBy(vehicles.type)
      .orderBy(vehicles.type);
    return types;
  }

  async create(data) {
    const [newVehicle] = await this.db
      .insert(vehicles)
      .values(data)
      .returning();
    return newVehicle;
  }

  async update(id: string, data) {
    const [updatedVehicle] = await this.db
      .update(vehicles)
      .set(data)
      .where(eq(vehicles.id, id))
      .returning();
    return updatedVehicle;
  }

  async delete(id: string) {
    const [deletedVehicle] = await this.db
      .delete(vehicles)
      .where(eq(vehicles.id, id))
      .returning();
    return deletedVehicle;
  }

  async checkVehicleInUse(vehicleId: string) {
    const [activeOperation] = await this.db
      .select({ id: operations.id })
      .from(operations)
      .where(
        and(
          eq(operations.vehicleId, vehicleId),
          eq(operations.status, 'planned')
        )
      )
      .limit(1);

    return !!activeOperation;
  }

  async getUsageStats(vehicleId: string) {
    // Get total operations count
    const [operationsCount] = await this.db
      .select({ count: count() })
      .from(operations)
      .where(eq(operations.vehicleId, vehicleId));

    // Get total fuel records count
    const [refuelsCount] = await this.db
      .select({ count: count() })
      .from(refuels)
      .where(eq(refuels.vehicleId, vehicleId));

    // Get latest operation
    const [latestOperation] = await this.db
      .select({
        date: operations.date,
        endHours: operations.endHours,
        endMileage: operations.endMileage
      })
      .from(operations)
      .where(eq(operations.vehicleId, vehicleId))
      .orderBy(desc(operations.date))
      .limit(1);

    return {
      totalOperations: operationsCount.count,
      totalFuelRecords: refuelsCount.count,
      lastOperation: latestOperation,
    };
  }

  async getMaintenanceDueVehicles() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return await this.db
      .select()
      .from(vehicles)
      .leftJoin(operations, eq(vehicles.id, operations.vehicleId))
      .where(
        and(
          eq(vehicles.status, 'active'),
          gte(operations.date, thirtyDaysAgo.toISOString().split('T')[0])
        )
      )
      .groupBy(vehicles.id)
      .having(sql`count(${operations.id}) = 0`);
  }

  async deleteAll() {
    const allVehicles = await this.db
      .select()
      .from(vehicles)
      .orderBy(desc(vehicles.createdAt));

    const deletedVehicles = await this.db
      .delete(vehicles)
      .returning();

    return {
      deletedCount: deletedVehicles.length,
      deletedVehicles: deletedVehicles
    };
  }

  async getVehiclesInUse() {
    const vehiclesInUse = await this.db
      .select({
        vehicleId: operations.vehicleId,
        vehicleName: vehicles.name,
        operationId: operations.id,
      })
      .from(operations)
      .innerJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .where(eq(operations.status, 'planned'))
      .groupBy(operations.vehicleId, vehicles.name, operations.id);

    return vehiclesInUse;
  }

  async getStatusDistribution() {
    const result = await this.db
      .select({
        status: vehicles.status,
        count: sql<number>`count(*)`
      })
      .from(vehicles)
      .groupBy(vehicles.status)
      .orderBy(vehicles.status);

    return result.map(item => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: Number(item.count),
      status: item.status,
      color: item.status === 'active' ? '#22c55e' :
        item.status === 'maintenance' ? '#f59e0b' : '#ef4444'
    }));
  }

  async getTypeDistribution() {
    const result = await this.db
      .select({
        type: vehicles.type,
        count: sql<number>`count(*)`
      })
      .from(vehicles)
      .groupBy(vehicles.type)
      .orderBy(desc(sql<number>`count(*)`));

    return result.map(item => ({
      name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
      value: Number(item.count),
      type: item.type,
      fill: '#3b82f6'
    }));
  }

  async getAgeAnalysis() {
    const currentYear = new Date().getFullYear();

    const result = await this.db
      .select({
        id: vehicles.id,
        name: vehicles.name,
        year: vehicles.year,
        type: vehicles.type,
        age: sql<number>`${currentYear} - ${vehicles.year}`
      })
      .from(vehicles);

    // Group by age ranges for chart
    const ageGroups = result.reduce((acc, vehicle) => {
      const ageGroup = vehicle.age <= 2 ? 'New (0-2 years)' :
        vehicle.age <= 5 ? 'Recent (3-5 years)' :
          vehicle.age <= 10 ? 'Mature (6-10 years)' :
            'Older (10+ years)';

      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {});

    return {
      chartData: Object.entries(ageGroups).map(([ageGroup, count]) => ({
        name: ageGroup,
        value: count,
        fill: '#8b5cf6'
      })),
      details: result.map(vehicle => ({
        ...vehicle,
        ageGroup: vehicle.age <= 2 ? 'New' :
          vehicle.age <= 5 ? 'Recent' :
            vehicle.age <= 10 ? 'Mature' : 'Older'
      })),
      averageAge: result.reduce((sum, v) => sum + v.age, 0) / result.length
    };
  }

  async getFuelDistribution() {
    const result = await this.db
      .select({
        fuelType: vehicles.fuelType,
        count: sql<number>`count(*)`
      })
      .from(vehicles)
      .groupBy(vehicles.fuelType)
      .orderBy(desc(sql<number>`count(*)`));

    return result.map(item => ({
      name: item.fuelType?.charAt(0).toUpperCase() + item.fuelType?.slice(1) || 'Unknown',
      value: item.count,
      fuelType: item.fuelType,
      color: item.fuelType === 'diesel' ? '#ef4444' :
        item.fuelType === 'gasoline' ? '#f59e0b' :
          item.fuelType === 'electric' ? '#22c55e' :
            item.fuelType === 'hybrid' ? '#8b5cf6' : '#6b7280'
    }));
  }

  async getBrandAnalysis() {
    const result = await this.db
      .select({
        brand: vehicles.brand,
        count: sql<number>`count(*)`
      })
      .from(vehicles)
      .groupBy(vehicles.brand)
      .orderBy(desc(sql<number>`count(*)`));

    const brandColors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4'];

    return result.map((item, index) => ({
      name: item.brand,
      value: item.count,
      fill: brandColors[index % brandColors.length]
    }));
  }

  async getTotalFleetValue() {
    const [result] = await this.db
      .select({
        totalValue: sql<number>`SUM(CAST(${vehicles.purchasePrice} AS DECIMAL))`
      })
      .from(vehicles)
      .where(sql`${vehicles.purchasePrice} IS NOT NULL AND ${vehicles.purchasePrice} != ''`);

    return result?.totalValue || 0;
  }

  async getAverageAge() {
    const currentYear = new Date().getFullYear();

    const [result] = await this.db
      .select({
        averageAge: sql<number>`AVG(${currentYear} - ${vehicles.year})`
      })
      .from(vehicles);

    return Math.round(result?.averageAge || 0);
  }

  async getUtilizationAnalytics() {
    // Get vehicles with their operation counts and recent activity
    const result = await this.db
      .select({
        vehicleId: vehicles.id,
        vehicleName: vehicles.name,
        vehicleType: vehicles.type,
        status: vehicles.status,
        operationCount: sql<number>`COUNT(${operations.id})`,
        lastOperationDate: sql<string>`MAX(${operations.date})`
      })
      .from(vehicles)
      .leftJoin(operations, eq(vehicles.id, operations.vehicleId))
      .groupBy(vehicles.id, vehicles.name, vehicles.type, vehicles.status);

    const today = new Date();
    return result.map(vehicle => {
      const lastOpDate = vehicle.lastOperationDate ? new Date(vehicle.lastOperationDate) : null;
      const daysSinceLastOp = lastOpDate ? Math.floor((today.getTime() - lastOpDate.getTime()) / (1000 * 60 * 60 * 24)) : null;

      let utilizationScore = 0;
      if (vehicle.operationCount > 0) {
        utilizationScore = Math.min(100, (vehicle.operationCount * 10) + (daysSinceLastOp ? Math.max(0, 50 - daysSinceLastOp) : 0));
      }

      return {
        vehicleId: vehicle.vehicleId,
        name: vehicle.vehicleName,
        type: vehicle.vehicleType.charAt(0).toUpperCase() + vehicle.vehicleType.slice(1),
        status: vehicle.status,
        operationCount: vehicle.operationCount,
        lastOperationDate: vehicle.lastOperationDate,
        daysSinceLastOperation: daysSinceLastOp,
        utilizationScore: Math.round(utilizationScore),
        utilizationLevel: utilizationScore >= 80 ? 'High' :
          utilizationScore >= 50 ? 'Medium' :
            utilizationScore >= 20 ? 'Low' : 'Very Low'
      };
    });
  }

  async getTotalFleetMileage() {
    const [result] = await this.db
      .select({
        totalMileage: sql<number>`COALESCE(SUM(CAST(${vehicles.currentMileage} AS NUMERIC) - CAST(${vehicles.initialMileage} AS NUMERIC)), 0)`,
        vehicleCount: count()
      })
      .from(vehicles)
      .where(eq(vehicles.status, 'active'));

    return {
      totalMileage: Number(result.totalMileage) || 0,
      vehicleCount: Number(result.vehicleCount) || 0
    };
  }

  async getMonthlyFleetMileage() {
    const result = await this.db
      .select({
        month: sql<string>`TO_CHAR(${operations.date}, 'YYYY-MM')`,
        monthName: sql<string>`TO_CHAR(${operations.date}, 'Mon')`,
        totalMileage: sql<number>`COALESCE(SUM(CAST(${operations.endMileage} AS NUMERIC) - CAST(${operations.startMileage} AS NUMERIC)), 0)`,
        operationCount: sql<number>`COUNT(*)`
      })
      .from(operations)
      .where(
        and(
          eq(operations.status, 'completed'),
          sql`${operations.endMileage} IS NOT NULL`,
          sql`${operations.startMileage} IS NOT NULL`
        )
      )
      .groupBy(sql`TO_CHAR(${operations.date}, 'YYYY-MM')`, sql`TO_CHAR(${operations.date}, 'Mon')`)
      .orderBy(sql`TO_CHAR(${operations.date}, 'YYYY-MM') DESC`)
      .limit(12);

    return result.map(item => ({
      month: item.monthName,
      totalMileage: Number(item.totalMileage) || 0,
      operationCount: Number(item.operationCount) || 0
    })).reverse();
  }

  async getVehicleAnalytics(vehicleId) {
    const totalOperationsData = await this.getTotalOperationCount(vehicleId);
    const completedOperationsData = await this.getCompletedOperationCount(vehicleId);
    const totalHoursData = await this.getTotalHours(vehicleId);
    const totalMileageData = await this.getTotalMileage(vehicleId);
    const fuelData = await this.getFuelConsumption(vehicleId);
    const maintenanceData = await this.getMaintenanceCount(vehicleId);

    // Get recent records using direct queries
    const recentRefuels = await this.getRecentRefuels(vehicleId);
    const recentMaintenance = await this.getRecentMaintenance(vehicleId);
    const recentAlerts = await this.getRecentAlerts(vehicleId);
    const recentOperations = await this.getRecentOperations(vehicleId);

    // Calculate efficiency
    const efficiency = totalOperationsData.count > 0
      ? (completedOperationsData.count / totalOperationsData.count) * 100
      : 0;

    // Calculate derived analytics
    const avgHoursPerOperation = completedOperationsData.count > 0
      ? Math.round((totalHoursData.totalHours / completedOperationsData.count) * 10) / 10
      : 0;

    const avgFuelCostPerRefuel = fuelData.refuelCount > 0
      ? fuelData.totalCost / fuelData.refuelCount
      : 0;

    return {
      // Main metrics
      totalOperations: totalOperationsData.count || 0,
      totalOperationsCompleted: completedOperationsData.count || 0,
      totalHours: totalHoursData.totalHours || 0,
      totalMileage: totalMileageData.totalMileage || 0,
      totalFuelCost: fuelData.totalCost || 0,
      totalFuelLiters: fuelData.totalLiters || 0,
      totalRefuels: fuelData.refuelCount || 0,
      totalMaintenance: maintenanceData.count || 0,
      efficiency: Math.round(efficiency * 100) / 100,

      // Derived analytics
      avgHoursPerOperation,
      avgFuelCostPerRefuel,

      // Recent records (3 most recent)
      recentRefuels,
      recentMaintenance,
      recentAlerts,
      recentOperations,
    };
  }

  async getTotalOperationCount(vehicleId) {
    const [result] = await this.db
      .select({ count: count() })
      .from(operations)
      .where(eq(operations.vehicleId, vehicleId));
    return result;
  }

  async getCompletedOperationCount(vehicleId) {
    const [result] = await this.db
      .select({ count: count() })
      .from(operations)
      .where(and(
        eq(operations.vehicleId, vehicleId),
        eq(operations.status, 'completed')
      ));
    return result;
  }

  async getTotalHours(vehicleId) {
    const [result] = await this.db
      .select({
        totalHours: sql<number>`COALESCE(SUM(CAST(${operations.endHours} AS NUMERIC) - CAST(${operations.startHours} AS NUMERIC)), 0)`
      })
      .from(operations)
      .where(and(
        eq(operations.vehicleId, vehicleId),
        eq(operations.status, 'completed'),
        sql`${operations.endHours} IS NOT NULL`,
        sql`${operations.startHours} IS NOT NULL`
      ));
    return result;
  }

  async getTotalMileage(vehicleId) {
    const [result] = await this.db
      .select({
        totalMileage: sql<number>`COALESCE(SUM(CAST(${operations.endMileage} AS NUMERIC) - CAST(${operations.startMileage} AS NUMERIC)), 0)`
      })
      .from(operations)
      .where(and(
        eq(operations.vehicleId, vehicleId),
        eq(operations.status, 'completed'),
        sql`${operations.endMileage} IS NOT NULL`,
        sql`${operations.startMileage} IS NOT NULL`
      ));
    return result;
  }

  async getFuelConsumption(vehicleId) {
    const [result] = await this.db
      .select({
        totalCost: sql<number>`COALESCE(SUM(CAST(${refuels.totalCost} AS NUMERIC)), 0)`,
        totalLiters: sql<number>`COALESCE(SUM(CAST(${refuels.liters} AS NUMERIC)), 0)`,
        refuelCount: count()
      })
      .from(refuels)
      .where(eq(refuels.vehicleId, vehicleId));
    return result;
  }

  async getMaintenanceCount(vehicleId) {
    const [result] = await this.db
      .select({ count: count() })
      .from(maintenance)
      .where(eq(maintenance.vehicleId, vehicleId));
    return result;
  }

  async getRecentRefuels(vehicleId) {
    return await this.db
      .select(this.getRefuel())
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .leftJoin(operators, eq(refuels.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(refuels.vehicleId, vehicleId))
      .orderBy(desc(refuels.datetime))
      .limit(3);
  }

  async getRecentMaintenance(vehicleId) {
    return await this.db
      .select(this.getMaintenance())
      .from(maintenance)
      .leftJoin(vehicles, eq(maintenance.vehicleId, vehicles.id))
      .where(eq(maintenance.vehicleId, vehicleId))
      .orderBy(desc(maintenance.createdAt))
      .limit(3);
  }

  async getRecentAlerts(vehicleId) {
    return await this.db
      .select(this.getAlert())
      .from(alerts)
      .leftJoin(vehicles, eq(alerts.vehicleId, vehicles.id))
      .leftJoin(operators, eq(alerts.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(alerts.vehicleId, vehicleId))
      .orderBy(desc(alerts.createdAt))
      .limit(3);
  }

  async getRecentOperations(vehicleId) {
    return await this.db
      .select(this.getOperation())
      .from(operations)
      .leftJoin(vehicles, eq(operations.vehicleId, vehicles.id))
      .leftJoin(fields, eq(operations.fieldId, fields.id))
      .leftJoin(operators, eq(operations.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(operations.vehicleId, vehicleId))
      .orderBy(desc(operations.date), desc(operations.startTime))
      .limit(3);
  }

  async getVehiclesLocations() {
    // Only get vehicles that have trackers
    const vehiclesWithTrackers = await this.db
      .select({
        id: vehicles.id,
        name: vehicles.name,
        brand: vehicles.brand,
        model: vehicles.model,
        type: vehicles.type,
        status: vehicles.status,
        licensePlate: vehicles.licensePlate,
        image: vehicles.image,
        trackerId: trackers.id,
        trackerDeviceId: trackers.deviceId,
        trackerIsOnline: trackers.isOnline,
        trackerLastSeen: trackers.lastSeen,
        trackerSource: trackers.source,
      })
      .from(vehicles)
      .innerJoin(trackers, eq(vehicles.id, trackers.vehicleId)) // Use innerJoin to only get vehicles with trackers
      .orderBy(desc(vehicles.createdAt));

    // Then get latest location for each tracker and filter vehicles with location data
    const result = [];
    for (const vehicle of vehiclesWithTrackers) {
      const [location] = await this.db
        .select()
        .from(trackerHistory)
        .where(eq(trackerHistory.trackerId, vehicle.trackerId))
        .orderBy(desc(trackerHistory.timestamp))
        .limit(1);

      // Only include vehicles that have location data
      if (location && location.location) {
        result.push({
          id: vehicle.id,
          name: vehicle.name,
          brand: vehicle.brand,
          model: vehicle.model,
          type: vehicle.type,
          status: vehicle.status,
          licensePlate: vehicle.licensePlate,
          image: vehicle.image,
          tracker: {
            id: vehicle.trackerId,
            deviceId: vehicle.trackerDeviceId,
            isOnline: vehicle.trackerIsOnline,
            lastSeen: vehicle.trackerLastSeen,
            source: vehicle.trackerSource,
            location: location.location,
            altitude: location.altitude,
            speed: location.speed,
            batteryLevel: location.batteryLevel,
            isMoving: location.isMoving,
            timestamp: location.timestamp,
          }
        });
      }
    }

    return result;
  }

}