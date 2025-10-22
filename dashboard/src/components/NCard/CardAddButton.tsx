"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import { useCardContext } from './CardContext';

export const CardAddButton = () => {
  const { onAddClick, showAddButton = false } = useCardContext();

  if (!showAddButton) {
    return null;
  }

  return (
    <div 
      onClick={onAddClick} 
      className='cursor-pointer bg-primary h-10 p-2 rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200 flex items-center gap-2 text-white px-3'
    >
      <Plus className="h-4 w-4" />
      <span className="text-sm font-medium">Add New</span>
    </div>
  );
};