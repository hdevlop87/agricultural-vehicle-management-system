import { z } from 'zod'

export const trackersValidationSchema = (t) => z.object({
    deviceId: z.string().min(1, { message: t('trackers.validation.deviceIdRequired') }),
    name: z.string().min(2, { message: t('trackers.validation.nameMinLength') }),
    vehicleId: z.string().min(1, { message: t('trackers.validation.vehicleRequired') }),
    status: z.enum(['active', 'inactive']).default('active'),
    lastSeen: z.string().optional(),
    isOnline: z.boolean().default(false),
    manufacturer: z.string().min(1).default('Unknown'),
})

export const updateTrackersValidationSchema = (t) => z.object({
    id: z.string().optional(),
    deviceId: z.string().min(1, { message: t('trackers.validation.deviceIdRequired') }).optional(),
    name: z.string().min(2, { message: t('trackers.validation.nameMinLength') }).optional(),
    vehicleId: z.string().min(1, { message: t('trackers.validation.vehicleRequired') }).optional(),
    status: z.enum(['active', 'inactive']).optional(),
    lastSeen: z.string().optional(),
    isOnline: z.boolean().optional(),
    manufacturer: z.string().min(1).optional(),
})

// Keep the old exports for backward compatibility until all references are updated
export const createTrackerSchema = trackersValidationSchema;
export const updateTrackerSchema = updateTrackersValidationSchema;