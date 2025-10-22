'use client'

import MultiStepForm from '@/components/MultiStepForm'
import StepForm from '@/components/MultiStepForm/StepForm'
import FormInput from '@/components/NForm/FormInput'
import React from 'react'
import { Truck, User, Calendar, Clock, Settings, Hash, Ruler, CloudSun, FileText } from 'lucide-react'
import { useDialogStore } from '@/stores/DialogStore'
import {
   operationBasicInfoSchema,
   operationScheduleStatusSchema,
   operationMetricsDetailsSchema,
} from '../config/operationsValidateSchema'
import { useTranslation } from '@/hooks/useLanguage'

const OperationForm = ({ operation = null, mode = 'create', vehicles, operators, fields, operationsType }) => {
   const { t } = useTranslation();
   const { handleConfirm } = useDialogStore();

   const isUpdateMode = mode === 'update' || operation !== null;

   const schemas = {
      basicInfo: operationBasicInfoSchema(t),
      scheduleStatus: operationScheduleStatusSchema(t),
      metricsDetails: operationMetricsDetailsSchema(t)
   };

   const handleSubmit = async (operationData) => {
      const finalData = {
         ...operationData,
         ...(isUpdateMode && {
            id: operation?.id
         })
      };
      handleConfirm(finalData);
   };

   const statusOptions = [
      { value: 'planned', label: t('operations.status.planned') },
      { value: 'active', label: t('operations.status.active') },
      { value: 'completed', label: t('operations.status.completed') },
      { value: 'cancelled', label: t('operations.status.cancelled') },
   ]

   const vehicleOptions = vehicles?.map(vehicle => ({
      value: vehicle.id,
      label: `${vehicle.name} (${vehicle.brand} ${vehicle.model})`
   })) || []

   const operatorOptions = operators?.map(operator => ({
      value: operator.id,
      label: operator.user?.name || operator.id
   })) || []

   const fieldOptions = fields?.map(field => ({
      value: field.id,
      label: field.name
   })) || []

   const operationTypeOptions = operationsType?.map(type => ({
      value: type.value || type.id,
      label: type.label || type.name
   }))

   return (
      <div className='flex flex-col justify-center items-center w-full mt-4'>
         <div className='flex flex-col h-full w-full gap-4'>
            <MultiStepForm
               id='operation-form'
               onSubmit={handleSubmit}
            >
               {/* Step 1: Basic Information */}
               <StepForm
                  id="basic-info"
                  schema={schemas.basicInfo}
                  title={t('operations.form.steps.basicInfo')}
                  description={t('operations.form.steps.basicInfoDesc')}
                  defaultValues={{
                     vehicleId: operation?.vehicleId || '',
                     operatorId: operation?.operatorId || '',
                     operationType: operation?.operationType || '',
                     fieldId: operation?.fieldId || ''
                  }}
               >
                  <FormInput
                     name='vehicleId'
                     type='select'
                     formLabel={t('operations.form.vehicle')}
                     placeholder={t('operations.form.vehiclePlaceholder')}
                     variant='default'
                     icon={Truck}
                     items={vehicleOptions}
                     required={!isUpdateMode}
                  />

                  <FormInput
                     name='operatorId'
                     type='select'
                     formLabel={t('operations.form.operator')}
                     placeholder={t('operations.form.operatorPlaceholder')}
                     variant='default'
                     icon={User}
                     items={operatorOptions}
                     required={!isUpdateMode}
                  />

                  <FormInput
                     name='operationType'
                     type='select'
                     formLabel={t('operations.form.operationType')}
                     placeholder={t('operations.form.operationTypePlaceholder')}
                     variant='default'
                     icon={Settings}
                     items={operationTypeOptions}
                     required={!isUpdateMode}
                  />

                  <FormInput
                     name='fieldId'
                     type='select'
                     formLabel={t('operations.form.field')}
                     placeholder={t('operations.form.fieldPlaceholder')}
                     variant='default'
                     icon={Hash}
                     items={fieldOptions}
                  />
               </StepForm>

               {/* Step 2: Schedule & Status */}
               <StepForm
                  id="schedule-status"
                  schema={schemas.scheduleStatus}
                  title={t('operations.form.steps.scheduleStatus')}
                  description={t('operations.form.steps.scheduleStatusDesc')}
                  defaultValues={{
                     date: operation?.date || new Date(),
                     status: operation?.status || 'planned',
                     startTime: operation?.startTime || '06:00',
                     endTime: operation?.endTime || '12:00'
                  }}
               >
                  <FormInput
                     name='date'
                     type='date'
                     formLabel={t('operations.form.date')}
                     placeholder={t('operations.form.datePlaceholder')}
                     variant='default'
                     icon={Calendar}
                     required={!isUpdateMode}
                  />

                  <FormInput
                     name='status'
                     type='select'
                     formLabel={t('operations.form.status')}
                     placeholder={t('operations.form.statusPlaceholder')}
                     variant='default'
                     icon={Settings}
                     items={statusOptions}
                     required={!isUpdateMode}
                  />

                  <FormInput
                     name='startTime'
                     type='time'
                     formLabel={t('operations.form.startTime')}
                     placeholder={t('operations.form.startTimePlaceholder')}
                     variant='default'
                     icon={Clock}
                  />

                  <FormInput
                     name='endTime'
                     type='time'
                     formLabel={t('operations.form.endTime')}
                     placeholder={t('operations.form.endTimePlaceholder')}
                     variant='default'
                     icon={Clock}
                  />
               </StepForm>

               {/* Step 3: Metrics & Details */}
               <StepForm
                  id="metrics-details"
                  schema={schemas.metricsDetails}
                  title={t('operations.form.steps.metricsDetails')}
                  description={t('operations.form.steps.metricsDetailsDesc')}
                  defaultValues={{
                     startHours: operation?.startHours || '0',
                     endHours: operation?.endHours || '0',
                     startMileage: operation?.startMileage || '0',
                     endMileage: operation?.endMileage || '0',
                     areaCovered: operation?.areaCovered || '0',
                     weather: operation?.weather || '',
                     notes: operation?.notes || ''
                  }}
               >
                  <div className="grid grid-cols-2 gap-4">
                     <FormInput
                        name='startHours'
                        type='text'
                        formLabel={t('operations.form.startHours')}
                        placeholder={t('operations.form.startHoursPlaceholder')}
                        variant='default'
                        icon={Hash}
                     />

                     <FormInput
                        name='endHours'
                        type='text'
                        formLabel={t('operations.form.endHours')}
                        placeholder={t('operations.form.endHoursPlaceholder')}
                        variant='default'
                        icon={Hash}
                     />

                     <FormInput
                        name='startMileage'
                        type='text'
                        formLabel={t('operations.form.startMileage')}
                        placeholder={t('operations.form.startMileagePlaceholder')}
                        variant='default'
                        icon={Hash}
                     />

                     <FormInput
                        name='endMileage'
                        type='text'
                        formLabel={t('operations.form.endMileage')}
                        placeholder={t('operations.form.endMileagePlaceholder')}
                        variant='default'
                        icon={Hash}
                     />
                  </div>

                  <FormInput
                     name='areaCovered'
                     type='text'
                     formLabel={t('operations.form.areaCovered')}
                     placeholder={t('operations.form.areaCoveredPlaceholder')}
                     variant='default'
                     icon={Ruler}
                  />

                  <FormInput
                     name='weather'
                     type='text'
                     formLabel={t('operations.form.weather')}
                     placeholder={t('operations.form.weatherPlaceholder')}
                     variant='default'
                     icon={CloudSun}
                  />

                  <FormInput
                     name='notes'
                     type='textarea'
                     formLabel={t('operations.form.notes')}
                     placeholder={t('operations.form.notesPlaceholder')}
                     variant='default'
                     icon={FileText}
                  />
               </StepForm>

            </MultiStepForm>
         </div>
      </div>
   )
}

export default OperationForm