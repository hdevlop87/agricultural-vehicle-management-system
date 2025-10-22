import { Injectable, t } from 'najm-api';
import { createRefuelSchema } from '@/server/database/schema';
import { parseSchema } from '@/server/shared/utils';
import { RefuelRepository } from './RefuelRepository';

@Injectable()
export class RefuelValidator {
  constructor(
    private refuelRepository: RefuelRepository,
  ) { }

  async validateCreateFuelRecord(data) {
    return parseSchema(createRefuelSchema, data);
  }

  async isFuelRecordExists(id) {
    const existingRecord = await this.refuelRepository.getById(id);
    return !!existingRecord;
  }

  async isVoucherNumberExists(voucherNumber) {
    if (!voucherNumber) return false;
    const existingRecord = await this.refuelRepository.getByVoucherNumber(voucherNumber);
    return !!existingRecord;
  }

  validateDate(date) {
    if (!date) {
      throw new Error(t('refuels.errors.dateRequired'));
    }
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error(t('refuels.errors.invalidDateFormat'));
    }
    
    return true;
  }

  validateDateRange(startDate, endDate) {
    this.validateDate(startDate);
    this.validateDate(endDate);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      throw new Error(t('refuels.errors.endDateAfterStart'));
    }
    
    return true;
  }

  validateRefuelDatetime(datetime) {
    if (!datetime) {
      throw new Error(t('refuels.errors.datetimeRequired'));
    }
    
    const dateObj = new Date(datetime);
    if (isNaN(dateObj.getTime())) {
      throw new Error(t('refuels.errors.invalidDatetimeFormat'));
    }
    
    // Check if refuel is not in the future
    const now = new Date();
    if (dateObj > now) {
      throw new Error(t('refuels.errors.dateInvalid'));
    }
    
    // Check if refuel is not too far in the past (more than 1 year)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (dateObj < oneYearAgo) {
      throw new Error(t('refuels.errors.dateOldLimit'));
    }
    
    return true;
  }

  validateFuelQuantity(liters) {
    if (!liters) {
      throw new Error(t('refuels.errors.quantityRequired'));
    }
    
    const numericQuantity = parseFloat(liters);
    if (isNaN(numericQuantity) || numericQuantity <= 0) {
      throw new Error(t('refuels.errors.invalidQuantity'));
    }
    
    // Reasonable upper limit for fuel quantity (1000 liters per refuel)
    if (numericQuantity > 1000) {
      throw new Error(t('refuels.errors.quantityTooHigh'));
    }
    
    // Minimum practical fuel quantity (1 liter)
    if (numericQuantity < 1) {
      throw new Error(t('refuels.errors.quantityTooLow'));
    }
    
    return true;
  }

  validateFuelCost(costPerLiter) {
    if (!costPerLiter) return true; // Optional field
    
    const numericCost = parseFloat(costPerLiter);
    if (isNaN(numericCost) || numericCost <= 0) {
      throw new Error(t('refuels.errors.invalidCost'));
    }
    
    // Reasonable upper limit for fuel cost per liter (10 currency units)
    if (numericCost > 10) {
      throw new Error(t('refuels.errors.costTooHigh'));
    }
    
    return true;
  }

  validateTotalCost(totalCost, liters, costPerLiter) {
    if (!totalCost) return true; // Can be auto-calculated
    
    const numericTotalCost = parseFloat(totalCost);
    if (isNaN(numericTotalCost) || numericTotalCost < 0) {
      throw new Error(t('refuels.errors.totalCostNegative'));
    }
    
    // If both quantity and cost per liter are provided, verify calculation
    if (liters && costPerLiter) {
      const expectedTotal = parseFloat(liters) * parseFloat(costPerLiter);
      const tolerance = 0.01; // Allow small rounding differences
      
      if (Math.abs(numericTotalCost - expectedTotal) > tolerance) {
        throw new Error(t('refuels.errors.totalCostMismatch'));
      }
    }
    
    return true;
  }

  validateFuelLevel(fuelLevelAfter) {
    if (!fuelLevelAfter) return true; // Optional field
    
    const numericLevel = parseFloat(fuelLevelAfter);
    if (isNaN(numericLevel) || numericLevel < 0 || numericLevel > 100) {
      throw new Error(t('refuels.errors.levelInvalid'));
    }
    
    return true;
  }

  validateEngineHours(engineHours) {
    if (!engineHours) return true; // Optional field
    
    const numericHours = parseFloat(engineHours);
    if (isNaN(numericHours) || numericHours < 0) {
      throw new Error(t('refuels.errors.engineHoursNegative'));
    }
    
    // Reasonable upper limit for engine hours (100,000 hours)
    if (numericHours > 100000) {
      throw new Error(t('refuels.errors.engineHoursTooHigh'));
    }
    
    return true;
  }

  validateMileage(mileage) {
    if (!mileage) return true; // Optional field
    
    const numericMileage = parseFloat(mileage);
    if (isNaN(numericMileage) || numericMileage < 0) {
      throw new Error(t('refuels.errors.mileageNegative'));
    }
    
    return true;
  }

  validateVoucherNumber(voucherNumber) {
    if (!voucherNumber) return true; // Optional field
    
    if (voucherNumber.length > 50) {
      throw new Error(t('refuels.errors.voucherTooLong'));
    }
    
    // Check for valid characters (alphanumeric, hyphens, underscores)
    const voucherRegex = /^[a-zA-Z0-9\-_]+$/;
    if (!voucherRegex.test(voucherNumber)) {
      throw new Error(t('refuels.errors.voucherInvalidChars'));
    }
    
    return true;
  }

  validateAttendantName(attendant) {
    if (!attendant) return true; // Optional field
    
    if (attendant.length > 100) {
      throw new Error(t('refuels.errors.attendantTooLong'));
    }
    
    return true;
  }

  //======================= Existence Checks (throw errors)

  async checkFuelRecordExists(id) {
    const recordExists = await this.isFuelRecordExists(id);
    if (!recordExists) {
      throw new Error(t('refuels.errors.notFound'));
    }
    return true;
  }

  async checkVoucherNumberExists(voucherNumber) {
    const record = await this.refuelRepository.getByVoucherNumber(voucherNumber);
    if (!record) {
      throw new Error(t('refuels.errors.notFound'));
    }
    return record;
  }

  //======================= Uniqueness Checks (throw errors)

  async checkVoucherNumberIsUnique(voucherNumber, excludeId = null) {
    if (!voucherNumber) return; // Optional field
    
    this.validateVoucherNumber(voucherNumber);
    
    const existingRecord = await this.refuelRepository.getByVoucherNumber(voucherNumber);
    if (existingRecord && existingRecord.id !== excludeId) {
      throw new Error(t('refuels.errors.voucherExists'));
    }
  }

  //======================= Business Rules Checks

  checkFuelRecordCanBeDeleted(fuelRecord) {
    // Check if fuel record is recent (within last 7 days)
    const recordDate = new Date(fuelRecord.datetime);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    if (recordDate < sevenDaysAgo) {
      console.warn('Deleting fuel record older than 7 days - consider if this affects historical reporting');
    }
    
    return true;
  }

  //======================= Input Validation Helpers

  validateFuelRecordData(data) {
    const { 
      datetime, 
      voucherNumber, 
      liters, 
      costPerLiter, 
      totalCost, 
      hoursAtRefuel, 
      mileageAtRefuel, 
      fuelLevelAfter, 
      attendant 
    } = data;
    
    if (datetime) {
      this.validateRefuelDatetime(datetime);
    }
    
    if (voucherNumber) {
      this.validateVoucherNumber(voucherNumber);
    }
    
    if (liters) {
      this.validateFuelQuantity(liters);
    }
    
    if (costPerLiter) {
      this.validateFuelCost(costPerLiter);
    }
    
    if (totalCost) {
      this.validateTotalCost(totalCost, liters, costPerLiter);
    }
    
    if (hoursAtRefuel) {
      this.validateEngineHours(hoursAtRefuel);
    }
    
    if (mileageAtRefuel) {
      this.validateMileage(mileageAtRefuel);
    }
    
    if (fuelLevelAfter) {
      this.validateFuelLevel(fuelLevelAfter);
    }
    
    if (attendant) {
      this.validateAttendantName(attendant);
    }
    
    return true;
  }

  //======================= Fuel Efficiency Validation

  validateFuelEfficiency(fuelRecord, previousRecord) {
    if (!previousRecord || !fuelRecord.hoursAtRefuel || !previousRecord.hoursAtRefuel) {
      return true; // Can't validate without engine hours
    }
    
    const hoursDiff = parseFloat(fuelRecord.hoursAtRefuel) - parseFloat(previousRecord.hoursAtRefuel);
    const fuelUsed = parseFloat(fuelRecord.liters);
    
    if (hoursDiff <= 0) {
      console.warn('Engine hours did not increase since last refuel - possible data entry error');
      return true;
    }
    
    const fuelEfficiency = fuelUsed / hoursDiff; // Liters per hour
    
    // Typical agricultural vehicle efficiency ranges from 3-20 L/h
    if (fuelEfficiency < 1) {
      console.warn('Fuel efficiency seems unusually low (<1 L/h) - please verify data');
    } else if (fuelEfficiency > 30) {
      console.warn('Fuel efficiency seems unusually high (>30 L/h) - please verify data');
    }
    
    return true;
  }

  //======================= Cost Analysis Validation

  validateFuelCostReasonability(costPerLiter, attendant, datetime) {
    // This would typically involve checking against market rates
    // For now, we'll do basic validation
    
    if (!costPerLiter) return true;
    
    const cost = parseFloat(costPerLiter);
    
    // Very rough fuel cost range validation (adjust based on your region/currency)
    if (cost < 0.5) {
      console.warn('Fuel cost seems unusually low - please verify');
    } else if (cost > 5.0) {
      console.warn('Fuel cost seems unusually high - please verify');
    }
    
    return true;
  }

  //======================= Seasonal and Operational Validation

  validateSeasonalFuelUsage(liters, datetime) {
    const month = new Date(datetime).getMonth() + 1; // 1-12
    const fuelAmount = parseFloat(liters);
    
    // During peak seasons (spring/fall), higher fuel usage is expected
    const peakSeasons = [3, 4, 5, 9, 10, 11]; // March-May, September-November
    
    if (peakSeasons.includes(month) && fuelAmount < 20) {
      console.info('Low fuel usage during peak season - normal for light operations');
    } else if (!peakSeasons.includes(month) && fuelAmount > 100) {
      console.info('High fuel usage during off-season - possible intensive operations');
    }
    
    return true;
  }

  validateRefuelInterval(currentRecord, previousRecord) {
    if (!previousRecord) return true;
    
    const currentDate = new Date(currentRecord.datetime);
    const previousDate = new Date(previousRecord.datetime);
    const daysDiff = (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDiff < 0.5) {
      console.warn('Multiple refuels within 12 hours - possible duplicate entry');
    } else if (daysDiff > 30) {
      console.info('Long interval since last refuel (>30 days) - vehicle may have been idle');
    }
    
    return true;
  }

  //======================= Data Integrity Validation

  validateDataConsistency(fuelRecord) {
    // Check for logical consistency in the data
    
    if (fuelRecord.fuelLevelAfter) {
      const fuelLevel = parseFloat(fuelRecord.fuelLevelAfter);
      const liters = parseFloat(fuelRecord.liters);
      
      // If adding a large amount of fuel, fuel level should be high
      if (liters > 50 && fuelLevel < 80) {
        console.warn('Large fuel quantity added but fuel level after refuel is low - please verify');
      }
    }
    
    return true;
  }
}
