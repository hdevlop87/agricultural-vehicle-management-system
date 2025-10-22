"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { refuelsTableConfig } from '../config/refuelsTableConfig';
import { useDialogStore } from '@/stores/DialogStore';
import RefuelForm from './RefuelForm';
import { useRefuels } from '../hooks/useRefuels';
import DeleteConfirmation from '@/components/NDeleteConf';
import { useTranslation } from '@/hooks/useLanguage';
import { useVehicles } from '@/features/Vehicles/hooks/useVehicles';
import { useOperators } from '@/features/Operators/hooks/useOperators';
import RefuelCard from './RefuelCard';
import RefuelView from './RefuelView';

function RefuelsTable() {

  const { t } = useTranslation();
  const config = refuelsTableConfig(t);
  const { vehicles } = useVehicles();
  const { operators } = useOperators();

  const {
    refuels,
    createRefuel,
    updateRefuel,
    deleteRefuel,
    isRefuelsLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useRefuels();

  const { openDialog } = useDialogStore();


  const handleAddClick = () => {
    openDialog({
      title: t('refuels.dialogs.createTitle'),
      children: <RefuelForm  vehicles={vehicles} operators={operators} />,
      primaryButton: {
        form: 'refuel-form',
        text: t('refuels.dialogs.createButton'),
        loading: isCreating,
        loadingText: t('common.loadingCreate'),
        onConfirm: async (refuelData) => {
          await createRefuel(refuelData);
        }
      }
    });
  };

  const handleView = (refuel) => {
    openDialog({
      title: t('refuels.dialogs.viewTitle'),
      children: <RefuelView refuelId={refuel.id}  />,
      showButtons: false,
    });
  };

  const handleEdit = (refuel) => {
    openDialog({
      title: `${t('refuels.dialogs.editTitle')} - ${refuel.vehicle?.name || refuel.id}`,
      children: <RefuelForm refuel={refuel} vehicles={vehicles} operators={operators} />,
      primaryButton: {
        form: 'refuel-form',
        text: t('refuels.dialogs.updateButton'),
        loading: isUpdating,
        loadingText: t('common.loadingUpdate'),
        onConfirm: async (refuelData) => {
          await updateRefuel(refuelData);
        }
      }
    });
  };

  const handleDelete = (refuel) => {
    openDialog({
      children: <DeleteConfirmation itemName={`${t('refuels.dialogs.deleteConfirmation')} ${refuel.vehicle?.name}` || refuel.id} />,
      primaryButton: {
        text: t('refuels.dialogs.deleteButton'),
        variant: 'destructive',
        loading: isDeleting,
        loadingText: t('common.loadingDelete'),
        form: 'delete-form',
        onConfirm: async () => {
          await deleteRefuel(refuel.id);
        }
      }
    });
  };

  return (

    <NTable
      data={refuels}
      columns={config.columns}
      filters={config.filters}
      onAddClick={handleAddClick}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isRefuelsLoading}
      CardComponent={RefuelCard}
      addButtonText={t('refuels.dialogs.createButton')}
    />

  );
}

export default RefuelsTable;