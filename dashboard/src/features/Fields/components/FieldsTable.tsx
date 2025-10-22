"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { fieldsTableConfig } from '../config/fieldsTableConfig';
import { useDialogStore } from '@/stores/DialogStore';
import FieldForm from './FieldForm';
import { useFields } from '../hooks/useFields';
import DeleteConfirmation from '@/components/NDeleteConf';
import { useTranslation } from '@/hooks/useLanguage';
import FieldCard from './FieldCard';
import FieldFormWithMap from './FieldForm';
import FieldView from './FieldView';

function FieldsTable() {
  const { t } = useTranslation();

  const config = fieldsTableConfig(t);

  const {
    fields,
    createField,
    updateField,
    deleteField,
    isFieldsLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useFields();

  const { openDialog } = useDialogStore();
  
  const handleAddClick = () => {
    openDialog({
      title: t('fields.dialogs.createTitle'),
      children: <FieldFormWithMap />,
      primaryButton: {
        form: 'field-form',
        text: t('fields.dialogs.createButton'),
        loading: isCreating,
        onConfirm: async (fieldData) => {
          await createField(fieldData);
        }
      }
    });
  };

  const handleView = (field) => {
    openDialog({
      title: t('fields.dialogs.viewTitle'),
      children: <FieldView fieldId={field.id} />,
      showButtons: false,
    });
  };

  const handleEdit = (field) => {
    openDialog({
      title: `${t('fields.dialogs.editTitle')} - ${field.name}`,
      children: <FieldForm field={field} />,
      primaryButton: {
        form: 'field-form',
        text: t('fields.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (fieldData) => {
          await updateField(fieldData);
        }
      }
    });
  };

  const handleDelete = (field) => {
    openDialog({
      children: <DeleteConfirmation itemName={field.name || field.id} />,
      primaryButton: {
        text: t('fields.dialogs.deleteButton'),
        variant: 'destructive',
        loading: isDeleting,
        form: 'delete-form',
        onConfirm: async () => {
          await deleteField(field.id);
        }
      }
    });
  };

  return (
    <NTable
      data={fields}
      columns={config.columns}
      filters={config.filters}
      onAddClick={handleAddClick}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isFieldsLoading}
      CardComponent={FieldCard}
      addButtonText={t('fields.dialogs.createButton')}
      viewMode='card'
    />
  );
}

export default FieldsTable;