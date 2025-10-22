'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import React from 'react'
import { AlertTriangle, Bell, MessageSquare, Truck, User, Settings } from 'lucide-react'
import { useDialogStore } from '@/stores/DialogStore'
import { alertValidationSchema, updateAlertValidationSchema } from '../config/alertsValidateSchema'
import { useTranslation } from '@/hooks/useLanguage'


const AlertForm = ({ alert = null, mode = 'create',operators ,vehicles}) => {
    const { t } = useTranslation();
    const { handleConfirm } = useDialogStore();

    const isUpdateMode = mode === 'update' || alert !== null;

    const schema = isUpdateMode ? updateAlertValidationSchema(t) : alertValidationSchema(t);

    const handleSubmit = async (alertData) => {
        const finalData = {
            ...alertData,
            ...(isUpdateMode && {
                id: alert?.id
            })
        };
        handleConfirm(finalData);
    }

    const alertTypeOptions = [
        { value: 'maintenance', label: t('alerts.types.maintenance') },
        { value: 'fuel', label: t('alerts.types.fuel') },
        { value: 'security', label: t('alerts.types.security') },
        { value: 'operational', label: t('alerts.types.operational') },
        { value: 'system', label: t('alerts.types.system') },
    ]

    const priorityOptions = [
        { value: 'low', label: t('alerts.priorities.low') },
        { value: 'medium', label: t('alerts.priorities.medium') },
        { value: 'high', label: t('alerts.priorities.high') },
        { value: 'critical', label: t('alerts.priorities.critical') },
    ]

    const statusOptions = [
        { value: 'active', label: t('alerts.statuses.active') },
        { value: 'read', label: t('alerts.statuses.read') },
        { value: 'resolved', label: t('alerts.statuses.resolved') },
        { value: 'dismissed', label: t('alerts.statuses.dismissed') },
    ]

    const vehicleOptions = vehicles?.map(vehicle => ({
        value: vehicle.id,
        label: vehicle.name
    })) || [];

    const operatorOptions = operators?.map(operator => ({
        value: operator.id,
        label: operator.name
    })) || [];

    const defaultValues = {
        type: alert?.type || 'system',
        title: alert?.title || '',
        message: alert?.message || '',
        priority: alert?.priority || 'medium',
        status: alert?.status || 'active',
        vehicleId: alert?.vehicleId || null,
        operatorId: alert?.operatorId || null,
    };

    return (
        <div className='flex flex-col justify-center items-center w-full mt-4'>
            <div className='flex flex-col h-full w-full gap-4'>
                <NForm
                    id='alert-form'
                    schema={schema}
                    defaultValues={defaultValues}
                    onSubmit={handleSubmit}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            name='type'
                            type='select'
                            formLabel={t('alerts.form.type')}
                            variant='default'
                            icon={AlertTriangle}
                            items={alertTypeOptions}
                            required={!isUpdateMode}
                        />
                        <FormInput
                            name='priority'
                            type='select'
                            formLabel={t('alerts.form.priority')}
                            variant='default'
                            icon={AlertTriangle}
                            items={priorityOptions}
                            required={!isUpdateMode}
                        />
                    </div>

                    <FormInput
                        name='title'
                        type='text'
                        formLabel={t('alerts.form.title')}
                        placeholder={t('alerts.form.titlePlaceholder')}
                        variant='default'
                        icon={Bell}
                        required={!isUpdateMode}
                    />

                    <FormInput
                        name='message'
                        type='textarea'
                        formLabel={t('alerts.form.message')}
                        placeholder={t('alerts.form.messagePlaceholder')}
                        variant='default'
                        icon={MessageSquare}
                        required={!isUpdateMode}
                    />

                    {isUpdateMode && (
                        <FormInput
                            name='status'
                            type='select'
                            formLabel={t('alerts.form.status')}
                            variant='default'
                            icon={Settings}
                            items={statusOptions}
                        />
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            name='vehicleId'
                            type='select'
                            formLabel={t('alerts.form.vehicle')}
                            variant='default'
                            icon={Truck}
                            items={vehicleOptions}
                            placeholder={t('alerts.form.vehiclePlaceholder')}
                        />
                        <FormInput
                            name='operatorId'
                            type='select'
                            formLabel={t('alerts.form.operator')}
                            variant='default'
                            icon={User}
                            items={operatorOptions}
                            placeholder={t('alerts.form.operatorPlaceholder')}
                        />
                    </div>

                </NForm>
            </div>
        </div>
    )
}

export default AlertForm