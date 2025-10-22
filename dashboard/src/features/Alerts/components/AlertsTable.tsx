"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { alertsTableConfig } from '../config/alertsTableConfig';
import { useDialogStore } from '@/stores/DialogStore';
import AlertForm from './AlertForm';
import { useAlerts } from '../hooks/useAlerts';
import DeleteConfirmation from '@/components/NDeleteConf';
import { useTranslation } from '@/hooks/useLanguage';
import AlertCard from './AlertCard';
import { useVehicles } from '@/features/Vehicles/hooks/useVehicles';
import { useOperators } from '@/features/Operators/hooks/useOperators';

function AlertsTable() {
  const { t } = useTranslation();
    const { vehicles } = useVehicles();
    const { operators } = useOperators();
  const {
    alerts,
    createAlert,
    updateAlert,
    deleteAlert,
    isAlertsLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useAlerts();

  const { openDialog } = useDialogStore();
  const config = alertsTableConfig(t);


  const handleAddClick = () => {
    openDialog({
      title: t('alerts.dialogs.createTitle'),
      children: <AlertForm vehicles={vehicles} operators={operators}/>,
      primaryButton: {
        form: 'alert-form',
        text: t('alerts.dialogs.createButton'),
        loading: isCreating,
        loadingText: t('common.loadingCreate'),
        onConfirm: async (alertData) => {
          await createAlert(alertData);
        }
      }
    });
  };

  const handleView = (alert) => {
    openDialog({
      title: t('alerts.dialogs.viewTitle'),
      children: <AlertForm alert={alert} vehicles={vehicles} operators={operators}/>,
      showButtons: false,
    });
  };

  const handleEdit = (alert) => {
    openDialog({
      title: `${t('alerts.dialogs.editTitle')} - ${alert.title}`,
      children: <AlertForm alert={alert} vehicles={vehicles} operators={operators}/>,
      primaryButton: {
        form: 'alert-form',
        text: t('alerts.dialogs.updateButton'),
        loading: isUpdating,
        loadingText: t('common.loadingUpdate'),
        onConfirm: async (alertData) => {
          await updateAlert(alertData);
        }
      }
    });
  };

  const handleDelete = (alert) => {
    openDialog({
      children: <DeleteConfirmation itemName={alert.title} />,
      primaryButton: {
        text: t('alerts.dialogs.deleteButton'),
        variant: 'destructive',
        loading: isDeleting,
        loadingText: t('common.loadingDelete'),
        form: 'delete-form',
        onConfirm: async () => {
          await deleteAlert(alert.id);
        }
      }
    });
  };

  return (
  
      <NTable
        data={alerts}
        columns={config.columns}
        filters={config.filters}
        onAddClick={handleAddClick}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isAlertsLoading}
        CardComponent={AlertCard}
        addButtonText={t('alerts.dialogs.createButton')}
      />
 
  );
}

export default AlertsTable;