'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as trackerApi from '@/services/trackerApi';

export const useTrackers = (enabled = true) => {
  const crud = useEntityCRUD('trackers', {
    getAll: trackerApi.getTrackersApi,
    create: trackerApi.createTrackerApi,
    update: trackerApi.updateTrackerApi,
    delete: trackerApi.deleteTrackerApi,
  });

  const { data: trackers, isLoading: isTrackersLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createTracker, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateTracker, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteTracker, isLoading: isDeleting } = crud.useDelete();

  return {
    trackers,
    isTrackersLoading,
    isError,
    error,
    refetch,
    createTracker,
    updateTracker,
    deleteTracker,
    isCreating,
    isUpdating,
    isDeleting,
  };
};


