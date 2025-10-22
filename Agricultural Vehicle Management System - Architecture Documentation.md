# Agricultural Vehicle Management System - Architecture Documentation

## System Overview

The Agricultural Vehicle Management System is built using a modular, layered architecture pattern that ensures scalability, maintainability, and clear separation of concerns. The system focuses on comprehensive management of agricultural operations, vehicles, fields, operators, and refuel consumption.

## Architecture Pattern

### 4-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Controller Layer                         │
│  - HTTP Request Handling                                    │
│  - Route Management                                         │
│  - Response Formatting                                      │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                          │
│  - Business Logic                                          │
│  - Cross-Module Validation                                 │
│  - Data Processing & Transformation                        │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Repository Layer                         │
│  - Database Operations                                     │
│  - Query Building                                          │
│  - Data Mapping                                            │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Validation Layer                         │
│  - Input Validation                                        │
│  - Business Rule Enforcement                               │
│  - Data Integrity Checks                                   │
└─────────────────────────────────────────────────────────────┘
```

## Agricultural Management Modules

### 1. Fields Management Module

**Purpose**: Manages agricultural field information, area calculations, and field utilization tracking.

#### Core Entities

- Field ID, Name, Area (hectares), Description
- Creation/Update timestamps
- Field statistics and utilization metrics

#### CRUD Operations

**CREATE Operations:**

- `POST /fields` - Create new field
- Validates area in hectares
- Ensures unique field names
- Generates unique field ID

**READ Operations:**

- `GET /fields` - Retrieve all fields
- `GET /fields/count` - Get total field count
- `GET /fields/total-area` - Calculate total and average area
- `GET /fields/by-size` - Fields sorted by size
- `GET /fields/large` - Large fields (>10 hectares)
- `GET /fields/small` - Small fields (<5 hectares)
- `GET /fields/active-operations` - Fields with ongoing operations
- `GET /fields/:id` - Get specific field by ID
- `GET /fields/name/:name` - Get field by name
- `GET /fields/:id/operations` - Field operation history
- `GET /fields/:id/statistics` - Field performance statistics
- `GET /fields/:id/utilization` - Field utilization metrics

**UPDATE Operations:**

- `PUT /fields/:id` - Update field information
- Validates area changes
- Ensures name uniqueness during updates

**DELETE Operations:**

- `DELETE /fields/:id` - Delete field
- Validates field not in active use
- Checks for existing operations

#### Business Logic Features

- Automatic area validation
- Field availability checking
- Productivity analysis
- Rotation recommendations
- Maintenance scheduling

---

### 2. Vehicles Management Module

**Purpose**: Manages agricultural vehicles, their status, maintenance scheduling, and operational tracking.

#### Core Entities

- Vehicle ID, Serial Number, License Plate, Type
- Status (active, maintenance, inactive)
- Vehicle specifications and operational data

#### CRUD Operations

**CREATE Operations:**

- `POST /vehicles` - Register new vehicle
- Validates unique serial numbers and license plates
- Sets initial status and configuration

**READ Operations:**

- `GET /vehicles` - Retrieve all vehicles
- `GET /vehicles/count` - Get vehicle count
- `GET /vehicles/types` - Available vehicle types
- `GET /vehicles/by-type/:type` - Filter by vehicle type
- `GET /vehicles/active` - Active vehicles only
- `GET /vehicles/maintenance` - Vehicles under maintenance
- `GET /vehicles/:id` - Specific vehicle details
- `GET /vehicles/serial/:serialNumber` - Find by serial number
- `GET /vehicles/license/:licensePlate` - Find by license plate

**UPDATE Operations:**

- `PUT /vehicles/:id` - Update vehicle information
- `PUT /vehicles/:id/status` - Update vehicle status
- Validates status transitions
- Updates maintenance schedules

**DELETE Operations:**

- `DELETE /vehicles/:id` - Remove vehicle
- Validates no active operations
- Archives historical data

#### Business Logic Features

- Status management (active, maintenance, inactive)
- Maintenance scheduling and alerts
- Operational history tracking
- Performance monitoring

---

### 3. Operations Management Module

**Purpose**: Central management of all agricultural operations including planning, execution, and completion tracking.

#### Core Entities

- Operation ID, Vehicle, Operator, Field, Operation Type
- Scheduling (date, start/end times)
- Performance metrics (area covered, engine hours, mileage)
- Status tracking (planned, active, completed, cancelled)

#### CRUD Operations

**CREATE Operations:**

- `POST /operations` - Create new operation
- Cross-validates vehicle, operator, field, and operation type
- Schedules operation with time and resource allocation

**READ Operations:**

- `GET /operations` - All operations overview
- `GET /operations/count` - Operations count
- `GET /operations/planned` - Scheduled operations
- `GET /operations/active` - Currently running operations
- `GET /operations/completed` - Finished operations
- `GET /operations/cancelled` - Cancelled operations
- `GET /operations/today` - Today's operations
- `GET /operations/date/:date` - Operations by specific date
- `GET /operations/vehicle/:vehicleId` - Vehicle operation history
- `GET /operations/operator/:operatorId` - Operator's operations
- `GET /operations/field/:fieldId` - Field operation history
- `GET /operations/operation-type/:operationTypeId` - By operation type
- `GET /operations/:id` - Specific operation details

**UPDATE Operations:**

- `PUT /operations/:id` - Update operation details
- `PUT /operations/:id/start` - Start operation execution
- `PUT /operations/:id/complete` - Mark operation completed
- `PUT /operations/:id/cancel` - Cancel operation
- Validates status transitions and business rules

**DELETE Operations:**

- `DELETE /operations/:id` - Remove operation
- Validates operation can be safely deleted
- Preserves audit trail

#### Advanced Features

- Real-time status tracking
- Resource availability validation
- Performance calculations
- Weather condition recording
- Duration and efficiency analytics

---

### 4. Operation Types Management Module

**Purpose**: Defines and manages different types of agricultural operations (plowing, seeding, harvesting, etc.).

#### Core Entities

- Operation Type ID, Name, Description
- Operation parameters and requirements
- Standard duration and resource estimates

#### CRUD Operations

**CREATE Operations:**

- `POST /operation-types` - Define new operation type
- Validates unique operation names
- Sets operation parameters

**READ Operations:**

- `GET /operation-types` - All available operation types
- `GET /operation-types/count` - Count of operation types
- `GET /operation-types/:id` - Specific operation type
- `GET /operation-types/name/:name` - Find by name

**UPDATE Operations:**

- `PUT /operation-types/:id` - Update operation type
- Modifies parameters and descriptions

**DELETE Operations:**

- `DELETE /operation-types/:id` - Remove operation type
- Validates no active operations using this type

#### Business Logic Features

- Operation standardization
- Resource requirement planning
- Performance benchmarking
- Seasonal operation scheduling

---

### 5. Operators Management Module

**Purpose**: Manages operator information, certifications, performance tracking, and availability.

#### Core Entities

- Operator ID, Name, License Information
- Status (active, inactive, suspended)
- License expiration tracking
- Performance metrics

#### CRUD Operations

**CREATE Operations:**

- `POST /operators` - Register new operator
- Validates license information
- Sets initial status and qualifications

**READ Operations:**

- `GET /operators` - All operators
- `GET /operators/count` - Operator count
- `GET /operators/active` - Active operators
- `GET /operators/inactive` - Inactive operators
- `GET /operators/suspended` - Suspended operators
- `GET /operators/license-expiring` - License expiration alerts
- `GET /operators/:id` - Specific operator details
- `GET /operators/license/:licenseNumber` - Find by license
- `GET /operators/:id/operations` - Operator's operation history
- `GET /operators/:id/performance` - Performance metrics

**UPDATE Operations:**

- `PUT /operators/:id` - Update operator information
- `PUT /operators/:id/status` - Change operator status
- Updates license information and qualifications

**DELETE Operations:**

- `DELETE /operators/:id` - Remove operator
- Validates no active assignments
- Archives historical performance data

#### Business Logic Features

- License expiration monitoring
- Performance tracking and analytics
- Availability management
- Certification validation
- Safety compliance tracking

---

### 6. Refuel Management Module

**Purpose**: Comprehensive fuel consumption tracking, cost analysis, and efficiency monitoring.

#### Core Entities

- Refuel ID, Vehicle, Operator, Date
- Fuel quantity, cost, voucher information
- Consumption analytics and efficiency metrics

#### CRUD Operations

**CREATE Operations:**

- `POST /refuel` - Record fuel transaction
- Validates vehicle and operator
- Tracks fuel quantity and costs

**READ Operations:**

- `GET /refuel` - All refuel records
- `GET /refuel/count` - Record count
- `GET /refuel/recent` - Recent refueling activities
- `GET /refuel/today` - Today's refuel records
- `GET /refuel/date/:date` - Records by date
- `GET /refuel/vehicle/:vehicleId` - Vehicle fuel history
- `GET /refuel/operator/:operatorId` - Operator refuel records
- `GET /refuel/voucher/:voucherNumber` - Find by voucher
- `GET /refuel/:id` - Specific record details

**UPDATE Operations:**

- `PUT /refuel/:id` - Update refuel record
- Modifies quantities, costs, or associated information

**DELETE Operations:**

- `DELETE /refuel/:id` - Remove refuel record
- Validates record can be safely deleted

#### Analytics Endpoints

- `GET /refuel/analytics/consumption` - Consumption analytics
- `GET /refuel/analytics/efficiency` - Efficiency reports
- `GET /refuel/analytics/costs` - Cost analysis
- `GET /refuel/analytics/summary` - Summary statistics
- `GET /refuel/vehicle/:vehicleId/efficiency` - Vehicle efficiency
- `GET /refuel/vehicle/:vehicleId/costs` - Vehicle fuel costs
- `GET /refuel/trends/monthly` - Monthly fuel trends

#### Business Logic Features

- Real-time consumption tracking
- Cost per operation analysis
- Efficiency benchmarking
- Fuel budget management
- Trend analysis and forecasting

---

### 7. Files Management Module

**Purpose**: Handles document storage, retrieval, and management for the agricultural system.

#### Core Entities

- File ID, Name, Type, Size
- Upload metadata and storage location
- Access permissions and version control

#### CRUD Operations

**CREATE Operations:**

- `POST /files` - Upload new file
- Validates file types and sizes
- Generates secure storage paths

**READ Operations:**

- `GET /files` - All files listing
- `GET /files/:id` - Specific file details
- File download and preview capabilities

**UPDATE Operations:**

- `PUT /files/:id` - Update file metadata
- Version management and updates

**DELETE Operations:**

- `DELETE /files/:id` - Remove file
- Secure deletion with audit trail

#### Business Logic Features

- Secure file storage
- Metadata management
- Access control
- Version tracking
- File type validation

---

### 8. Dashboard Management Module

**Purpose**: Provides aggregated data and analytics for system overview and decision making.

#### Core Features

- Real-time system metrics
- Performance dashboards
- Resource utilization tracking
- Operational efficiency analytics

#### CRUD Operations

**READ Operations:**

- `GET /dashboards` - Dashboard configurations
- `GET /dashboards/:id` - Specific dashboard
- Real-time data aggregation
- Customizable dashboard layouts

**UPDATE Operations:**

- `PUT /dashboards/:id` - Update dashboard configuration
- Modify layout and data sources

#### Business Logic Features

- Real-time data aggregation
- Key performance indicators (KPIs)
- Trend analysis
- Resource optimization insights
- Predictive analytics

---

## Common Architecture Components

### Request/Response Pattern

All modules follow a consistent request/response pattern:

```typescript
{
  data: any,           // Actual response data
  message: string,     // Status message
  status: 'success'    // Operation status
}
```

### Validation Layer

Each module implements comprehensive validation:

- Input data validation
- Business rule enforcement
- Cross-module dependency validation
- Data integrity checks

### Error Handling

Consistent error handling across all modules:

- Validation errors
- Business logic errors
- Database constraint violations
- Resource not found errors

### Security Features

- Admin-level access control (`@isAdmin()`)
- Input sanitization
- SQL injection prevention
- Secure file handling

---

## Database Design Patterns

### Naming Conventions

- Table names: lowercase plural (fields, vehicles, operations)
- Column names: camelCase (createdAt, updatedAt)
- ID fields: consistent naming across tables

### Relationships

- Foreign key constraints maintain data integrity
- Junction tables for many-to-many relationships
- Proper indexing for performance optimization

### Data Integrity

- Referential integrity enforcement
- Cascade delete handling
- Constraint validation
- Audit trail maintenance

---

## Performance Optimization

### Query Optimization

- Selective field retrieval
- Proper indexing strategies
- Efficient joins and aggregations
- Pagination for large datasets

### Caching Strategy

- Result caching for frequently accessed data
- Query result optimization
- Memory-efficient data structures

### Scalability Considerations

- Modular architecture for horizontal scaling
- Stateless service design
- Database connection pooling
- Efficient resource utilization

---

## Monitoring and Analytics

### System Metrics

- Operation performance tracking
- Resource utilization monitoring
- Error rate analysis
- Response time optimization

### Business Intelligence

- Operational efficiency analytics
- Cost analysis and optimization
- Predictive maintenance scheduling
- Resource allocation optimization