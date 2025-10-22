import React from 'react';
import NCard from '../index';
import { VehicleCard } from '../VehicleCard';
import { OperatorCard } from '../OperatorCard';
import { DefaultCard } from '../DefaultCard';

// Example: Basic usage with default card renderer
export const BasicCardExample = ({ data, columns }) => {
  return (
    <NCard
      data={data}
      columns={columns}
      onEdit={(item) => console.log('Edit:', item)}
      onDelete={(item) => console.log('Delete:', item)}
      onView={(item) => console.log('View:', item)}
      cardColumns={3} // 3 columns on large screens
      showSorting={true}
      showPagination={true}
      showAddButton={true}
      onAddClick={() => console.log('Add new item')}
      filters={[
        {
          name: 'status',
          type: 'select',
          options: ['active', 'inactive', 'maintenance'],
          placeholder: 'Filter by status'
        },
        {
          name: 'name',
          type: 'text',
          placeholder: 'Search by name...'
        }
      ]}
    />
  );
};

// Example: Vehicle cards with custom renderer
export const VehicleCardExample = ({ vehicles, columns }) => {
  return (
    <NCard
      data={vehicles}
      columns={columns}
      cardRenderer={VehicleCard}
      cardColumns={4} // 4 columns for vehicles
      onEdit={(vehicle) => console.log('Edit vehicle:', vehicle)}
      onDelete={(vehicle) => console.log('Delete vehicle:', vehicle)}
      onView={(vehicle) => console.log('View vehicle:', vehicle)}
      onRowClick={(vehicle) => console.log('Vehicle clicked:', vehicle)}
      filters={[
        {
          name: 'status',
          type: 'select',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'maintenance', label: 'Maintenance' },
            { value: 'retired', label: 'Retired' }
          ],
          placeholder: 'Vehicle Status'
        },
        {
          name: 'type',
          type: 'select',
          options: ['tractor', 'harvester', 'sprayer', 'seeder', 'cultivator'],
          placeholder: 'Vehicle Type'
        },
        {
          name: 'brand',
          type: 'text',
          placeholder: 'Search by brand...'
        }
      ]}
      pageSizeOptions={[8, 16, 24, 32]}
    />
  );
};

// Example: Operator cards with custom renderer
export const OperatorCardExample = ({ operators, columns }) => {
  return (
    <NCard
      data={operators}
      columns={columns}
      cardRenderer={OperatorCard}
      cardColumns={3} // 3 columns for operators
      onEdit={(operator) => console.log('Edit operator:', operator)}
      onDelete={(operator) => console.log('Delete operator:', operator)}
      onView={(operator) => console.log('View operator:', operator)}
      filters={[
        {
          name: 'status',
          type: 'select',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'suspended', label: 'Suspended' }
          ],
          placeholder: 'Operator Status'
        },
        {
          name: 'user.name',
          type: 'text',
          placeholder: 'Search by name...'
        }
      ]}
    />
  );
};

// Example: Responsive card layout (2 columns on mobile, 3 on tablet, 4 on desktop)
export const ResponsiveCardExample = ({ data, columns }) => {
  return (
    <div className="w-full">
      <NCard
        data={data}
        columns={columns}
        cardColumns={4}
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        onEdit={(item) => console.log('Edit:', item)}
        onDelete={(item) => console.log('Delete:', item)}
        isLoading={false}
        noResultsText="No items found. Try adjusting your filters."
      />
    </div>
  );
};

// Example: Minimal card view without actions
export const MinimalCardExample = ({ data, columns }) => {
  return (
    <NCard
      data={data}
      columns={columns}
      cardColumns={5}
      showAddButton={false}
      showPagination={false}
      showSorting={false}
      onRowClick={(item) => console.log('Card clicked:', item)}
    />
  );
};