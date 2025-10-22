"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { operationsTableConfig } from '../config/operationsTableConfig';
import { useDialogStore } from '@/stores/DialogStore';
import OperationForm from './OperationForm';
import { useOperations } from '../hooks/useOperations';
import DeleteConfirmation from '@/components/NDeleteConf';
import { useVehicles } from '../../Vehicles/hooks/useVehicles'
import { useOperators } from '../../Operators/hooks/useOperators'
import { useFields } from '../../Fields/hooks/useFields'
import { useOperationsType } from '../hooks/useOperations'
import { useTranslation } from '@/hooks/useLanguage';
import OperationCard from './OperationCard';
import { OperationViewCard } from './OperationViewCard';

function OperationsTable() {

  const { t } = useTranslation();
  const config = operationsTableConfig(t);

  const {
    operations,
    createOperation,
    updateOperation,
    deleteOperation,
    isOperationsLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useOperations();

  const { openDialog } = useDialogStore();
  const { vehicles } = useVehicles();
  const { operators } = useOperators();
  const { fields } = useFields();
  const { operationsType } = useOperationsType();

  const handleAddClick = () => {
    openDialog({
      title: t('operations.dialogs.createTitle'),
      children: <OperationForm vehicles={vehicles} operators={operators} fields={fields} operationsType={operationsType}/>,
      primaryButton: {
        form: 'operation-form',
        text: t('operations.dialogs.createButton'),
        loading: isCreating,
        loadingText: t('common.loadingCreate'),
        onConfirm: async (operationData) => {
          await createOperation(operationData);
        }
      }
    });
  };

  const handleView = (operation) => {
    openDialog({
      title: t('operations.dialogs.viewTitle'),
      children: <OperationViewCard operation={operation} />,
      showButtons: false,
    });
  };

  const handleEdit = (operation) => {
    openDialog({
      title: `${t('operations.dialogs.editTitle')} - ${operation.operationType}`,
      children: <OperationForm operation={operation} vehicles={vehicles} operators={operators} fields={fields} operationsType={operationsType}/>,
      primaryButton: {
        form: 'operation-form',
        text: t('operations.dialogs.updateButton'),
        loading: isUpdating,
        loadingText: t('common.loadingUpdate'),
        onConfirm: async (operationData) => {
          await updateOperation(operationData);
        }
      }
    });
  };

  const handleDelete = (operation) => {
    openDialog({
      children: <DeleteConfirmation itemName={`${operation?.operationType} ${t('operations.dialogs.deleteConfirmation')}` || operation.id} />,
      primaryButton: {
        text: t('operations.dialogs.deleteButton'),
        variant: 'destructive',
        loading: isDeleting,
        loadingText: t('common.loadingDelete'),
        form: 'delete-form',
        onConfirm: async () => {
          await deleteOperation(operation.id);
        }
      }
    });
  };

  return (

      <NTable
        data={operations}
        columns={config.columns}
        filters={config.filters}
        onAddClick={handleAddClick}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isOperationsLoading}
        CardComponent={OperationCard}
        addButtonText={t('operations.dialogs.createButton')}
      />
  
  );
}

export default OperationsTable;