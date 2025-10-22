import { z } from 'zod'

export const alertValidationSchema = (t) => z.object({
    type: z.enum(['maintenance', 'fuel', 'security', 'operational', 'system']),
    title: z.string().min(2, { message: t('alerts.validation.titleMinLength') }),
    message: z.string().min(5, { message: t('alerts.validation.messageMinLength') }),
    priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    vehicleId: z.any().optional(),
    operatorId: z.any().optional(),
})

export const updateAlertValidationSchema = (t) => z.object({
    id: z.string().optional(),
    type: z.enum(['maintenance', 'fuel', 'security', 'operational', 'system']),
    title: z.string().min(2, { message: t('alerts.validation.titleMinLength') }),
    message: z.string().min(5, { message: t('alerts.validation.messageMinLength') }),
    priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    status: z.enum(['active', 'read', 'resolved', 'dismissed']).default('active'),
    vehicleId: z.any().optional(),
    operatorId: z.any().optional(),
})

export const createAlertSchema = alertValidationSchema;
export const updateAlertSchema = updateAlertValidationSchema;