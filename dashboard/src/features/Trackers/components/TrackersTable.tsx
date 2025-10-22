"use client"

import NTable from '@/components/NTable';
import React, { useState } from 'react';
import { trackersTableConfig } from '../config/trackersTableConfig';
import { useDialogStore } from '@/stores/DialogStore';
import TrackerForm from './TrackerForm';
import { useTrackers } from '../hooks/useTrackers';
import DeleteConfirmation from '@/components/NDeleteConf';
import { useVehicles } from '@/features/Vehicles/hooks/useVehicles';
import { useTranslation } from '@/hooks/useLanguage';
import TrackerViewCard from './TrackerViewCard';
import TrackerCard from './TrackerCard';

function TrackersTable() {
  const { t } = useTranslation();
  const config = trackersTableConfig(t);

  const {
    trackers,
    createTracker,
    updateTracker,
    deleteTracker,
    isTrackersLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useTrackers();

  const { openDialog } = useDialogStore();
  const { vehicles } = useVehicles();

  const handleAddClick = () => {
    openDialog({
      title: t('trackers.dialogs.createTitle'),
      children: <TrackerForm vehicles={vehicles} />,
      primaryButton: {
        form: 'tracker-form',
        text: t('trackers.dialogs.createButton'),
        loading: isCreating,
        onConfirm: async (trackerData) => {
          await createTracker(trackerData);
        }
      }
    });
  };

  const handleView = (tracker) => {
    openDialog({
      title: t('trackers.dialogs.viewTitle'),
      children: <TrackerViewCard trackerId={tracker.id} />,
      showButtons: false,
    });
  };

  const handleEdit = (tracker) => {
    openDialog({
      title: `${t('trackers.dialogs.editTitle')} - ${tracker?.name}`,
      children: <TrackerForm tracker={tracker} vehicles={vehicles} />,
      primaryButton: {
        form: 'tracker-form',
        text: t('trackers.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (trackerData) => {
          await updateTracker({ ...trackerData, id: tracker.id });
        }
      }
    });
  };

  const handleDelete = (tracker) => {
    openDialog({
      children: <DeleteConfirmation itemName={tracker.name || tracker.deviceId} />,
      primaryButton: {
        text: t('trackers.dialogs.deleteButton'),
        variant: 'destructive',
        loading: isDeleting,
        form: 'delete-form',
        onConfirm: async () => {
          await deleteTracker(tracker.id);
        }
      }
    });
  };

  return (
    <NTable
      data={trackers}
      columns={config.columns}
      filters={config.filters}
      onAddClick={handleAddClick}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isTrackersLoading}
      CardComponent={TrackerCard}
    />
  );
} 

export default TrackersTable;