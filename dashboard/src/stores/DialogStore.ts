// ====== DialogStore.ts (Clean Rewrite with onConfirm) ======
import { create } from 'zustand';
import { ReactNode } from 'react';
import { useMultiStepFormStore } from './MultiStepFormStore'

interface ButtonConfig {
  form?: string;
  text: string;
  variant?: 'default' | 'destructive' | 'secondary' | 'outline';
  icon?: string;
  loadingText?: string;
  onClick?: (data?: any) => void | Promise<void>;
  onConfirm?: (data?: any) => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

interface DialogState {
  isOpen: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
  showButtons: boolean;
  className?: string;

  openDialog: (config: {
    title?: string;
    description?: string;
    children?: ReactNode;
    primaryButton?: Partial<ButtonConfig>;
    secondaryButton?: Partial<ButtonConfig>;
    showButtons?: boolean;
    className?: string;
  }) => void;
  closeDialog: () => void;

  setPrimaryLoading: (loading: boolean) => void;
  setSecondaryLoading: (loading: boolean) => void;

  updatePrimaryButton: (config: Partial<ButtonConfig>) => void;
  updateSecondaryButton: (config: Partial<ButtonConfig>) => void;
  updateShowButtons: (show: boolean) => void;

  handlePrimaryClick: (data?: any) => Promise<void>;
  handleConfirm: (data?: any) => Promise<void>;
  handleSecondaryClick: (data?: any) => Promise<void>;
  handleOpenChange: (open: boolean) => void;
  handleCancel: () => Promise<void>;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  isOpen: false,
  title: '',
  description: undefined,
  children: undefined,
  primaryButton: {
    text: 'Confirm',
    variant: 'default',
    loading: false,
    disabled: false,
    loadingText: 'Processing...',
    icon: 'check',
  },
  secondaryButton: {
    text: 'Cancel',
    variant: 'secondary',
    loading: false,
    disabled: false,
    loadingText: 'Processing...',
    icon: 'x',
  },
  showButtons: true,
  className: undefined,

  openDialog: (config) => {
    const MultiStepFormStore = useMultiStepFormStore.getState();
    MultiStepFormStore.reset?.();
    const primaryButtonConfig = {
      text: 'Confirm',
      variant: 'default' as const,
      loading: false,
      disabled: false,
      loadingText: 'Processing...',
      icon: 'check',
      ...config.primaryButton,
    };

    const secondaryButtonConfig = {
      text: 'Cancel',
      variant: 'secondary' as const,
      loading: false,
      disabled: false,
      loadingText: 'Processing...',
      icon: 'x',
      ...config.secondaryButton,
    };

    set({
      isOpen: true,
      title: config.title,
      description: config.description,
      children: config.children,
      primaryButton: primaryButtonConfig,
      secondaryButton: secondaryButtonConfig,
      showButtons: config.showButtons ?? true,
      className: config.className,
    });
  },

  closeDialog: () => set({
    isOpen: false,
    title: '',
    description: undefined,
    children: undefined,
    primaryButton: {
      text: 'Confirm',
      variant: 'default',
      loading: false,
      disabled: false,
      loadingText: 'Processing...',
      icon: 'check',
    },
    secondaryButton: {
      text: 'Cancel',
      variant: 'secondary',
      loading: false,
      disabled: false,
      loadingText: 'Processing...',
      icon: 'x',
    },
    showButtons: true,
    className: undefined,
  }),

  setPrimaryLoading: (loading) => set((state) => ({
    primaryButton: state.primaryButton ? { ...state.primaryButton, loading } : undefined
  })),

  setSecondaryLoading: (loading) => set((state) => ({
    secondaryButton: state.secondaryButton ? { ...state.secondaryButton, loading } : undefined
  })),

  updatePrimaryButton: (config) => set((state) => ({
    primaryButton: state.primaryButton ? {
      ...state.primaryButton,
      ...config,
    } : undefined
  })),

  updateSecondaryButton: (config) => set((state) => ({
    secondaryButton: state.secondaryButton ? {
      ...state.secondaryButton,
      ...config,
    } : undefined
  })),

  updateShowButtons: (show) => set({ showButtons: show }),

  handlePrimaryClick: async (data) => {
    const { primaryButton,setPrimaryLoading } = get();
    if (primaryButton?.onConfirm) {
      setPrimaryLoading(true);
      try {
        await primaryButton.onConfirm(data);
      } finally {
        setPrimaryLoading(false);
      }
    } else if (primaryButton?.onClick) {
      setPrimaryLoading(true);
      try {
        await primaryButton.onClick(data);
      } finally {
        setPrimaryLoading(false);
      }
    }
  },

  handleConfirm: async (data) => {
    const { primaryButton, setPrimaryLoading, closeDialog } = get();
    if (primaryButton.onConfirm) {
      setPrimaryLoading(true);
      try {
        await primaryButton.onConfirm(data);
        closeDialog();
      } finally {
        setPrimaryLoading(false);
      }
    }
  },

  handleSecondaryClick: async (data) => {
    const { secondaryButton, closeDialog } = get();
    if (secondaryButton?.form && secondaryButton?.onConfirm) {
      await secondaryButton.onConfirm(data);
    } else if (secondaryButton?.onClick) {
      await secondaryButton.onClick(data);
    } else {
      closeDialog();
    }
  },

  handleOpenChange: (open) => {
    if (!open) {
      const { secondaryButton, closeDialog } = get();
      if (secondaryButton?.onClick) secondaryButton.onClick();
      closeDialog();
    }
  },

  handleCancel: async () => {
    const { closeDialog } = get();
    closeDialog();
  },
}));