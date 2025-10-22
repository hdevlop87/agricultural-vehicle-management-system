"use client";

import React, { useEffect, useState } from 'react';
import { useActiveOperation } from '../hooks/useActiveOperation';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, X, MapPin, Clock, Truck } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useUpdateLocation } from '@/features/Trackers/hooks/useUpdateLocation';

interface AutoResumeTrackingProps {
  onOpenOperation?: (operation: any) => void;
}

export const AutoResumeTracking: React.FC<AutoResumeTrackingProps> = ({
  onOpenOperation
}) => {
  const { data: activeOperation, isLoading } = useActiveOperation();
  const { isOperator, user } = useRoleGuard();
  const [showDialog, setShowDialog] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check if user is the assigned operator
  const isAssignedOperator = user?.id === activeOperation?.operator?.userId;
  const canTrackLocation = isOperator() && isAssignedOperator && activeOperation?.tracker?.deviceId;

  // Initialize location tracker for the active operation
  const locationTracker = useUpdateLocation({
    deviceId: canTrackLocation ? activeOperation?.tracker?.deviceId : null,
    interval: activeOperation?.tracker?.refreshInterval || 30000
  });

  useEffect(() => {
    // Show dialog if there's an active operation, user is operator, and hasn't been dismissed
    if (activeOperation && isOperator() && isAssignedOperator && !dismissed && !isLoading) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        setShowDialog(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeOperation, isOperator, isAssignedOperator, dismissed, isLoading]);

  const handleResumeTracking = () => {
    if (canTrackLocation) {
      locationTracker.startTracking();
    }

    // Open operation view if callback provided
    if (onOpenOperation) {
      onOpenOperation(activeOperation);
    }

    setShowDialog(false);
    setDismissed(true);
  };

  const handleViewOnly = () => {
    // Open operation view without starting tracking
    if (onOpenOperation) {
      onOpenOperation(activeOperation);
    }

    setShowDialog(false);
    setDismissed(true);
  };

  const handleDismiss = () => {
    setShowDialog(false);
    setDismissed(true);
  };

  // Don't show if not an operator or no active operation
  if (!activeOperation || !isOperator() || !isAssignedOperator) {
    return null;
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-green-500" />
            Active Operation Detected
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            You have an operation currently in progress:
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-lg">{activeOperation.operationType}</div>
              <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Active
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Field:</span>
                <span className="font-medium">{activeOperation.field?.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Vehicle:</span>
                <span className="font-medium">{activeOperation.vehicle?.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Started:</span>
                <span className="font-medium">
                  {activeOperation.startTime ? formatDate(activeOperation.startTime) : 'Unknown'}
                </span>
              </div>
            </div>

            {activeOperation.tracker?.deviceId && (
              <div className="mt-3 pt-3 border-t border-muted">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-muted-foreground">Location tracking available</span>
                </div>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            Would you like to continue with this operation?
          </div>

          <div className="flex flex-col gap-2">
            {canTrackLocation && (
              <Button onClick={handleResumeTracking} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Resume with Location Tracking
              </Button>
            )}

            <Button variant="outline" onClick={handleViewOnly} className="w-full">
              <Truck className="h-4 w-4 mr-2" />
              View Operation Only
            </Button>

            <Button variant="ghost" onClick={handleDismiss} className="w-full">
              <X className="h-4 w-4 mr-2" />
              Dismiss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};