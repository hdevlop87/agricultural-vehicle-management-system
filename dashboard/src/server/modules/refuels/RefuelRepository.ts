import { DB } from '@/server/database/db';
import { refuels, vehicles, operators, operations, users } from '@/server/database/schema';
import { Repository } from '@/server/shared/decorators';
import { count, eq, desc, sql, and, gte, lte, isNotNull, avg, sum, max, min } from 'drizzle-orm';

@Repository()
export class RefuelRepository {

  declare db: DB;

  private getRefuel() {
    return {
      id: refuels.id,
      vehicleId: refuels.vehicleId,
      operatorId: refuels.operatorId,
      datetime: refuels.datetime,
      voucherNumber: refuels.voucherNumber,
      liters: refuels.liters,
      costPerLiter: refuels.costPerLiter,
      totalCost: refuels.totalCost,
      hoursAtRefuel: refuels.hoursAtRefuel,
      mileageAtRefuel: refuels.mileageAtRefuel,
      fuelLevelAfter: refuels.fuelLevelAfter,
      attendant: refuels.attendant,
      notes: refuels.notes,
      createdAt: refuels.createdAt,
      updatedAt: refuels.updatedAt,
      vehicle: {
        id: vehicles.id,
        name: vehicles.name,
        brand: vehicles.brand,
        model: vehicles.model,
        image: vehicles.image,
        type: vehicles.type,
        status: vehicles.status,
        fuelType: vehicles.fuelType,
        tankCapacity: vehicles.tankCapacity,
      },
      operator: {
        id: operators.id,
        name: users.name,
        image: users.image,
        cin: operators.cin,
        phone: operators.phone,
        status: operators.status,
      }
    };
  }

  async getCount() {
    const [refuelsCount] = await this.db
      .select({ count: count() })
      .from(refuels);
    return refuelsCount;
  }

