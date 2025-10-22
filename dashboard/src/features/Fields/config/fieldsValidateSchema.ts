import { z } from 'zod'

export const fieldValidationSchema = (t) => z.object({
    name: z.string().min(2, { message: t('fields.validation.nameMinLength') }),
    area: z.union([z.string(), z.number()]).optional(),
    location: z.object({
        lat: z.number(),
        lng: z.number()
    }).nullable().optional(),
    description: z.string().optional(),
});

