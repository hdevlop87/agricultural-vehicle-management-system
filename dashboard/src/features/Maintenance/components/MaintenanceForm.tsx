'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import React from 'react'
import { Wrench, Tag, Truck, Clock, DollarSign, FileText, Calendar, AlertTriangle, Package, User } from 'lucide-react'
import { useDialogStore } from '@/stores/DialogStore'
import { maintenanceValidationSchema } from '../config/maintenanceValidateSchema'
import { useTranslation } from '@/hooks/useLanguage'

const MaintenanceForm = ({ maintenance = null, mode = 'create',vehicles }) => {
    const { t } = useTranslation();
    const { handleConfirm } = useDialogStore();

    const isUpdateMode = mode === 'update' || maintenance !== null;

    const schema = maintenanceValidationSchema(t);

    const handleSubmit = async (maintenanceData) => {
        const finalData = {
            ...maintenanceData,
            ...(isUpdateMode && {
                id: maintenance?.id
            })
        };
        handleConfirm(finalData);
    }

    const maintenanceTypeOptions = [
        { value: 'scheduled', label: t('maintenance.types.scheduled') },
        { value: 'repair', label: t('maintenance.types.repair') },
        { value: 'inspection', label: t('maintenance.types.inspection') },
        { value: 'oil_change', label: t('maintenance.types.oil_change') },
        { value: 'filter_change', label: t('maintenance.types.filter_change') },
        { value: 'other', label: t('maintenance.types.other') },
    ]

    const statusOptions = [
        { value: 'scheduled', label: t('maintenance.statuses.scheduled') },
        { value: 'in_progress', label: t('maintenance.statuses.in_progress') },
        { value: 'completed', label: t('maintenance.statuses.completed') },
        { value: 'cancelled', label: t('maintenance.statuses.cancelled') },
        { value: 'overdue', label: t('maintenance.statuses.overdue') },
    ]

    const priorityOptions = [
        { value: 'low', label: t('maintenance.priorities.low') },
        { value: 'normal', label: t('maintenance.priorities.normal') },
        { value: 'high', label: t('maintenance.priorities.high') },
        { value: 'critical', label: t('maintenance.priorities.critical') },
    ]

    const vehicleOptions = vehicles?.map(vehicle => ({
        value: vehicle.id,
        label: vehicle.name
    })) || [];

    const defaultValues = {
        vehicleId: maintenance?.vehicleId || '',
        type: maintenance?.type || 'scheduled',
        title: maintenance?.title || '',
        status: maintenance?.status || 'scheduled',
        dueHours: maintenance?.dueHours || '',
        cost: maintenance?.cost || '',
        scheduledDate: maintenance?.scheduledDate || '',
        priority: maintenance?.priority || 'normal',
        partsUsed: maintenance?.partsUsed || '',
        assignedTo: maintenance?.assignedTo || '',
        notes: maintenance?.notes || ''
    };

    return (
        <div className='flex flex-col justify-center items-center w-full mt-4'>
            <div className='flex flex-col h-full w-full gap-4'>
                <NForm
                    id='maintenance-form'
                    schema={schema}
                    defaultValues={defaultValues}
                    onSubmit={handleSubmit}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            name='vehicleId'
                            type='select'
                            formLabel={t('maintenance.form.vehicle')}
                            variant='default'
                            icon={Truck}
                            items={vehicleOptions}
                            required={!isUpdateMode}
                        />
                        <FormInput
                            name='type'
                            type='select'
                            formLabel={t('maintenance.form.type')}
                            variant='default'
                            icon={Wrench}
                            items={maintenanceTypeOptions}
                            required={!isUpdateMode}
                        />
                    </div>

                    <FormInput
                        name='title'
                        type='text'
                        formLabel={t('maintenance.form.title')}
                        placeholder={t('maintenance.form.titlePlaceholder')}
                        variant='default'
                        icon={Tag}
                        required={!isUpdateMode}
                    />

                    {isUpdateMode && (
                        <FormInput
                            name='status'
                            type='select'
                            formLabel={t('maintenance.form.status')}
                            variant='default'
                            icon={Wrench}
                            items={statusOptions}
                        />
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            name='scheduledDate'
                            type='date'
                            formLabel={t('maintenance.form.scheduledDate')}
                            variant='default'
                            icon={Calendar}
                        />
                        <FormInput
                            name='priority'
                            type='select'
                            formLabel={t('maintenance.form.priority')}
                            variant='default'
                            icon={AlertTriangle}
                            items={priorityOptions}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            name='dueHours'
                            type='text'
                            formLabel={t('maintenance.form.dueHours')}
                            placeholder={t('maintenance.form.dueHoursPlaceholder')}
                            variant='default'
                            icon={Clock}
                        />
                        <FormInput
                            name='cost'
                            type='text'
                            formLabel={t('maintenance.form.cost')}
                            placeholder={t('maintenance.form.costPlaceholder')}
                            variant='default'
                            icon={DollarSign}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            name='assignedTo'
                            type='text'
                            formLabel={t('maintenance.form.assignedTo')}
                            placeholder={t('maintenance.form.assignedToPlaceholder')}
                            variant='default'
                            icon={User}
                        />
                        <FormInput
                            name='partsUsed'
                            type='text'
                            formLabel={t('maintenance.form.partsUsed')}
                            placeholder={t('maintenance.form.partsUsedPlaceholder')}
                            variant='default'
                            icon={Package}
                        />
                    </div>

                    <FormInput
                        name='notes'
                        type='textarea'
                        formLabel={t('maintenance.form.notes')}
                        placeholder={t('maintenance.form.notesPlaceholder')}
                        variant='default'
                        icon={FileText}
                    />

                </NForm>
            </div>
        </div>
    )
}

export default MaintenanceForm