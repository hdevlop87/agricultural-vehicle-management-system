import React, { createContext, useContext, ReactNode } from 'react';

const CardContext = createContext(null);

export function useCardContext() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
}

export function CardProvider({
  children,
  table,
  data,
  columns,
  filters,
  showSorting,
  showPagination,
  showAddButton,
  onView,
  onEdit,
  onDelete,
  onAddClick,
  className,
  noResultsText,
  onRowClick,
  filterPlaceholder,
  pageSizeOptions,
  isLoading,
  cardColumns = 3, // Default 3 columns
  cardRenderer
}) {
  const contextValue = {
    table,
    data,
    columns,
    filters,
    showSorting,
    showPagination,
    showAddButton,
    onView,
    onEdit,
    onDelete,
    onAddClick,
    className,
    noResultsText,
    onRowClick,
    filterPlaceholder,
    pageSizeOptions,
    isLoading,
    cardColumns,
    cardRenderer
  };

  return (
    <CardContext.Provider value={contextValue}>
      {children}
    </CardContext.Provider>
  );
}