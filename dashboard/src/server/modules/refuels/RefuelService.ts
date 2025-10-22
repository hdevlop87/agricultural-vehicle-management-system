import { Injectable } from 'najm-api';
import { RefuelRepository } from './RefuelRepository';
import { RefuelValidator } from './RefuelValidator';
import { VehicleValidator } from '../vehicles/VehicleValidator';
import { OperatorValidator } from '../operators/OperatorValidator';
import { nanoid } from 'nanoid';

@Injectable()
export class RefuelService {
  constructor(
    private refuelRepository: RefuelRepository,
    private refuelValidator: RefuelValidator,
    private vehicleValidator: VehicleValidator,
    private operatorValidator: OperatorValidator,
  ) { }

  async getAll() {
    return await this.refuelRepository.getAll();
  }

  async getById(id) {
    await this.refuelValidator.checkFuelRecordExists(id);
    return await this.refuelRepository.getById(id);
  }

  async getByVehicleId(vehicleId) {
    await this.vehicleValidator.checkVehicleExists(vehicleId);
    return await this.refuelRepository.getByVehicleId(vehicleId);
  }

  async getByOperatorId(operatorId) {
    await this.operatorValidator.checkOperatorExists(operatorId);
    return await this.refuelRepository.getByOperatorId(operatorId);
  }

  async getByVoucherNumber(voucherNumber) {
    await this.refuelValidator.checkVoucherNumberExists(voucherNumber);
    return await this.refuelRepository.getByVoucherNumber(voucherNumber);
  }

  async getByDate(date) {
    await this.refuelValidator.validateDate(date);
    return await this.refuelRepository.getByDate(date);
  }

  async getRecentRecords(limit = 20) {
    return await this.refuelRepository.getRecentRecords(limit);
  }

  async getTodayRecords() {
    const today = new Date().toISOString().split('T')[0];
    return await this.refuelRepository.getByDate(today);
  }

  async getCount() {
    return await this.refuelRepository.getCount();
  }

  async create(data) {
    const {
      id,
      vehicleId,
      operatorId,
      datetime,
      voucherNumber,
      liters,
      costPerLiter,
      totalCost,
      hoursAtRefuel,
      mileageAtRefuel,
      fuelLevelAfter,
      attendant,
      notes
    } = data;


    await this.refuelValidator.validateCreateFuelRecord(data);

    await this.vehicleValidator.checkVehicleExists(vehicleId);
    await this.operatorValidator.checkOperatorExists(operatorId);

    if (voucherNumber) {
      await this.refuelValidator.checkVoucherNumberIsUnique(voucherNumber);
    }

    await this.refuelValidator.validateFuelQuantity(liters);

    if (costPerLiter) {
      await this.refuelValidator.validateFuelCost(costPerLiter);
    }

    if (totalCost) {
      await this.refuelValidator.validateTotalCost(totalCost, liters, costPerLiter);
    }

    if (fuelLevelAfter) {
      await this.refuelValidator.validateFuelLevel(fuelLevelAfter);
    }

    if (hoursAtRefuel) {
      await this.refuelValidator.validateEngineHours(hoursAtRefuel);
    }

    if (mileageAtRefuel) {
      await this.refuelValidator.validateMileage(mileageAtRefuel);
    }

    const calculatedTotalCost = totalCost ||
      (costPerLiter ? (parseFloat(costPerLiter) * parseFloat(liters)).toFixed(2) : null);

    const fuelRecordDetails = {
      id: id || nanoid(5),
      vehicleId,
      operatorId,
      datetime,
      voucherNumber,
      liters,
      costPerLiter,
      totalCost: calculatedTotalCost,
      hoursAtRefuel,
      mileageAtRefuel,
      fuelLevelAfter: fuelLevelAfter || '100',
      attendant,
      notes,
    }

    return await this.refuelRepository.create(fuelRecordDetails);

  }

