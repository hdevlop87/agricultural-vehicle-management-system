import { dateField } from '@/lib/utils';
import { z } from 'zod'

// Step-specific schemas for multi-step form
export const operatorPersonalInfoSchema = (t) => z.object({
    name: z.string().min(2, { message: t('operators.validation.nameMinLength') }),
    email: z.string().email({ message: t('operators.validation.emailInvalid') }),
    cin: z
        .string()
        .regex(/^[a-zA-Z0-9]{8,12}$/, {
            message: t('operators.errors.invalidCin')
        }),
    phone: z.string().min(1, { message: t('operators.validation.phoneRequired') }),
    image: z.any().optional(),
});

export const operatorLicenseInfoSchema = (t) => z.object({
    licenseNumber: z.string().min(1, { message: t('operators.validation.licenseNumberRequired') }),
    licenseExpiry: dateField(t('operators.validation.licenseExpiryRequired')),
});

export const operatorEmploymentDetailsSchema = (t) => z.object({
    hireDate: dateField(t('operators.validation.dateRequired')),
    status: z.enum(['active', 'inactive', 'suspended']).default('active'),
    hourlyRate: z.string().min(1, { message: t('operators.validation.hourlyRateRequired') }),
});


