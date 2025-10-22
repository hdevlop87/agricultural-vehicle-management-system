# NCard Component

A flexible card-based data display component that reuses NTable's logic but presents data in a responsive card grid layout.

## Features

- **Reuses NTable Logic**: Leverages all filtering, sorting, and pagination functionality from NTable
- **Responsive Grid**: Configurable column layouts that adapt to screen sizes
- **Custom Card Renderers**: Support for custom card components while maintaining consistent behavior
- **Action Support**: Built-in support for view, edit, and delete actions
- **Default Card**: Generic card renderer for any data structure
- **Specialized Cards**: Pre-built card components for specific entities (Vehicle, Operator)
- **Loading States**: Skeleton loading animations
- **Empty States**: Customizable no-results messaging

## Basic Usage

```tsx
import NCard from '@/components/NCard';

const MyCardView = () => {
  const { data, isLoading } = useMyData();
  
  return (
    <NCard
      data={data}
      columns={columns} // Same column definition as NTable
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAddClick={handleAdd}
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[]` | `[]` | Array of data to display in cards |
| `columns` | `ColumnDef[]` | required | Column definitions (same as NTable) |
| `cardColumns` | `number` | `3` | Number of columns in grid (1-6) |
| `cardRenderer` | `React.Component` | `DefaultCard` | Custom card component |
| `showPagination` | `boolean` | `true` | Show pagination controls |
| `showSorting` | `boolean` | `true` | Show sorting dropdown |
| `showAddButton` | `boolean` | `true` | Show add button |
| `isLoading` | `boolean` | `false` | Show loading skeletons |
| `filters` | `FilterConfig[]` | `[]` | Filter configurations |
| `onRowClick` | `(data) => void` | - | Card click handler |
| `onView` | `(data) => void` | - | View action handler |
| `onEdit` | `(data) => void` | - | Edit action handler |
| `onDelete` | `(data) => void` | - | Delete action handler |
| `onAddClick` | `() => void` | - | Add button handler |
| `pageSizeOptions` | `number[]` | `[12, 24, 36, 48]` | Page size options |
| `noResultsText` | `string` | `"No results."` | Empty state message |

## Custom Card Renderers

### Creating a Custom Card

```tsx
interface CustomCardProps {
  data: any;
  onRowClick?: (data: any) => void;
  onView?: (data: any) => void;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
}

const CustomCard: React.FC<CustomCardProps> = ({ 
  data, 
  onRowClick, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card onClick={() => onRowClick?.(data)}>
      <CardContent>
        <h3>{data.title}</h3>
        <p>{data.description}</p>
        
        <div className="flex gap-2">
          <Button onClick={(e) => {
            e.stopPropagation();
            onEdit?.(data);
          }}>
            Edit
          </Button>
          <Button onClick={(e) => {
            e.stopPropagation();
            onDelete?.(data);
          }}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

### Using Custom Cards

```tsx
<NCard
  data={myData}
  columns={columns}
  cardRenderer={CustomCard}
  cardColumns={4}
/>
```

## Pre-built Card Components

### VehicleCard
Specialized card for vehicle data with status indicators, fuel information, and warning badges.

```tsx
import { VehicleCard } from '@/components/NCard/VehicleCard';

<NCard
  data={vehicles}
  columns={vehicleColumns}
  cardRenderer={VehicleCard}
/>
```

### OperatorCard
Specialized card for operator data with avatar, license expiration warnings, and contact information.

```tsx
import { OperatorCard } from '@/components/NCard/OperatorCard';

<NCard
  data={operators}
  columns={operatorColumns}
  cardRenderer={OperatorCard}
/>
```

## Filtering and Sorting

The NCard component supports the same filtering and sorting options as NTable:

```tsx
<NCard
  data={data}
  columns={columns}
  filters={[
    {
      name: 'status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ],
      placeholder: 'Filter by status'
    },
    {
      name: 'name',
      type: 'text',
      placeholder: 'Search by name...'
    }
  ]}
  showSorting={true}
/>
```

## Responsive Layouts

### Grid Columns
- `cardColumns={1}`: Single column (mobile-first)
- `cardColumns={2}`: Two columns
- `cardColumns={3}`: Three columns (default)
- `cardColumns={4}`: Four columns
- `cardColumns={5}`: Five columns
- `cardColumns={6}`: Six columns

### Custom Responsive Classes
```tsx
<NCard
  data={data}
  columns={columns}
  cardColumns={4}
  className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
/>
```

## Loading States

The component automatically shows skeleton cards when `isLoading={true}`:

```tsx
<NCard
  data={data}
  columns={columns}
  isLoading={isDataLoading}
/>
```

## Integration with Existing Hooks

Works seamlessly with existing `useEntity` hooks:

```tsx
const VehicleCards = () => {
  const { vehicles, isVehiclesLoading, updateVehicle, deleteVehicle } = useVehicles();
  
  return (
    <NCard
      data={vehicles}
      columns={vehicleColumns}
      cardRenderer={VehicleCard}
      isLoading={isVehiclesLoading}
      onEdit={updateVehicle}
      onDelete={deleteVehicle}
      cardColumns={4}
    />
  );
};
```

## Styling and Theming

Cards inherit the theme from your CSS variables and support:
- Hover effects
- Focus states
- Status-based color coding
- Responsive spacing
- Dark/light mode compatibility

## Best Practices

1. **Card Columns**: Use 3-4 columns for optimal readability
2. **Custom Cards**: Always handle `stopPropagation()` on action buttons
3. **Loading States**: Always provide loading state for better UX
4. **Empty States**: Customize `noResultsText` for context-specific messaging
5. **Actions**: Only include actions that make sense for your use case
6. **Responsive**: Test your cards on different screen sizes

## Migration from NTable

To migrate from NTable to NCard:

1. Replace `<NTable>` with `<NCard>`
2. Add `cardRenderer` prop if you want custom cards
3. Adjust `pageSizeOptions` for card layouts (typically smaller numbers)
4. Add `cardColumns` prop to control grid layout
5. All other props remain the same

```tsx
// Before (NTable)
<NTable
  data={data}
  columns={columns}
  onEdit={onEdit}
  onDelete={onDelete}
/>

// After (NCard)
<NCard
  data={data}
  columns={columns}
  cardRenderer={CustomCard}
  cardColumns={3}
  onEdit={onEdit}
  onDelete={onDelete}
/>
```