  async getAll() {
    const refuelsList = await this.db
      .select(this.getRefuel())
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .leftJoin(operators, eq(refuels.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .orderBy(desc(refuels.datetime));

    // Add analytics to each refuel
    const refuelsWithAnalytics = await Promise.all(
      refuelsList.map(async (refuel) => {
        const analytics = await this.getRefuelAnalytics(refuel.id);
        return {
          ...refuel,
          analytics
        };
      })
    );

    return refuelsWithAnalytics;
  }

  async getById(id: string) {
    const [existingRecord] = await this.db
      .select(this.getRefuel())
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .leftJoin(operators, eq(refuels.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(refuels.id, id))
      .limit(1);

    if (!existingRecord) {
      return null;
    }

    const analytics = await this.getRefuelAnalytics(id);

    return {
      ...existingRecord,
      analytics
    };
  }

  async getByVehicleId(vehicleId: string) {
    return await this.db
      .select(this.getRefuel())
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .leftJoin(operators, eq(refuels.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(refuels.vehicleId, vehicleId))
      .orderBy(desc(refuels.datetime));
  }

  async getByOperatorId(operatorId: string) {
    return await this.db
      .select(this.getRefuel())
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .leftJoin(operators, eq(refuels.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(refuels.operatorId, operatorId))
      .orderBy(desc(refuels.datetime));
  }

  async getByVoucherNumber(voucherNumber: string) {
    const [existingRecord] = await this.db
      .select(this.getRefuel())
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .leftJoin(operators, eq(refuels.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(eq(refuels.voucherNumber, voucherNumber))
      .limit(1);
    return existingRecord;
  }

  async getByDate(date: string) {
    const startOfDay = `${date} 00:00:00`;
    const endOfDay = `${date} 23:59:59`;

    return await this.db
      .select(this.getRefuel())
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .leftJoin(operators, eq(refuels.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .where(
        and(
          gte(refuels.datetime, startOfDay),
          lte(refuels.datetime, endOfDay)
        )
      )
      .orderBy(desc(refuels.datetime));
  }

  async getRecentRecords(limit: number = 20) {
    return await this.db
      .select(this.getRefuel())
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .leftJoin(operators, eq(refuels.operatorId, operators.id))
      .leftJoin(users, eq(operators.userId, users.id))
      .orderBy(desc(refuels.datetime))
      .limit(limit);
  }

  async getFuelTotals() {
    const [totals] = await this.db
      .select({
        totalLiters: sum(refuels.liters),
        totalCost: sum(refuels.totalCost),
      })
      .from(refuels)
      .where(
        and(
          isNotNull(refuels.liters),
          isNotNull(refuels.totalCost)
        )
      );

    return {
      totalLiters: Number(totals.totalLiters) || 0,
      totalCost: Number(totals.totalCost) || 0,
    };
  }

  async create(data: any) {
    const [newRecord] = await this.db
      .insert(refuels)
      .values(data)
      .returning();
    return newRecord;
  }

  async update(id: string, data: any) {
    const [updatedRecord] = await this.db
      .update(refuels)
      .set(data)
      .where(eq(refuels.id, id))
      .returning();
    return updatedRecord;
  }

  async delete(id: string) {
    const [deletedRecord] = await this.db
      .delete(refuels)
      .where(eq(refuels.id, id))
      .returning();
    return deletedRecord;
  }

  async deleteAll() {
    const deletedRefuels = await this.db
      .delete(refuels)
      .returning();
    return deletedRefuels;
  }

  // ===== ANALYTICS METHODS =====

  async getRefuelAnalytics(refuelId: string) {
    // Get refuel details for context
    const refuelData = await this.db
      .select({
        id: refuels.id,
        vehicleId: refuels.vehicleId,
        operatorId: refuels.operatorId,
        liters: refuels.liters,
        totalCost: refuels.totalCost,
        costPerLiter: refuels.costPerLiter,
        hoursAtRefuel: refuels.hoursAtRefuel,
        mileageAtRefuel: refuels.mileageAtRefuel,
        fuelLevelAfter: refuels.fuelLevelAfter,
        datetime: refuels.datetime,
      })
      .from(refuels)
      .where(eq(refuels.id, refuelId))
      .limit(1);

    if (!refuelData[0]) {
      return {};
    }

    const refuel = refuelData[0];

    // Get comparative metrics
    const vehicleRefuelStats = await this.getVehicleRefuelStats(refuel.vehicleId);
    const operatorRefuelStats = await this.getOperatorRefuelStats(refuel.operatorId);
    const efficiencyMetrics = await this.getRefuelEfficiencyMetrics(refuel);
    const costAnalysis = await this.getRefuelCostAnalysis(refuel);

    return {
      // Basic refuel metrics
      fuelQuantity: parseFloat(refuel.liters || '0'),
      totalCost: parseFloat(refuel.totalCost || '0'),
      costPerLiter: parseFloat(refuel.costPerLiter || '0'),
      fuelLevelAfter: parseFloat(refuel.fuelLevelAfter || '0'),

      // Efficiency metrics
      efficiency: efficiencyMetrics.efficiency || 0,
      efficiencyRating: efficiencyMetrics.rating || 'Average',

      // Cost analysis
      costEfficiency: costAnalysis.costEfficiency || 0,
      costRating: costAnalysis.rating || 'Average',

      // Vehicle comparison
      vehicleAvgConsumption: Math.round((Number(vehicleRefuelStats.avgLitersPerRefuel) || 0) * 100) / 100,
      vehicleAvgCost: Math.round((Number(vehicleRefuelStats.avgCostPerRefuel) || 0) * 100) / 100,

      // Operator comparison
      operatorAvgConsumption: Math.round((Number(operatorRefuelStats.avgLitersPerRefuel) || 0) * 100) / 100,
      operatorRefuelCount: operatorRefuelStats.totalRefuels || 0,

      // Performance indicators
      fuelEfficiencyScore: Math.round(((efficiencyMetrics.efficiency || 0) + (costAnalysis.costEfficiency || 0)) / 2),
    };
  }

  async getVehicleRefuelStats(vehicleId: string) {
    const [stats] = await this.db
      .select({
        totalRefuels: count(),
        avgLitersPerRefuel: avg(refuels.liters),
        avgCostPerRefuel: avg(refuels.totalCost),
        avgCostPerLiter: avg(refuels.costPerLiter),
        totalLiters: sum(refuels.liters),
        totalCost: sum(refuels.totalCost),
      })
      .from(refuels)
      .where(and(
        eq(refuels.vehicleId, vehicleId),
        isNotNull(refuels.liters)
      ));
    return stats;
  }

  async getOperatorRefuelStats(operatorId: string) {
    const [stats] = await this.db
      .select({
        totalRefuels: count(),
        avgLitersPerRefuel: avg(refuels.liters),
        avgCostPerRefuel: avg(refuels.totalCost),
        totalLiters: sum(refuels.liters),
        totalCost: sum(refuels.totalCost),
      })
      .from(refuels)
      .where(and(
        eq(refuels.operatorId, operatorId),
        isNotNull(refuels.liters)
      ));
    return stats;
  }

  async getRefuelEfficiencyMetrics(refuel: any) {
    if (!refuel.fuelLevelAfter || !refuel.liters) {
      return { efficiency: 0, rating: 'Unknown' };
    }

    // Calculate efficiency based on fuel level vs liters added
    const efficiency = (parseFloat(refuel.fuelLevelAfter) / parseFloat(refuel.liters)) * 10;

    let rating = 'Poor';
    if (efficiency >= 8) rating = 'Excellent';
    else if (efficiency >= 6) rating = 'Good';
    else if (efficiency >= 4) rating = 'Average';

    return {
      efficiency: Math.round(efficiency * 100) / 100,
      rating
    };
  }

  async getRefuelCostAnalysis(refuel: any) {
    if (!refuel.costPerLiter) {
      return { costEfficiency: 0, rating: 'Unknown' };
    }

    // Get average cost per liter for comparison
    const [avgCost] = await this.db
      .select({
        avgCostPerLiter: avg(refuels.costPerLiter)
      })
      .from(refuels)
      .where(isNotNull(refuels.costPerLiter));

    const currentCost = parseFloat(refuel.costPerLiter);
    const averageCost = parseFloat(avgCost.avgCostPerLiter || '0');

    let costEfficiency = 50; // Default middle value
    let rating = 'Average';

    if (averageCost > 0) {
      // Higher efficiency means lower relative cost
      costEfficiency = Math.max(0, Math.min(100, 100 - ((currentCost - averageCost) / averageCost) * 100));

      if (costEfficiency >= 80) rating = 'Excellent';
      else if (costEfficiency >= 60) rating = 'Good';
      else if (costEfficiency < 40) rating = 'Poor';
    }

    return {
      costEfficiency: Math.round(costEfficiency),
      rating
    };
  }

  async getFuelConsumptionAnalytics() {
    const consumptionByVehicle = await this.db
      .select({
        vehicleId: refuels.vehicleId,
        vehicleName: vehicles.name,
        vehicleType: vehicles.type,
        totalLiters: sum(refuels.liters),
        totalCost: sum(refuels.totalCost),
        refuelCount: count(),
        avgLitersPerRefuel: avg(refuels.liters),
        avgCostPerLiter: avg(refuels.costPerLiter),
      })
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .where(isNotNull(refuels.liters))
      .groupBy(refuels.vehicleId, vehicles.name, vehicles.type)
      .orderBy(desc(sum(refuels.liters)));

    const monthlyTrends = await this.db
      .select({
        month: sql<string>`to_char(${refuels.datetime}, 'Mon')`,
        totalLiters: sum(refuels.liters),
        totalCost: sum(refuels.totalCost),
        refuelCount: count(),
        avgCostPerLiter: avg(refuels.costPerLiter),
      })
      .from(refuels)
      .where(isNotNull(refuels.liters))
      .groupBy(sql`to_char(${refuels.datetime}, 'Mon')`)
      .orderBy(sql`to_char(${refuels.datetime}, 'Mon')`);

    return {
      consumptionByVehicle,
      monthlyTrends,
    };
  }

  async getFuelEfficiencyReport() {
    const efficiencyData = await this.db
      .select({
        vehicleId: refuels.vehicleId,
        vehicleName: vehicles.name,
        vehicleType: vehicles.type,
        totalFuelUsed: sum(refuels.liters),
        minEngineHours: min(refuels.hoursAtRefuel),
        maxEngineHours: max(refuels.hoursAtRefuel),
        totalEngineHours: sql<number>`(max(${refuels.hoursAtRefuel}) - min(${refuels.hoursAtRefuel}))`,
        refuelCount: count(),
      })
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .where(
        and(
          isNotNull(refuels.liters),
          isNotNull(refuels.hoursAtRefuel)
        )
      )
      .groupBy(refuels.vehicleId, vehicles.name, vehicles.type)
      .having(sql`count(*) >= 2`)
      .orderBy(vehicles.name);

    return efficiencyData.map((item: any) => ({
      ...item,
      fuelEfficiencyLitersPerHour: item.totalEngineHours > 0
        ? Math.round((item.totalFuelUsed / item.totalEngineHours) * 100) / 100
        : 0,
      avgFuelPerRefuel: item.refuelCount > 0
        ? Math.round((item.totalFuelUsed / item.refuelCount) * 100) / 100
        : 0,
    }));
  }

  async getFuelCostAnalysis() {
    const result = await this.db
      .select({
        vehicleType: vehicles.type,
        totalCost: sum(refuels.totalCost),
        totalLiters: sum(refuels.liters),
        avgCostPerLiter: avg(refuels.costPerLiter),
        vehicleCount: sql<number>`count(distinct ${refuels.vehicleId})`,
      })
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .where(isNotNull(refuels.totalCost))
      .groupBy(vehicles.type)
      .orderBy(desc(sum(refuels.totalCost)));

    return result.map(row => ({
      ...row,
      totalCost: Number(row.totalCost),
      totalLiters: Number(row.totalLiters),
      avgCostPerLiter: Number(row.avgCostPerLiter),
      vehicleCount: Number(row.vehicleCount)
    }));
  }

  async getFuelSummary() {
    const [summary] = await this.db
      .select({
        totalRecords: count(),
        totalLiters: sum(refuels.liters),
        totalCost: sum(refuels.totalCost),
        avgCostPerLiter: avg(refuels.costPerLiter),
        uniqueVehicles: sql<number>`count(distinct ${refuels.vehicleId})`,
        uniqueOperators: sql<number>`count(distinct ${refuels.operatorId})`,
      })
      .from(refuels);

    const today = new Date().toISOString().split('T')[0];
    const [todaySummary] = await this.db
      .select({
        todayRecords: count(),
        todayLiters: sum(refuels.liters),
        todayCost: sum(refuels.totalCost),
      })
      .from(refuels)
      .where(
        sql`date(${refuels.datetime}) = ${today}`
      );

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [monthSummary] = await this.db
      .select({
        monthRecords: count(),
        monthLiters: sum(refuels.liters),
        monthCost: sum(refuels.totalCost),
      })
      .from(refuels)
      .where(
        gte(refuels.datetime, monthStart.toISOString())
      );

    return {
      overall: summary,
      today: todaySummary,
      thisMonth: monthSummary,
    };
  }

  async getVehicleFuelEfficiency(vehicleId: string) {
    const records = await this.db
      .select({
        datetime: refuels.datetime,
        liters: refuels.liters,
        hoursAtRefuel: refuels.hoursAtRefuel,
        mileageAtRefuel: refuels.mileageAtRefuel,
      })
      .from(refuels)
      .where(
        and(
          eq(refuels.vehicleId, vehicleId),
          isNotNull(refuels.liters)
        )
      )
      .orderBy(refuels.datetime);

    const efficiencyRecords = [];
    for (let i = 1; i < records.length; i++) {
      const prev = records[i - 1];
      const curr = records[i];

      if (prev.hoursAtRefuel && curr.hoursAtRefuel) {
        const hoursDiff = parseFloat(curr.hoursAtRefuel) - parseFloat(prev.hoursAtRefuel);
        const fuelUsed = parseFloat(curr.liters);

        if (hoursDiff > 0) {
          efficiencyRecords.push({
            fromDate: prev.datetime,
            toDate: curr.datetime,
            hoursOperated: hoursDiff,
            fuelUsed: fuelUsed,
            fuelEfficiency: Math.round((fuelUsed / hoursDiff) * 100) / 100,
          });
        }
      }
    }

    return efficiencyRecords;
  }

  async getVehicleFuelCosts(vehicleId: string) {
    return await this.db
      .select({
        datetime: refuels.datetime,
        liters: refuels.liters,
        costPerLiter: refuels.costPerLiter,
        totalCost: refuels.totalCost,
        voucherNumber: refuels.voucherNumber,
        attendant: refuels.attendant,
      })
      .from(refuels)
      .where(eq(refuels.vehicleId, vehicleId))
      .orderBy(desc(refuels.datetime));
  }

  async getMonthlyFuelTrends() {
    const trends = await this.db
      .select({
        month: sql<string>`to_char(${refuels.datetime}, 'Mon')`, // display name
        monthNumber: sql<number>`extract(month from ${refuels.datetime})`, // numeric month
        totalLiters: sum(refuels.liters),
        totalCost: sum(refuels.totalCost),
        avgCostPerLiter: avg(refuels.costPerLiter),
        refuelCount: count(),
        uniqueVehicles: sql<number>`count(distinct ${refuels.vehicleId})`,
      })
      .from(refuels)
      .where(isNotNull(refuels.liters))
      .groupBy(
        sql`to_char(${refuels.datetime}, 'Mon')`,
        sql`extract(month from ${refuels.datetime})`
      )
      .orderBy(sql`extract(month from ${refuels.datetime})`) // correct order
      .limit(12);

    return trends;
  }

  async calculateFuelEfficiency(vehicleId: string, startDate: string, endDate: string) {
    const records = await this.db
      .select({
        datetime: refuels.datetime,
        liters: refuels.liters,
        hoursAtRefuel: refuels.hoursAtRefuel,
        mileageAtRefuel: refuels.mileageAtRefuel,
      })
      .from(refuels)
      .where(
        and(
          eq(refuels.vehicleId, vehicleId),
          gte(refuels.datetime, startDate),
          lte(refuels.datetime, endDate),
          isNotNull(refuels.liters)
        )
      )
      .orderBy(refuels.datetime);

    if (records.length < 2) {
      return {
        totalFuelUsed: 0,
        totalEngineHours: 0,
        fuelEfficiency: 0,
        recordCount: records.length,
      };
    }

    const totalFuel = records.reduce((sum, record) => sum + parseFloat(record.liters), 0);
    const firstRecord = records[0];
    const lastRecord = records[records.length - 1];

    const totalEngineHours = lastRecord.hoursAtRefuel && firstRecord.hoursAtRefuel
      ? parseFloat(lastRecord.hoursAtRefuel) - parseFloat(firstRecord.hoursAtRefuel)
      : 0;

    return {
      totalFuelUsed: Math.round(totalFuel * 100) / 100,
      totalEngineHours: Math.round(totalEngineHours * 100) / 100,
      fuelEfficiency: totalEngineHours > 0
        ? Math.round((totalFuel / totalEngineHours) * 100) / 100
        : 0,
      recordCount: records.length,
    };
  }

  async getFuelConsumptionByOperationType() {
    const result = await this.db
      .select({
        operationType: operations.operationType,
        totalFuel: sql`SUM(${refuels.liters})`.as('totalFuel'),
        operationCount: count(operations.id).as('operationCount'),
        avgFuelPerOperation: sql`COALESCE(SUM(${refuels.liters}) / NULLIF(COUNT(${operations.id}), 0), 0)`.as('avgFuelPerOperation'),
      })
      .from(operations)
      .leftJoin(refuels, and(
        eq(operations.vehicleId, refuels.vehicleId),
        sql`DATE(${operations.date}) = DATE(${refuels.datetime})`
      ))
      .groupBy(operations.operationType)
      .orderBy(desc(sql`SUM(${refuels.liters})`));

    return {
      chartType: 'doughnut',
      data: result,
      labels: result.map(r => r.operationType),
      datasets: [
        {
          data: result.map((r: any) => parseFloat(r.totalFuel || '0')),
          backgroundColor: [
            '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
            '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6'
          ],
        }
      ]
    };
  }

  async predictFuelNeeds(vehicleId: string, days: number) {
    const historical = await this.db
      .select({
        avgDailyFuel: avg(refuels.liters),
        refuelFrequency: sql<number>`
          count(*) / NULLIF(
            EXTRACT(days FROM (max(${refuels.datetime}) - min(${refuels.datetime}))), 0
          )
        `,
      })
      .from(refuels)
      .where(
        and(
          eq(refuels.vehicleId, vehicleId),
          gte(refuels.datetime, sql`current_date - interval '90 days'`)
        )
      );

    const prediction: any = historical[0];

    return {
      predictedFuelNeeded: prediction.avgDailyFuel * days,
      estimatedRefuels: Math.ceil(prediction.refuelFrequency * days),
      basedOnDays: 90,
      predictionPeriod: days,
    };
  }

  async getFuelConsumptionByPeriod(startDate: string, endDate: string) {
    return await this.db
      .select({
        totalLiters: sum(refuels.liters),
        refuelCount: count(),
        uniqueVehicles: sql<number>`count(distinct ${refuels.vehicleId})`,
        avgLitersPerRefuel: avg(refuels.liters),
      })
      .from(refuels)
      .where(
        and(
          gte(refuels.datetime, startDate),
          lte(refuels.datetime, endDate)
        )
      );
  }

  async getFuelCostsByPeriod(startDate: string, endDate: string) {
    return await this.db
      .select({
        totalCost: sum(refuels.totalCost),
        avgCostPerLiter: avg(refuels.costPerLiter),
        minCostPerLiter: min(refuels.costPerLiter),
        maxCostPerLiter: max(refuels.costPerLiter),
      })
      .from(refuels)
      .where(
        and(
          gte(refuels.datetime, startDate),
          lte(refuels.datetime, endDate),
          isNotNull(refuels.totalCost)
        )
      );
  }

  async getFuelEfficiencyByPeriod(startDate: string, endDate: string) {
    return await this.db
      .select({
        vehicleId: refuels.vehicleId,
        vehicleName: vehicles.name,
        totalFuel: sum(refuels.liters),
        totalHours: sql<number>`
          max(${refuels.hoursAtRefuel}) - min(${refuels.hoursAtRefuel})
        `,
      })
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .where(
        and(
          gte(refuels.datetime, startDate),
          lte(refuels.datetime, endDate),
          isNotNull(refuels.hoursAtRefuel)
        )
      )
      .groupBy(refuels.vehicleId, vehicles.name)
      .having(sql`count(*) >= 2`);
  }

  async getFuelTrendsByPeriod(startDate: string, endDate: string) {
    return await this.db
      .select({
        date: sql<string>`date(${refuels.datetime})`,
        dailyLiters: sum(refuels.liters),
        dailyCost: sum(refuels.totalCost),
        refuelCount: count(),
      })
      .from(refuels)
      .where(
        and(
          gte(refuels.datetime, startDate),
          lte(refuels.datetime, endDate)
        )
      )
      .groupBy(sql`date(${refuels.datetime})`)
      .orderBy(sql`date(${refuels.datetime})`);
  }
}