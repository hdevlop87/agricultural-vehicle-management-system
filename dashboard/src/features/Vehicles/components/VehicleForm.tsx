'use client'

import MultiStepForm from '@/components/MultiStepForm'
import StepForm from '@/components/MultiStepForm/StepForm'
import FormInput from '@/components/NForm/FormInput'
import React from 'react'
import { Tag, Truck, Settings, Calendar, DollarSign, Fuel, Clock, MapPin, Hash, CreditCard, Image } from 'lucide-react'
import { useDialogStore } from '@/stores/DialogStore'
import {
   vehicleBasicInfoSchema,
   vehicleIdentificationSchema,
   vehicleSpecificationsSchema
} from '../config/vehiclesValidateSchema'
import { useTranslation } from '@/hooks/useLanguage'

const VehicleForm = ({ vehicle = null, mode = 'create' }) => {
   const { t } = useTranslation();
   const { handleConfirm } = useDialogStore();
   const isUpdateMode = mode === 'update' || vehicle !== null;

   const schemas = {
      basicInfo: vehicleBasicInfoSchema(t),
      identification: vehicleIdentificationSchema(t),
      specifications: vehicleSpecificationsSchema(t)
   };

   const handleSubmit = async (vehicleData) => {
      const finalData = {
         ...vehicleData,
         ...(isUpdateMode && {
            id: vehicle?.id
         })
      };
      handleConfirm(finalData);
   }

   const vehicleTypeOptions = [
      { value: 'tractor', label: t('vehicles.types.tractor') },
      { value: 'harvester', label: t('vehicles.types.harvester') },
      { value: 'sprayer', label: t('vehicles.types.sprayer') },
      { value: 'seeder', label: t('vehicles.types.seeder') },
      { value: 'cultivator', label: t('vehicles.types.cultivator') },
      { value: 'other', label: t('vehicles.types.other') },
   ]

   const statusOptions = [
      { value: 'active', label: t('vehicles.statuses.active') },
      { value: 'maintenance', label: t('vehicles.statuses.maintenance') },
      { value: 'retired', label: t('vehicles.statuses.retired') },
   ]

   const fuelTypeOptions = [
      { value: 'diesel', label: t('vehicles.fuelTypes.diesel') },
      { value: 'gasoline', label: t('vehicles.fuelTypes.gasoline') },
      { value: 'electric', label: t('vehicles.fuelTypes.electric') },
      { value: 'hybrid', label: t('vehicles.fuelTypes.hybrid') },
   ]

   return (
      <div className='flex flex-col justify-center items-center w-full mt-4'>
         <div className='flex flex-col h-full w-full gap-4'>
            <MultiStepForm
               id='vehicle-form'
               onSubmit={handleSubmit}
            >
               {/* Step 1: Basic Information */}
               <StepForm
                  id="basic-info"
                  schema={schemas.basicInfo}
                  title={t('vehicles.form.steps.basicInfo')}
                  description={t('vehicles.form.steps.basicInfoDesc')}
                  defaultValues={{
                     type: vehicle?.type || 'tractor',
                     name: vehicle?.name|| 'sdf',
                     brand: vehicle?.brand|| 'sdf',
                     model: vehicle?.model|| 'sdf',
                     image: vehicle?.image || null
                  }}
               >
                  <FormInput
                     name='image'
                     type='file'
                     formLabel={t('vehicles.form.image')}
                     variant='default'
                     icon={Image}
                  />

                  <div className="grid grid-cols-2 gap-4">
                     <FormInput
                        name='type'
                        type='select'
                        formLabel={t('vehicles.form.vehicleType')}
                        variant='default'
                        icon={Truck}
                        items={vehicleTypeOptions}
                        required={!isUpdateMode}
                     />
                     <FormInput
                        name='name'
                        type='text'
                        formLabel={t('vehicles.form.vehicleName')}
                        placeholder={t('vehicles.form.vehicleNamePlaceholder')}
                        variant='default'
                        icon={Tag}
                        required={!isUpdateMode}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <FormInput
                        name='brand'
                        type='text'
                        formLabel={t('vehicles.form.brand')}
                        placeholder={t('vehicles.form.brandPlaceholder')}
                        variant='default'
                        icon={Tag}
                        required={!isUpdateMode}
                     />
                     <FormInput
                        name='model'
                        type='text'
                        formLabel={t('vehicles.form.model')}
                        placeholder={t('vehicles.form.modelPlaceholder')}
                        variant='default'
                        icon={Tag}
                        required={!isUpdateMode}
                     />
                  </div>
               </StepForm>

               {/* Step 2: Identification & Purchase */}
               <StepForm
                  id="identification"
                  schema={schemas.identification}
                  title={t('vehicles.form.steps.identification')}
                  description={t('vehicles.form.steps.identificationDesc')}
                  defaultValues={{
                     year: vehicle?.year || new Date().getFullYear(),
                     licensePlate: vehicle?.licensePlate || '',
                     purchaseDate: vehicle?.purchaseDate || new Date(),
                     purchasePrice: vehicle?.purchasePrice || 0,
                     status: vehicle?.status || 'active'
                  }}
               >
                  <div className="grid grid-cols-2 gap-4">
                     <FormInput
                        name='year'
                        type='number'
                        formLabel={t('vehicles.form.year')}
                        placeholder={t('vehicles.form.yearPlaceholder')}
                        variant='default'
                        icon={Calendar}
                     />
                     <FormInput
                        name='status'
                        type='select'
                        formLabel={t('vehicles.form.status')}
                        variant='default'
                        icon={Settings}
                        items={statusOptions}
                     />
                  </div>

                  <FormInput
                     name='licensePlate'
                     type='text'
                     formLabel={t('vehicles.form.licensePlate')}
                     placeholder={t('vehicles.form.licensePlatePlaceholder')}
                     variant='default'
                     icon={CreditCard}
                     required={!isUpdateMode}
                  />

                  <div className="grid grid-cols-2 gap-4">
                     <FormInput
                        name='purchaseDate'
                        type='date'
                        formLabel={t('vehicles.form.purchaseDate')}
                        placeholder={t('vehicles.form.purchaseDatePlaceholder')}
                        variant='default'
                        icon={Calendar}
                     />
                     <FormInput
                        name='purchasePrice'
                        type='text'
                        formLabel={t('vehicles.form.purchasePrice')}
                        placeholder={t('vehicles.form.purchasePricePlaceholder')}
                        variant='default'
                        icon={DollarSign}
                     />
                  </div>
               </StepForm>

               {/* Step 3: Specifications & Metrics */}
               <StepForm
                  id="specifications"
                  schema={schemas.specifications}
                  title={t('vehicles.form.steps.specifications')}
                  description={t('vehicles.form.steps.specificationsDesc')}
                  defaultValues={{
                     fuelType: vehicle?.fuelType || 'diesel',
                     tankCapacity: vehicle?.tankCapacity || 0,
                     initialHours: vehicle?.initialHours || 0,
                     initialMileage: vehicle?.initialMileage || 0,
                     notes: vehicle?.notes || ''
                  }}
               >
                  <div className="grid grid-cols-2 gap-4">
                     <FormInput
                        name='fuelType'
                        type='select'
                        formLabel={t('vehicles.form.fuelType')}
                        variant='default'
                        icon={Fuel}
                        items={fuelTypeOptions}
                     />
                     <FormInput
                        name='tankCapacity'
                        type='text'
                        formLabel={t('vehicles.form.tankCapacity')}
                        placeholder={t('vehicles.form.tankCapacityPlaceholder')}
                        variant='default'
                        icon={Fuel}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <FormInput
                        name='initialHours'
                        type='text'
                        formLabel={t('vehicles.form.initialHours')}
                        placeholder={t('vehicles.form.initialHoursPlaceholder')}
                        variant='default'
                        icon={Clock}
                     />
                     <FormInput
                        name='initialMileage'
                        type='text'
                        formLabel={t('vehicles.form.initialMileage')}
                        placeholder={t('vehicles.form.initialMileagePlaceholder')}
                        variant='default'
                        icon={MapPin}
                     />
                  </div>

                  <FormInput
                     name='notes'
                     type='textarea'
                     formLabel={t('vehicles.form.notes')}
                     placeholder={t('vehicles.form.notesPlaceholder')}
                     variant='default'
                     icon={Tag}
                  />
               </StepForm>

            </MultiStepForm>
         </div>
      </div>
   )
}

export default VehicleForm