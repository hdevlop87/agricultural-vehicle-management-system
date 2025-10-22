"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useTableContext } from './TableContext';

const TableActionsCol = ({ row }) => {
  const { onView, onEdit, onDelete } = useTableContext();

  if (!onView && !onEdit && !onDelete) {
    return null;
  }

  const handleView = () => {
    if (onView) onView(row.original);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(row.original);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(row.original);
  };

  return (
    <div className="flex items-center gap-1">
      {onView && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleView}
          className="h-8 w-8 p-0 hover:bg-blue-100 cursor-pointer"
        >
          <Eye className="h-4 w-4 text-white" />
        </Button>
      )}
      
      {onEdit && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleEdit}
          className="h-8 w-8 p-0 hover:bg-green-100 cursor-pointer"
        >
          <Edit className="h-4 w-4 text-purple-400" />
        </Button>
      )}
      
      {onDelete && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete}
          className="h-8 w-8 p-0 hover:bg-red-100 cursor-pointer"
        >
          <Trash2 className="h-4 w-4 text-red-400" />
        </Button>
      )}
    </div>
  );
};

export default TableActionsCol;