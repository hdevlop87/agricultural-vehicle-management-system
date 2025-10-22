import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from 'zod'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const dateField = (message?: string, required: boolean = false) => {
  const errorMessage = message !== undefined ? message : "Invalid date";

  const baseSchema = z.union([z.string(), z.date()])
    .refine(val => {
      if (!required && (!val || val === "")) return true;
      return !isNaN(new Date(val).getTime());
    }, {
      message: errorMessage
    })
    .transform(val => val && val !== "" ? new Date(val) : undefined);

  return required ? baseSchema : baseSchema.optional();
};

// Date formatting utilities
export const formatDate = (date: string, t: (key: string) => string): string => {
  if (!date) return t('common.notAvailable');
  try {
    return format(new Date(date), 'MMM dd, yyyy');
  } catch (error) {
    return t('common.invalidDate');
  }
};


export const formatTime = (timeString: string) => {
  if (!timeString) return '--:--';
  return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTimeRange = (startTime?: string, endTime?: string): string => {
  if (!startTime) return '';

  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = endTime ? formatTime(endTime) : '';

  return formattedEndTime ? `${formattedStartTime} - ${formattedEndTime}` : formattedStartTime;
};

// Currency formatting utility
export const formatCurrency = (amount: string | number, currency: string = 'USD'): string => {
  if (!amount || amount === '' || isNaN(Number(amount))) return '--';

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(parseFloat(amount.toString()));
  } catch (error) {
    return '--';
  }
};

export const formatDuration = (startTime: string, endTime: string) => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export const formatArea = (area, t) => {
  if (!area) return t('common.notAvailable');
  return `${parseFloat(area).toFixed(2)}`;
};

export const formatCoordinates = (location,t) => {
  if (!location || !location.lat || !location.lng) {
    return t('common.notAvailable');
  }
  return `${parseFloat(location.lat).toFixed(4)}, ${parseFloat(location.lng).toFixed(4)}`;
};


// Status and priority color utilities
export const getPriorityColor = (priority: string): string => {
  const map = {
    high: 'bg-red-600',
    critical: 'bg-red-700',
    medium: 'bg-yellow-600',
    low: 'bg-green-600',
  };
  return map[priority] || 'bg-gray-600';
};

export const getStatusColor = (status: string): string => {
  const map = {
    active: 'text-green-400',
    completed: 'text-blue-400',
    planned: 'text-yellow-400',
    scheduled: 'text-orange-400',
    acknowledged: 'text-orange-400',
    maintenance: 'text-orange-400',
    inactive: 'text-gray-400',
    suspended: 'text-red-400',
    retired: 'text-red-400',
  };
  return map[status] || 'text-gray-400';
};

export const colorClasses = {
  blue: {
    text: "text-blue-500",
    textDark: "text-blue-600",
    border: "hover:border-blue-500/50",
    bg: "bg-blue-500/10",
  },
  green: {
    text: "text-green-500",
    textDark: "text-green-600",
    border: "hover:border-green-500/50",
    bg: "bg-green-500/10",
  },
  purple: {
    text: "text-purple-500",
    textDark: "text-purple-600",
    border: "hover:border-purple-500/50",
    bg: "bg-purple-500/10",
  },
  yellow: {
    text: "text-yellow-500",
    textDark: "text-yellow-600",
    border: "hover:border-yellow-500/50",
    bg: "bg-yellow-500/10",
  },
  teal: {
    text: "text-teal-500",
    textDark: "text-teal-600",
    border: "hover:border-teal-500/50",
    bg: "bg-teal-500/10",
  },
  indigo: {
    text: "text-indigo-500",
    textDark: "text-indigo-600",
    border: "hover:border-indigo-500/50",
    bg: "bg-indigo-500/10",
  },
  pink: {
    text: "text-pink-500",
    textDark: "text-pink-600",
    border: "hover:border-pink-500/50",
    bg: "bg-pink-500/10",
  },
  gray: {
    text: "text-gray-500",
    textDark: "text-gray-600",
    border: "hover:border-gray-500/50",
    bg: "bg-gray-500/10",
  },
};