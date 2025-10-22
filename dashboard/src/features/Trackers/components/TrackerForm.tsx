'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import React from 'react'
import { Smartphone, Tag, Truck, Settings, Radio, Factory, Clock, Timer } from 'lucide-react'
import { useDialogStore } from '@/stores/DialogStore'
import { trackersValidationSchema, updateTrackersValidationSchema } from '../config/trackersValidateSchema'
import { useTranslation } from '@/hooks/useLanguage'

const TrackerForm = ({ tracker = null, vehicles = [], mode = 'create' }) => {
  const { t } = useTranslation();
  const { handleConfirm } = useDialogStore();
  
  const isUpdateMode = mode === 'update' || tracker !== null;
  const schema = isUpdateMode ? updateTrackersValidationSchema(t) : trackersValidationSchema(t);

  const defaultValues = {
    deviceId: tracker?.deviceId || '123ddd',
    name: tracker?.name || 'trdfff',
    vehicleId: tracker?.vehicleId || '',
    status: tracker?.status || 'active',
    manufacturer: tracker?.manufacturer || 'Unknown',
    mode: tracker?.mode || 'tracking',
    refreshInterval: tracker?.refreshInterval || 60,
    refreshUnit: tracker?.refreshUnit || 's',
  }

  const handleSubmit = async (trackerData) => {
    handleConfirm(trackerData);
  }

  const vehicleOptions = vehicles.map(vehicle => ({
    value: vehicle.id,
    label: vehicle.name
  }))

  const statusOptions = [
    { value: 'active', label: t('trackers.status.active') },
    { value: 'inactive', label: t('trackers.status.inactive') },
  ]

  const modeOptions = [
    { value: 'tracking', label: t('trackers.mode.tracking') },
    { value: 'monitoring', label: t('trackers.mode.monitoring') },
    { value: 'gprs', label: t('trackers.mode.gprs') },
    { value: 'sms', label: t('trackers.mode.sms') },
    { value: 'sleep_time', label: t('trackers.mode.sleep_time') },
    { value: 'sleep_shock', label: t('trackers.mode.sleep_shock') },
    { value: 'sleep_deep', label: t('trackers.mode.sleep_deep') },
  ]

  const refreshUnitOptions = [
    { value: 's', label: t('trackers.refreshUnit.s') },
    { value: 'm', label: t('trackers.refreshUnit.m') },
    { value: 'h', label: t('trackers.refreshUnit.h') },
  ]

  return (
    <NForm
      id='tracker-form'
      schema={schema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput
          name='deviceId'
          type='text'
          formLabel={t('trackers.form.deviceId')}
          placeholder={t('trackers.form.deviceIdPlaceholder')}
          variant='default'
          icon={Smartphone}
        />
        <FormInput
          name='name'
          type='text'
          formLabel={t('trackers.form.name')}
          placeholder={t('trackers.form.namePlaceholder')}
          variant='default'
          icon={Tag}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput
          name='vehicleId'
          type='select'
          formLabel={t('trackers.form.vehicle')}
          variant='default'
          icon={Truck}
          items={vehicleOptions}
          placeholder={t('trackers.form.vehiclePlaceholder')}
        />
        <FormInput
          name='status'
          type='select'
          formLabel={t('trackers.form.status')}
          variant='default'
          icon={Settings}
          items={statusOptions}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput
          name='manufacturer'
          type='text'
          formLabel={t('trackers.form.manufacturer')}
          placeholder={t('trackers.form.manufacturerPlaceholder')}
          variant='default'
          icon={Factory}
        />
        <FormInput
          name='mode'
          type='select'
          formLabel={t('trackers.form.mode')}
          variant='default'
          icon={Radio}
          items={modeOptions}
        />
      </div>

     <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput
          name='refreshInterval'
          type='number'
          formLabel={t('trackers.form.refreshInterval')}
          placeholder={t('trackers.form.refreshIntervalPlaceholder')}
          variant='default'
          icon={Timer}
        />
        <FormInput
          name='refreshUnit'
          type='select'
          formLabel={t('trackers.form.refreshUnit')}
          variant='default'
          icon={Clock}
          items={refreshUnitOptions}
        />
      </div>

      {isUpdateMode && tracker?.vehicleName && (
        <div className="rounded-lg border p-4 ">
          <h4 className="text-sm font-medium mb-2">{t('trackers.form.assignedVehicle')}</h4>
          <div className="text-sm text-gray-600">
            <div><strong>{t('trackers.form.vehicleName')}:</strong> {tracker.vehicleName}</div>
            {tracker.vehicleBrand && tracker.vehicleModel && (
              <div><strong>{t('trackers.form.vehicleModel')}:</strong> {tracker.vehicleBrand} {tracker.vehicleModel}</div>
            )}
            {tracker.vehicleLicensePlate && (
              <div><strong>{t('trackers.form.vehicleLicensePlate')}:</strong> {tracker.vehicleLicensePlate}</div>
            )}
          </div>
        </div>
      )}
    </NForm>
  )
}

export default TrackerForm