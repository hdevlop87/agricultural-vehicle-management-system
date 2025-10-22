'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import React from 'react'
import { MapPin, Ruler, FileText } from 'lucide-react'
import { useDialogStore } from '@/stores/DialogStore'
import { fieldValidationSchema } from '../config/fieldsValidateSchema'
import { useTranslation } from '@/hooks/useLanguage'

const FieldForm = ({ field = null, mode = 'create' }) => {
    const { t } = useTranslation();
    const { handleConfirm } = useDialogStore();
    const isUpdateMode = mode === 'update' || field !== null;

    const schema =  fieldValidationSchema(t);

    const defaultValues = {
        id: field?.id || '',
        name: field?.name || '',
        area: field?.area || '',
        description: field?.description || '',
        location: field?.location || null,
    }

    const handleSubmit = async (fieldData) => {
        const finalData = {
            ...fieldData,
            ...(isUpdateMode && {
                id: field?.id,
            })

        };
        handleConfirm(finalData);
    }

    return (
        <div className='flex flex-col justify-center items-center w-full mt-4'>

            <div className='flex flex-col h-full w-full gap-4'>
                <NForm
                    id='field-form'
                    schema={schema}
                    defaultValues={defaultValues}
                    onSubmit={handleSubmit}
                >
                    <FormInput
                        name='name'
                        type='text'
                        formLabel={t('fields.form.name')}
                        placeholder={t('fields.form.namePlaceholder')}
                        variant='default'
                        icon={MapPin}
                    />

                    <FormInput
                        name='area'
                        type='text'
                        formLabel={t('fields.form.area')}
                        placeholder={t('fields.form.areaPlaceholder')}
                        variant='default'
                        icon={Ruler}
                    />

                    <FormInput
                        name="location"
                        type="map"
                        formLabel={t('fields.form.location')}
                        height="200px"
                        showClearButton={true}
                    />

                    <FormInput
                        name='description'
                        type='textarea'
                        formLabel={t('fields.form.description')}
                        placeholder={t('fields.form.descriptionPlaceholder')}
                        variant='default'
                        icon={FileText}
                    />


                </NForm>

            </div>
        </div>
    )
}

export default FieldForm
