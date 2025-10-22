"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { usersTableConfig } from '../config/usersTableConfig';
import { useDialogStore } from '@/stores/DialogStore';
import UserForm from './UserForm';
import { useUsers } from '../hooks/useUsers';
import DeleteConfirmation from '@/components/NDeleteConf';
import { useTranslation } from '@/hooks/useLanguage';
import UserCard from './UserCard';

function UsersTable() {

  const { t } = useTranslation();
  const config = usersTableConfig(t);

  const {
    users,
    createUser,
    updateUser,
    deleteUser,
    isUsersLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useUsers();

  const { openDialog } = useDialogStore();

  const handleAddClick = () => {
    openDialog({
      title: t('users.dialogs.createTitle'),
      children: <UserForm />,
      primaryButton: {
        form: 'user-form',
        text: t('users.dialogs.createButton'),
        loading: isCreating,
        onConfirm: async (userData) => {
          await createUser(userData);
        }
      }
    });
  };

  const handleView = (user) => {
    openDialog({
      title: t('users.dialogs.viewTitle'),
      children: <UserForm user={user} />,
      showButtons: false,
    });
  };

  const handleEdit = (user) => {
    openDialog({
      title: `${t('users.dialogs.editTitle')} - ${user.name}`,
      children: <UserForm user={user} />,
      primaryButton: {
        form: 'user-form',
        text: t('users.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (userData) => {
          await updateUser(userData);
        }
      }
    });
  };

  const handleDelete = (user) => {
    openDialog({
      children: <DeleteConfirmation itemName={user.name} />,
      primaryButton: {
        text: t('users.dialogs.deleteButton'),
        variant: 'destructive',
        loading: isDeleting,
        form: 'delete-form',
        onConfirm: async () => {
          await deleteUser(user.id);
        }
      }
    });
  };

  return (
      <NTable
        data={users}
        columns={config.columns}
        filters={config.filters}
        onAddClick={handleAddClick}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isUsersLoading}
        CardComponent={UserCard}
        addButtonText={t('users.dialogs.createButton')}
        viewMode='card'
      />
    );
}

export default UsersTable;