  async update(id, data) {
    await this.refuelValidator.checkFuelRecordExists(id);

    if (data.vehicleId) {
      await this.vehicleValidator.checkVehicleExists(data.vehicleId);
    }

    if (data.operatorId) {
      await this.operatorValidator.checkOperatorExists(data.operatorId);
    }

    if (data.voucherNumber) {
      await this.refuelValidator.checkVoucherNumberIsUnique(data.voucherNumber, id);
    }

    if (data.liters) {
      await this.refuelValidator.validateFuelQuantity(data.liters);
    }

    if (data.costPerLiter) {
      await this.refuelValidator.validateFuelCost(data.costPerLiter);
    }

    if (data.fuelLevelAfter) {
      await this.refuelValidator.validateFuelLevel(data.fuelLevelAfter);
    }

    if (data.liters || data.costPerLiter) {
      const currentRecord = await this.refuelRepository.getById(id);
      const quantity = data.liters || currentRecord.liters;
      const costPerLiter = data.costPerLiter || currentRecord.costPerLiter;

      if (quantity && costPerLiter && !data.totalCost) {
        data.totalCost = (parseFloat(costPerLiter) * parseFloat(quantity)).toFixed(2);
      }
    }

    return await this.refuelRepository.update(id, data);
  }

  async delete(id) {
    await this.refuelValidator.checkFuelRecordExists(id);

    const fuelRecord = await this.refuelRepository.getById(id);
    await this.refuelValidator.checkFuelRecordCanBeDeleted(fuelRecord);

    return await this.refuelRepository.delete(id);
  }

  async deleteAll() {
    return await this.refuelRepository.deleteAll();
  }

  async getFuelConsumptionAnalytics() {
    return await this.refuelRepository.getFuelConsumptionAnalytics();
  }

  async getFuelEfficiencyReport() {
    return await this.refuelRepository.getFuelEfficiencyReport();
  }

  async getFuelCostAnalysis() {
    return await this.refuelRepository.getFuelCostAnalysis();
  }

  async getFuelSummary() {
    return await this.refuelRepository.getFuelSummary();
  }

  async getFuelTotals() {
    return await this.refuelRepository.getFuelTotals();
  }

  async getVehicleFuelEfficiency(vehicleId) {
    await this.vehicleValidator.checkVehicleExists(vehicleId);
    return await this.refuelRepository.getVehicleFuelEfficiency(vehicleId);
  }

  async getVehicleFuelCosts(vehicleId) {
    await this.vehicleValidator.checkVehicleExists(vehicleId);
    return await this.refuelRepository.getVehicleFuelCosts(vehicleId);
  }

  async getMonthlyFuelTrends() {
    return await this.refuelRepository.getMonthlyFuelTrends();
  }

  async calculateFuelEfficiency(vehicleId, startDate, endDate) {
    await this.vehicleValidator.checkVehicleExists(vehicleId);
    await this.refuelValidator.validateDateRange(startDate, endDate);

    return await this.refuelRepository.calculateFuelEfficiency(vehicleId, startDate, endDate);
  }

  async getFuelConsumptionByOperationType() {
    return await this.refuelRepository.getFuelConsumptionByOperationType();
  }

  async predictFuelNeeds(vehicleId, days = 30) {
    await this.vehicleValidator.checkVehicleExists(vehicleId);

    if (days < 1 || days > 365) {
      throw new Error('Prediction period must be between 1 and 365 days');
    }

    return await this.refuelRepository.predictFuelNeeds(vehicleId, days);
  }

  async generateFuelReport(startDate, endDate) {
    await this.refuelValidator.validateDateRange(startDate, endDate);

    const [
      consumption,
      costs,
      efficiency,
      trends
    ] = await Promise.all([
      this.refuelRepository.getFuelConsumptionByPeriod(startDate, endDate),
      this.refuelRepository.getFuelCostsByPeriod(startDate, endDate),
      this.refuelRepository.getFuelEfficiencyByPeriod(startDate, endDate),
      this.refuelRepository.getFuelTrendsByPeriod(startDate, endDate)
    ]);

    return {
      period: { startDate, endDate },
      consumption,
      costs,
      efficiency,
      trends,
      generatedAt: new Date().toISOString()
    };
  }

  async seedDemoRefuels(refuelsData) {
    const createdRefuels = [];
    for (const refuelData of refuelsData) {
      try {
        const refuel = await this.create(refuelData);
        createdRefuels.push(refuel);
      } catch (error) {
        continue;
      }
    }

    return createdRefuels;
  }

}