"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { rolesTableConfig } from '../config/rolesTableConfig';
import { useDialogStore } from '@/stores/DialogStore';
import RoleForm from './RoleForm';
import { useRoles } from '../hooks/useRoles';
import DeleteConfirmation from '@/components/NDeleteConf';
import { useTranslation } from '@/hooks/useLanguage';
import RoleCard from './RoleCard';

function RolesTable() {

  const { t } = useTranslation();
  const config = rolesTableConfig(t);

  const {
    roles,
    createRole,
    updateRole,
    deleteRole,
    isRolesLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useRoles();

  const { openDialog } = useDialogStore();

  const handleAddClick = () => {
    openDialog({
      title: t('roles.dialogs.createTitle'),
      children: <RoleForm />,
      primaryButton: {
        form: 'role-form',
        text: t('roles.dialogs.createButton'),
        loading: isCreating,
        onConfirm: async (roleData) => {
          await createRole(roleData);
        }
      }
    });
  };

  const handleView = (role) => {
    openDialog({
      title: t('roles.dialogs.viewTitle'),
      children: <RoleForm role={role} />,
      showButtons: false,
    });
  };

  const handleEdit = (role) => {
    openDialog({
      title: `${t('roles.dialogs.editTitle')} - ${role.name}`,
      children: <RoleForm role={role} />,
      primaryButton: {
        form: 'role-form',
        text: t('roles.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (roleData) => {
          await updateRole(roleData);
        }
      }
    });
  };

  const handleDelete = (role) => {
    openDialog({
      children: <DeleteConfirmation itemName={role.name} />,
      primaryButton: {
        text: t('roles.dialogs.deleteButton'),
        variant: 'destructive',
        loading: isDeleting,
        form: 'delete-form',
        onConfirm: async () => {
          await deleteRole(role.id);
        }
      }
    });
  };

  return (
      <NTable
        data={roles}
        columns={config.columns}
        filters={config.filters}
        onAddClick={handleAddClick}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isRolesLoading}
        CardComponent={RoleCard}
        addButtonText={t('roles.dialogs.createButton')}
      />
  );
}

export default RolesTable;