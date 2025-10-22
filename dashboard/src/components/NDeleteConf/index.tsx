'use client'

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useDialogStore } from '@/stores/DialogStore';

interface DeleteConfirmationProps {
    itemName: string;
    itemType?: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ itemName }) => {

    const { handleConfirm } = useDialogStore();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        handleConfirm();
    }

    return (
        <form id="delete-form" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-200">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                <div className="text-center">
                    <p className="text-muted-foreground mb-2">
                        Are you sure you want to delete <strong>{itemName}</strong>?
                    </p>
                    <p className="text-sm text-muted-foreground">
                        This action cannot be undone.
                    </p>
                </div>
            </div>
        </form>
    );
};

export default DeleteConfirmation;