"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { operatorsTableConfig } from '../config/operatorsTableConfig';
import { useDialogStore } from '@/stores/DialogStore';
import OperatorForm from './OperatorForm';
import OperatorCard from './OperatorCard';
import { useOperators } from '../hooks/useOperators';
import DeleteConfirmation from '@/components/NDeleteConf';
import { useTranslation } from '@/hooks/useLanguage';
import OperatorView from './OperatorView';

function OperatorsTable() {

  const { t } = useTranslation();
  const config = operatorsTableConfig(t);

  const {
    operators,
    createOperator,
    updateOperator,
    deleteOperator,
    isOperatorsLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useOperators();

  const { openDialog } = useDialogStore();


  const handleAddClick = () => {
    openDialog({
      title: t('operators.dialogs.createTitle'),
      children: <OperatorForm />,
      primaryButton: {
        form: 'operator-form',
        text: t('operators.dialogs.createButton'),
        loading: isCreating,
        loadingText: t('common.loadingCreate'),
        onConfirm: async (operatorData) => {
          await createOperator(operatorData);
        }
      }
    });
  };

  const handleView = (operator) => {
    openDialog({
      title: t('operators.dialogs.viewTitle'),
      children: <OperatorView operatorId={operator.id} />,
      showButtons: false,
    });
  };

  const handleEdit = (operator) => {
    openDialog({
      title: `${t('operators.dialogs.editTitle')} - ${operator?.name}`,
      children: <OperatorForm operator={operator}/>,
      primaryButton: {
        form: 'operator-form',
        text: t('operators.dialogs.updateButton'),
        loading: isUpdating,
        loadingText: t('common.loadingUpdate'),
        onConfirm: async (operatorData) => {
          await updateOperator(operatorData);
        }
      }
    });
  };

  const handleDelete = (operator) => {
    openDialog({
      children: <DeleteConfirmation itemName={operator.user?.name || operator.id} />,
      primaryButton: {
        text: t('operators.dialogs.deleteButton'),
        variant: 'destructive',
        loading: isDeleting,
        loadingText: t('common.loadingDelete'),
        form: 'delete-form',
        onConfirm: async () => {
          await deleteOperator(operator.id);
        }
      }
    });
  };

  return (
  
      <NTable
        data={operators}
        columns={config.columns}
        filters={config.filters}
        onAddClick={handleAddClick}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isOperatorsLoading}
        CardComponent={OperatorCard}
        viewMode='cards'
        showPagination={false}
        addButtonText={t('operators.dialogs.createButton')}
      />
 
  );
}

export default OperatorsTable;