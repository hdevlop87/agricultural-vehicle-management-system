import { dateField } from '@/lib/utils';
import { z } from 'zod'

// Step-specific schemas for multi-step form
export const operationBasicInfoSchema = (t) => z.object({
    vehicleId: z.string().min(1, { message: t('operations.validation.vehicleRequired') }),
    operatorId: z.string().min(1, { message: t('operations.validation.operatorRequired') }),
    operationType: z.string().min(2, { message: t('operations.validation.operationTypeRequired') }),
    fieldId: z.string().optional(),
});

export const operationScheduleStatusSchema = (t) => z.object({
    date: dateField(t('operations.validation.dateRequired')),
    status: z.enum(['planned', 'active', 'completed', 'cancelled']).default('planned'),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
});

export const operationMetricsDetailsSchema = (t) => z.object({
    startHours: z.string().optional(),
    endHours: z.string().optional(),
    startMileage: z.string().optional(),
    endMileage: z.string().optional(),
    areaCovered: z.string().optional(),
    weather: z.string().optional(),
    notes: z.string().optional(),
});

// Legacy schemas for backward compatibility
export const operationsValidationSchema = (t) => z.object({
    vehicleId: z.string().min(1, { message: t('operations.validation.vehicleRequired') }),
    operatorId: z.string().min(1, { message: t('operations.validation.operatorRequired') }),
    operationType: z.string().min(2, { message: t('operations.validation.operationTypeRequired') }),
    fieldId: z.string().optional(),
    date: dateField(t('operations.validation.dateRequired')),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    startHours: z.string().optional(),
    endHours: z.string().optional(),
    startMileage: z.string().optional(),
    endMileage: z.string().optional(),
    areaCovered: z.string().optional(),
    weather: z.string().optional(),
    status: z.enum(['planned', 'active', 'completed', 'cancelled']).default('planned'),
    notes: z.string().optional(),
})

export const updateOperationsValidationSchema = (t) => z.object({
    id: z.string().optional(),
    vehicleId: z.string().min(1, { message: t('operations.validation.vehicleRequired') }),
    operatorId: z.string().min(1, { message: t('operations.validation.operatorRequired') }),
    operationType: z.string().min(2, { message: t('operations.validation.operationTypeRequired') }),
    fieldId: z.string().optional(),
    date: dateField(t('operations.validation.dateRequired')),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    startHours: z.string().optional(),
    endHours: z.string().optional(),
    startMileage: z.string().optional(),
    endMileage: z.string().optional(),
    areaCovered: z.string().optional(),
    weather: z.string().optional(),
    status: z.enum(['planned', 'active', 'completed', 'cancelled']).default('planned'),
    notes: z.string().optional(),
})

// Keep the old exports for backward compatibility until all references are updated
export const createOperationSchema = operationsValidationSchema;
export const updateOperationSchema = updateOperationsValidationSchema;