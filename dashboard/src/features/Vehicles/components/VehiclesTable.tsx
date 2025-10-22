"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { vehiclesTableConfig } from '../config/vehiclesTableConfig';
import { useDialogStore } from '@/stores/DialogStore';
import VehicleForm from './VehicleForm';
import { useVehicles } from '../hooks/useVehicles';
import DeleteConfirmation from '@/components/NDeleteConf';
import { useTranslation } from '@/hooks/useLanguage';
import VehicleCard from './VehicleCard';
import VehicleView from './VehicleView';

function VehiclesTable() {
  const { t } = useTranslation();

  const {
    vehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    isVehiclesLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useVehicles();

  const { openDialog } = useDialogStore();
  const config = vehiclesTableConfig(t);


  const handleAddClick = () => {
    openDialog({
      title: t('vehicles.dialogs.createTitle'),
      children: <VehicleForm />,
      primaryButton: {
        form: 'vehicle-form',
        text: t('vehicles.dialogs.createButton'),
        loading: isCreating,
        loadingText: t('common.loadingCreate'),
        onConfirm: async (vehicleData) => {
          await createVehicle(vehicleData);
        }
      }
    });
  };

  const handleView = (vehicle) => {
    openDialog({
      title: t('vehicles.dialogs.viewTitle'),
      children: <VehicleView vehicleId={vehicle.id} />,
      showButtons: false,
    });
  };

  const handleEdit = (vehicle) => {
    openDialog({
      title: `${t('vehicles.dialogs.editTitle')} - ${vehicle.name}`,
      children: <VehicleForm vehicle={vehicle}/>,
      primaryButton: {
        form: 'vehicle-form',
        text: t('vehicles.dialogs.updateButton'),
        loading: isUpdating,
        loadingText: t('common.loadingUpdate'),
        onConfirm: async (vehicleData) => {
         await updateVehicle(vehicleData);
        }
      }
    });
  };

  const handleDelete = (vehicle) => {
    openDialog({
      children: <DeleteConfirmation itemName={vehicle.name} />,
      primaryButton: {
        text: t('vehicles.dialogs.deleteButton'),
        variant: 'destructive',
        loading: isDeleting,
        loadingText: t('common.loadingDelete'),
        form: 'delete-form',
        onConfirm: async () => {
          await deleteVehicle(vehicle.id);
        }
      }
    });
  };

  return (
  
      <NTable
        data={vehicles}
        columns={config.columns}
        filters={config.filters}
        onAddClick={handleAddClick}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isVehiclesLoading}
        CardComponent={VehicleCard}
        addButtonText={t('vehicles.dialogs.createButton')}
        viewMode='card'
      />
 
  );
}

export default VehiclesTable;