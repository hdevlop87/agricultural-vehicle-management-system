import { z } from 'zod'

// Step 1: Basic Information - Vehicle, Operator & Date
export const refuelBasicInfoSchema = (t) => z.object({
    vehicleId: z.string().min(1, { message: t('refuels.validation.vehicleRequired') }),
    operatorId: z.string().min(1, { message: t('refuels.validation.operatorRequired') }),
    datetime: z.string().min(1, { message: t('refuels.validation.datetimeRequired') }),
    voucherNumber: z.string().optional(),
})

// Step 2: Fuel Details - Quantity, Cost & Level
export const refuelFuelDetailsSchema = (t) => z.object({
    liters: z.string().min(1, { message: t('refuels.validation.litersRequired') }),
    costPerLiter: z.string().optional(),
    fuelLevelAfter: z.string().default('100'),
    attendant: z.string().optional(),
})

// Step 3: Metrics & Notes - Hours, Mileage & Notes
export const refuelMetricsNotesSchema = (t) => z.object({
    hoursAtRefuel: z.string().optional(),
    mileageAtRefuel: z.string().optional(),
    notes: z.string().optional(),
})

// Legacy schemas for backward compatibility
export const refuelsValidationSchema = (t) => z.object({
    vehicleId: z.string().min(1, { message: t('refuels.validation.vehicleRequired') }),
    operatorId: z.string().min(1, { message: t('refuels.validation.operatorRequired') }),
    datetime: z.string().min(1, { message: t('refuels.validation.datetimeRequired') }),
    voucherNumber: z.string().optional(),
    liters: z.string().min(1, { message: t('refuels.validation.litersRequired') }),
    costPerLiter: z.string().optional(),
    hoursAtRefuel: z.string().optional(),
    mileageAtRefuel: z.string().optional(),
    fuelLevelAfter: z.string().default('100'),
    attendant: z.string().optional(),
    notes: z.string().optional(),
})

export const updateRefuelsValidationSchema = (t) => z.object({
    id: z.string().optional(),
    vehicleId: z.string().min(1, { message: t('refuels.validation.vehicleRequired') }),
    operatorId: z.string().min(1, { message: t('refuels.validation.operatorRequired') }),
    datetime: z.string().min(1, { message: t('refuels.validation.datetimeRequired') }),
    voucherNumber: z.string().optional(),
    liters: z.string().min(1, { message: t('refuels.validation.litersRequired') }),
    costPerLiter: z.string().optional(),
    hoursAtRefuel: z.string().optional(),
    mileageAtRefuel: z.string().optional(),
    fuelLevelAfter: z.string().default('100'),
    attendant: z.string().optional(),
    notes: z.string().optional(),
})

// Keep the old exports for backward compatibility until all references are updated
export const createRefuelSchema = refuelsValidationSchema;
export const updateRefuelSchema = updateRefuelsValidationSchema;