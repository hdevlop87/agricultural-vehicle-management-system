'use client'

import MultiStepForm from '@/components/MultiStepForm'
import StepForm from '@/components/MultiStepForm/StepForm'
import FormInput from '@/components/NForm/FormInput'
import React from 'react'
import { User, Phone, CreditCard, Calendar, DollarSign, Settings, Hash, Mail } from 'lucide-react'
import { useDialogStore } from '@/stores/DialogStore'
import { useTranslation } from '@/hooks/useLanguage'
import {
  operatorPersonalInfoSchema,
  operatorLicenseInfoSchema,
  operatorEmploymentDetailsSchema,
} from '../config/operatorsValidateSchema'

const OperatorForm = ({ operator = null, mode = 'create' }) => {
  const { t } = useTranslation();
  const { handleConfirm } = useDialogStore();

  const isUpdateMode = mode === 'update' || operator !== null;

  const schemas = {
    personalInfo: operatorPersonalInfoSchema(t),
    licenseInfo: operatorLicenseInfoSchema(t),
    employmentDetails: operatorEmploymentDetailsSchema(t)
  };

  const handleSubmit = async (operatorData) => {
    const finalData = {
      ...operatorData,
      ...(isUpdateMode && {
        id: operator?.id,
        userId: operator?.userId 
      })
      
    };
    handleConfirm(finalData);
  };

  const statusOptions = [
    { value: 'active', label: t('operators.status.active') },
    { value: 'inactive', label: t('operators.status.inactive') },
    { value: 'suspended', label: t('operators.status.suspended') },
  ];

  return (
    <div className='flex flex-col justify-center items-center w-full mt-4'>
      <div className='flex flex-col h-full w-full gap-4'>
        <MultiStepForm
          id='operator-form'
          onSubmit={handleSubmit}
        >
          {/* Step 1: Personal Information */}
          <StepForm
            id="personal-info"
            schema={schemas.personalInfo}
            title={t('operators.form.steps.personalInfo')}
            description={t('operators.form.steps.personalInfoDesc')}
            defaultValues={{
              name: operator?.name || '',
              email: operator?.email || '',
              cin: operator?.cin || '',
              phone: operator?.phone || '',
              image: operator?.image || null,
            }}
          >

            <FormInput
              name='image'
              type='file'
              formLabel={t('users.form.image')}
              variant='default'
              icon={User}
              required={true}
            />

            <FormInput
              name='name'
              type='text'
              formLabel={t('operators.form.name')}
              placeholder={t('operators.form.namePlaceholder')}
              variant='default'
              icon={User}
              required={!isUpdateMode}
            />

            <FormInput
              name='email'
              type='text'
              formLabel={t('operators.form.email')}
              placeholder={t('operators.form.emailPlaceholder')}
              variant='default'
              icon={Mail}
              required={!isUpdateMode}
            />

            <FormInput
              name='cin'
              type='text'
              formLabel={t('operators.form.cin')}
              placeholder={t('operators.form.cinPlaceholder')}
              variant='default'
              icon={Hash}
              required={!isUpdateMode}
            />

            <FormInput
              name='phone'
              type='text'
              formLabel={t('operators.form.phone')}
              placeholder={t('operators.form.phonePlaceholder')}
              variant='default'
              icon={Phone}
              required={!isUpdateMode}
            />
          </StepForm>

          {/* Step 2: License Information */}
          <StepForm
            id="license-info"
            schema={schemas.licenseInfo}
            title={t('operators.form.steps.licenseInfo')}
            description={t('operators.form.steps.licenseInfoDesc')}
            defaultValues={{
              licenseNumber: operator?.licenseNumber || '',
              licenseExpiry: operator?.licenseExpiry || '',
            }}
          >
            <FormInput
              name='licenseNumber'
              type='text'
              formLabel={t('operators.form.licenseNumber')}
              placeholder={t('operators.form.licenseNumberPlaceholder')}
              variant='default'
              icon={CreditCard}
              required={!isUpdateMode}
            />

            <FormInput
              name='licenseExpiry'
              type='date'
              formLabel={t('operators.form.licenseExpiry')}
              placeholder={t('operators.form.licenseExpiryPlaceholder')}
              variant='default'
              icon={Calendar}
              required={!isUpdateMode}
            />
          </StepForm>

          {/* Step 3: Employment Details */}
          <StepForm
            id="employment-details"
            schema={schemas.employmentDetails}
            title={t('operators.form.steps.employmentDetails')}
            description={t('operators.form.steps.employmentDetailsDesc')}
            defaultValues={{
              hireDate: operator?.hireDate || new Date(),
              status: operator?.status || 'active',
              hourlyRate: operator?.hourlyRate || '100',
            }}
          >
            <FormInput
              name='hireDate'
              type='date'
              formLabel={t('operators.form.hireDate')}
              placeholder={t('operators.form.hireDatePlaceholder')}
              variant='default'
              icon={Calendar}
              required={!isUpdateMode}
            />

            <FormInput
              name='status'
              type='select'
              formLabel={t('operators.form.status')}
              variant='default'
              icon={Settings}
              items={statusOptions}
              required={!isUpdateMode}
            />

            <FormInput
              name='hourlyRate'
              type='text'
              formLabel={t('operators.form.hourlyRate')}
              placeholder={t('operators.form.hourlyRatePlaceholder')}
              variant='default'
              icon={DollarSign}
              required={!isUpdateMode}
            />
          </StepForm>

        </MultiStepForm>
      </div>
    </div>
  )
}

export default OperatorForm