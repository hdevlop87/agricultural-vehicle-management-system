"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { maintenanceTableConfig } from '../config/maintenanceTableConfig';
import { useDialogStore } from '@/stores/DialogStore';
import MaintenanceForm from './MaintenanceForm';
import { useMaintenance } from '../hooks/useMaintenance';
import DeleteConfirmation from '@/components/NDeleteConf';
import { useTranslation } from '@/hooks/useLanguage';
import MaintenanceCard from './MaintenanceCard';
import { useVehicles } from '@/features/Vehicles/hooks/useVehicles';
import MaintenanceView from './MaintenanceView';

function MaintenanceTable() {
  const { t } = useTranslation();
    const { vehicles } = useVehicles();
  const {
    maintenances,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    isMaintenancesLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useMaintenance();

  const { openDialog } = useDialogStore();
  const config = maintenanceTableConfig(t);


  const handleAddClick = () => {
    openDialog({
      title: t('maintenance.dialogs.createTitle'),
      children: <MaintenanceForm vehicles={vehicles}/>,
      primaryButton: {
        form: 'maintenance-form',
        text: t('maintenance.dialogs.createButton'),
        loading: isCreating,
        loadingText: t('common.loadingCreate'),
        onConfirm: async (maintenanceData) => {
          await createMaintenance(maintenanceData);
        }
      }
    });
  };

  const handleView = (maintenance) => {
    openDialog({
      title: t('maintenance.dialogs.viewTitle'),
      children: <MaintenanceView maintenanceId={maintenance.id}/>,
      showButtons: false,
    });
  };

  const handleEdit = (maintenance) => {
    openDialog({
      title: `${t('maintenance.dialogs.editTitle')} - ${maintenance.title}`,
      children: <MaintenanceForm maintenance={maintenance} vehicles={vehicles}/>,
      primaryButton: {
        form: 'maintenance-form',
        text: t('maintenance.dialogs.updateButton'),
        loading: isUpdating,
        loadingText: t('common.loadingUpdate'),
        onConfirm: async (maintenanceData) => {
          await updateMaintenance(maintenanceData);
        }
      }
    });
  };

  const handleDelete = (maintenance) => {
    openDialog({
      children: <DeleteConfirmation itemName={maintenance.title} />,
      primaryButton: {
        text: t('maintenance.dialogs.deleteButton'),
        variant: 'destructive',
        loading: isDeleting,
        loadingText: t('common.loadingDelete'),
        form: 'delete-form',
        onConfirm: async () => {
          await deleteMaintenance(maintenance.id);
        }
      }
    });
  };

  return (
  
      <NTable
        data={maintenances}
        columns={config.columns}
        filters={config.filters}
        onAddClick={handleAddClick}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isMaintenancesLoading}
        CardComponent={MaintenanceCard}
        addButtonText={t('maintenance.dialogs.createButton')}
      />
 
  );
}

export default MaintenanceTable;