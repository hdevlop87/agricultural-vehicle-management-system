'use client'

import MultiStepForm from '@/components/MultiStepForm'
import StepForm from '@/components/MultiStepForm/StepForm'
import FormInput from '@/components/NForm/FormInput'
import React from 'react'
import { Truck, User, Calendar, FileText, Hash, DollarSign, Gauge, Fuel, UserCheck } from 'lucide-react'
import { useDialogStore } from '@/stores/DialogStore'
import { 
    refuelBasicInfoSchema, 
    refuelFuelDetailsSchema, 
    refuelMetricsNotesSchema 
} from '../config/refuelsValidateSchema'
import { useTranslation } from '@/hooks/useLanguage'

const RefuelForm = ({ refuel = null, mode = 'create',vehicles,operators }) => {

    const { t } = useTranslation();
    const { handleConfirm } = useDialogStore();
    
    const isUpdateMode = mode === 'update' || refuel !== null;

    const schemas = {
        basicInfo: refuelBasicInfoSchema(t),
        fuelDetails: refuelFuelDetailsSchema(t),
        metricsNotes: refuelMetricsNotesSchema(t)
    };

    const handleSubmit = async (refuelData) => {
        const finalData = {
            ...refuelData,
            ...(isUpdateMode && {
                id: refuel?.id
            })
        };
        handleConfirm(finalData);
    }

    const vehicleOptions = vehicles?.map(vehicle => ({
        value: vehicle.id,
        label: `${vehicle.name} (${vehicle.brand} ${vehicle.model})`
    })) || []

    const operatorOptions = operators?.map(operator => ({
        value: operator.id,
        label: operator.user?.name || operator.id
    })) || []

    return (
        <div className='flex flex-col justify-center items-center w-full mt-4'>
            <div className='flex flex-col h-full w-full gap-4'>
                <MultiStepForm
                    id='refuel-form'
                    onSubmit={handleSubmit}
                >
                    {/* Step 1: Basic Information */}
                    <StepForm
                        id="basic-info"
                        schema={schemas.basicInfo}
                        title={t('refuels.form.steps.basicInfo')}
                        description={t('refuels.form.steps.basicInfoDesc')}
                        defaultValues={{
                            vehicleId: refuel?.vehicleId || '',
                            operatorId: refuel?.operatorId || '',
                            datetime: refuel?.datetime ? new Date(refuel.datetime).toISOString().slice(0, 16) : '',
                            voucherNumber: refuel?.voucherNumber || ''
                        }}
                    >
                        <FormInput
                            name='vehicleId'
                            type='select'
                            formLabel={t('refuels.form.vehicle')}
                            placeholder={t('refuels.form.vehiclePlaceholder')}
                            variant='default'
                            icon={Truck}
                            items={vehicleOptions}
                            required={!isUpdateMode}
                        />

                        <FormInput
                            name='operatorId'
                            type='select'
                            formLabel={t('refuels.form.operator')}
                            placeholder={t('refuels.form.operatorPlaceholder')}
                            variant='default'
                            icon={User}
                            items={operatorOptions}
                            required={!isUpdateMode}
                        />

                        <FormInput
                            name='datetime'
                            type='date'
                            formLabel={t('refuels.form.datetime')}
                            placeholder={t('refuels.form.datetimePlaceholder')}
                            variant='default'
                            icon={Calendar}
                            required={!isUpdateMode}
                        />

                        <FormInput
                            name='voucherNumber'
                            type='text'
                            formLabel={t('refuels.form.voucherNumber')}
                            placeholder={t('refuels.form.voucherNumberPlaceholder')}
                            variant='default'
                            icon={Hash}
                        />
                    </StepForm>

                    {/* Step 2: Fuel Details */}
                    <StepForm
                        id="fuel-details"
                        schema={schemas.fuelDetails}
                        title={t('refuels.form.steps.fuelDetails')}
                        description={t('refuels.form.steps.fuelDetailsDesc')}
                        defaultValues={{
                            liters: refuel?.liters || '',
                            costPerLiter: refuel?.costPerLiter || '',
                            fuelLevelAfter: refuel?.fuelLevelAfter || '100',
                            attendant: refuel?.attendant || ''
                        }}
                    >
                        <FormInput
                            name='liters'
                            type='text'
                            formLabel={t('refuels.form.liters')}
                            placeholder={t('refuels.form.litersPlaceholder')}
                            variant='default'
                            icon={Fuel}
                            required={!isUpdateMode}
                        />

                        <FormInput
                            name='costPerLiter'
                            type='text'
                            formLabel={t('refuels.form.costPerLiter')}
                            placeholder={t('refuels.form.costPerLiterPlaceholder')}
                            variant='default'
                            icon={DollarSign}
                        />

                        <FormInput
                            name='fuelLevelAfter'
                            type='text'
                            formLabel={t('refuels.form.fuelLevelAfter')}
                            placeholder={t('refuels.form.fuelLevelAfterPlaceholder')}
                            variant='default'
                            icon={Gauge}
                        />

                        <FormInput
                            name='attendant'
                            type='text'
                            formLabel={t('refuels.form.attendant')}
                            placeholder={t('refuels.form.attendantPlaceholder')}
                            variant='default'
                            icon={UserCheck}
                        />
                    </StepForm>

                    {/* Step 3: Metrics & Notes */}
                    <StepForm
                        id="metrics-notes"
                        schema={schemas.metricsNotes}
                        title={t('refuels.form.steps.metricsNotes')}
                        description={t('refuels.form.steps.metricsNotesDesc')}
                        defaultValues={{
                            hoursAtRefuel: refuel?.hoursAtRefuel || '',
                            mileageAtRefuel: refuel?.mileageAtRefuel || '',
                            notes: refuel?.notes || ''
                        }}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                name='hoursAtRefuel'
                                type='text'
                                formLabel={t('refuels.form.hoursAtRefuel')}
                                placeholder={t('refuels.form.hoursAtRefuelPlaceholder')}
                                variant='default'
                                icon={Hash}
                            />

                            <FormInput
                                name='mileageAtRefuel'
                                type='text'
                                formLabel={t('refuels.form.mileageAtRefuel')}
                                placeholder={t('refuels.form.mileageAtRefuelPlaceholder')}
                                variant='default'
                                icon={Hash}
                            />
                        </div>

                        <FormInput
                            name='notes'
                            type='textarea'
                            formLabel={t('refuels.form.notes')}
                            placeholder={t('refuels.form.notesPlaceholder')}
                            variant='default'
                            icon={FileText}
                        />
                    </StepForm>

                </MultiStepForm>
            </div>
        </div>
    )
}

export default RefuelForm