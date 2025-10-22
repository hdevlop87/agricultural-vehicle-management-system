import { dateField } from '@/lib/utils';
import { z } from 'zod'

export const maintenanceValidationSchema = (t) => z.object({
    vehicleId: z.string().min(1, { message: t('maintenance.validation.vehicleRequired') }),
    type: z.enum(['scheduled', 'repair', 'inspection', 'oil_change', 'filter_change', 'other']),
    title: z.string().min(2, { message: t('maintenance.validation.titleMinLength') }),
    status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled', 'overdue']).optional(),
    dueHours: z.string().optional(),
    cost: z.string().optional(),
    scheduledDate: dateField(),
    priority: z.enum(['low', 'normal', 'high', 'critical']).optional(),
    partsUsed: z.string().optional(),
    assignedTo: z.string().optional(),
    notes: z.string().optional(),
});