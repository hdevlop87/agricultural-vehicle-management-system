import { dateField } from '@/lib/utils'
import { z } from 'zod'

// Step 1: Basic Information - Type, Name, Brand & Model
export const vehicleBasicInfoSchema = (t) => z.object({
    image: z.any().optional(),
    type: z.string().min(2, { message: t('vehicles.validation.vehicleTypeRequired')}),
    name: z.string().min(2, { message: t('vehicles.validation.nameMinLength') }),
    brand: z.string().min(2, { message: t('vehicles.validation.brandMinLength') }),
    model: z.string().min(2, { message: t('vehicles.validation.modelMinLength') }),
})

// Step 2: Identification & Purchase - Year, Serial, License & Purchase Info
export const vehicleIdentificationSchema = (t) => z.object({
    year: z.number().min(1900).max(new Date().getFullYear()).optional(),
    serialNumber: z.string().optional(),
    licensePlate: z.string().optional(),
    purchaseDate: dateField(),
    purchasePrice: z.union([z.string(), z.number()]).optional(),
    status: z.enum(['active', 'maintenance', 'retired']).default('active'),
})

// Step 3: Specifications & Metrics - Fuel, Capacity & Initial Values
export const vehicleSpecificationsSchema = (t) => z.object({
    fuelType: z.enum(['diesel', 'gasoline', 'electric', 'hybrid']).default('diesel'),
    tankCapacity: z.union([z.string(), z.number()]).optional(),
    initialHours: z.union([z.string(), z.number()]).default('0'),
    initialMileage: z.union([z.string(), z.number()]).default('0'),
    notes: z.string().optional(),
})