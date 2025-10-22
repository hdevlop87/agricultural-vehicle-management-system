# Agricultural Management System - Operation Workflow Examples

## Overview

This document provides practical examples of how different modules in the Agricultural Vehicle Management System work together to accomplish real-world agricultural operations. Each example demonstrates the complete workflow from planning to completion.

---

## Workflow Example 1: Complete Field Plowing Operation

### Scenario

Planning and executing a plowing operation for the "North Field" using Tractor T-001 with operator John Smith.

### Step-by-Step Workflow

#### Phase 1: Pre-Operation Planning

**1. Check Field Availability**

```http
GET /fields/name/North Field
```

```json
Response: {
  "data": {
    "id": "FLD01",
    "name": "North Field",
    "area": "25.5",
    "description": "Primary cultivation area with good soil drainage"
  },
  "message": "Field retrieved successfully",
  "status": "success"
}
```

**2. Verify Operation Type**

```http
GET /operation-types/name/Plowing
```

```json
Response: {
  "data": {
    "id": "OT001",
    "name": "Plowing",
    "description": "Primary soil cultivation operation"
  },
  "message": "Operation type retrieved successfully",
  "status": "success"
}
```

**3. Check Vehicle Availability**

```http
GET /vehicles/serial/T-001
```

```json
Response: {
  "data": {
    "id": "VH001",
    "serialNumber": "T-001",
    "type": "Tractor",
    "status": "active",
    "currentMileage": 15420
  },
  "message": "Vehicle retrieved successfully",
  "status": "success"
}
```

**4. Verify Operator Certification**

```http
GET /operators/license/OP-12345
```

```json
Response: {
  "data": {
    "id": "OP001",
    "name": "John Smith",
    "licenseNumber": "OP-12345",
    "status": "active",
    "licenseExpiry": "2025-12-31"
  },
  "message": "Operator retrieved successfully",
  "status": "success"
}
```

#### Phase 2: Operation Planning and Creation

**5. Create Plowing Operation**

```http
POST /operations
```

```json
Request Body: {
  "vehicleId": "VH001",
  "operatorId": "OP001",
  "operationTypeId": "OT001",
  "fieldId": "FLD01",
  "date": "2025-07-21",
  "startTime": "08:00:00",
  "notes": "First plowing of the season - check soil moisture"
}
```

```json
Response: {
  "data": {
    "id": "OP001",
    "vehicleId": "VH001",
    "operatorId": "OP001",
    "operationTypeId": "OT001",
    "fieldId": "FLD01",
    "date": "2025-07-21",
    "status": "planned"
  },
  "message": "Operation created successfully",
  "status": "success"
}
```

#### Phase 3: Pre-Operation Fuel Check

**6. Record Pre-Operation Fuel Level**

```http
POST /refuel
```

```json
Request Body: {
  "vehicleId": "VH001",
  "operatorId": "OP001",
  "quantity": 150.5,
  "cost": 180.60,
  "voucherNumber": "FL-2025-001",
  "date": "2025-07-21",
  "notes": "Pre-operation refuel for plowing"
}
```

#### Phase 4: Operation Execution

**7. Start Operation**

```http
PUT /operations/OP001/start
```

```json
Request Body: {
  "startTime": "2025-07-21T08:15:00Z",
  "startHours": 1542.3,
  "startMileage": 15420,
  "weather": "Clear, 22°C, Light breeze"
}
```

```json
Response: {
  "data": {
    "id": "OP001",
    "status": "active",
    "startTime": "2025-07-21T08:15:00Z",
    "startHours": 1542.3,
    "weather": "Clear, 22°C, Light breeze"
  },
  "message": "Operation started successfully",
  "status": "success"
}
```

**8. Monitor Active Operations**

```http
GET /operations/active
```

```json
Response: {
  "data": [
    {
      "id": "OP001",
      "vehicleId": "VH001",
      "operatorId": "OP001",
      "fieldId": "FLD01",
      "operationType": "Plowing",
      "status": "active",
      "startTime": "2025-07-21T08:15:00Z"
    }
  ],
  "message": "Active operations retrieved successfully",
  "status": "success"
}
```

#### Phase 5: Operation Completion

**9. Complete Operation**

```http
PUT /operations/OP001/complete
```

```json
Request Body: {
  "endTime": "2025-07-21T16:30:00Z",
  "endHours": 1550.8,
  "endMileage": 15435,
  "areaCovered": "24.2",
  "weather": "Partly cloudy, 26°C",
  "notes": "Completed successfully. Soil conditions were optimal."
}
```

```json
Response: {
  "data": {
    "id": "OP001",
    "status": "completed",
    "duration": "8.25 hours",
    "areaCovered": "24.2 hectares",
    "efficiency": "2.93 hectares/hour"
  },
  "message": "Operation completed successfully",
  "status": "success"
}
```

#### Phase 6: Post-Operation Analysis

**10. Analyze Field Statistics**

```http
GET /fields/FLD01/statistics
```

```json
Response: {
  "data": {
    "fieldId": "FLD01",
    "totalOperations": 1,
    "lastOperation": "2025-07-21",
    "averageEfficiency": "2.93 hectares/hour",
    "utilizationRate": "94.9%"
  },
  "message": "Field statistics retrieved successfully",
  "status": "success"
}
```

**11. Check Vehicle Performance**

```http
GET /vehicles/VH001
```

```json
Response: {
  "data": {
    "id": "VH001",
    "currentMileage": 15435,
    "engineHours": 1550.8,
    "lastMaintenance": "2025-06-15",
    "nextMaintenanceDue": "2025-09-15"
  },
  "message": "Vehicle retrieved successfully",
  "status": "success"
}
```

---

## Workflow Example 2: Seasonal Seeding Campaign

### Scenario

Managing a comprehensive seeding campaign across multiple fields with resource optimization.

### Step-by-Step Workflow

#### Phase 1: Campaign Planning

**1. Get Available Fields for Seeding**

```http
GET /fields/large
```

```json
Response: {
  "data": [
    {
      "id": "FLD01",
      "name": "North Field",
      "area": "25.5"
    },
    {
      "id": "FLD04",
      "name": "West Field",
      "area": "30.0"
    }
  ],
  "message": "Large fields retrieved successfully",
  "status": "success"
}
```

**2. Check Available Seeding Equipment**

```http
GET /vehicles/by-type/Seeder
```

```json
Response: {
  "data": [
    {
      "id": "VH002",
      "serialNumber": "S-001",
      "type": "Seeder",
      "status": "active"
    },
    {
      "id": "VH003",
      "serialNumber": "S-002", 
      "type": "Seeder",
      "status": "active"
    }
  ],
  "message": "Vehicles retrieved successfully",
  "status": "success"
}
```

**3. Get Certified Seeding Operators**

```http
GET /operators/active
```

```json
Response: {
  "data": [
    {
      "id": "OP001",
      "name": "John Smith",
      "status": "active"
    },
    {
      "id": "OP002",
      "name": "Maria Garcia",
      "status": "active"
    }
  ],
  "message": "Active operators retrieved successfully",
  "status": "success"
}
```

#### Phase 2: Multi-Field Operation Planning

**4. Create North Field Seeding Operation**

```http
POST /operations
```

```json
Request Body: {
  "vehicleId": "VH002",
  "operatorId": "OP001",
  "operationTypeId": "OT002",
  "fieldId": "FLD01",
  "date": "2025-07-22",
  "startTime": "07:00:00",
  "notes": "Spring corn seeding - 25.5 hectares"
}
```

**5. Create West Field Seeding Operation**

```http
POST /operations
```

```json
Request Body: {
  "vehicleId": "VH003",
  "operatorId": "OP002",
  "operationTypeId": "OT002",
  "fieldId": "FLD04",
  "date": "2025-07-22",
  "startTime": "07:30:00",
  "notes": "Spring corn seeding - 30.0 hectares"
}
```

#### Phase 3: Coordinated Execution

**6. Start Both Operations**

```http
PUT /operations/OP002/start
PUT /operations/OP003/start
```

**7. Monitor Campaign Progress**

```http
GET /operations/today
```

```json
Response: {
  "data": [
    {
      "id": "OP002",
      "fieldName": "North Field",
      "operatorName": "John Smith",
      "status": "active",
      "progress": "65%"
    },
    {
      "id": "OP003",
      "fieldName": "West Field",
      "operatorName": "Maria Garcia",
      "status": "active",
      "progress": "58%"
    }
  ],
  "message": "Today's operations retrieved successfully",
  "status": "success"
}
```

#### Phase 4: Resource Management

**8. Fuel Consumption Tracking**

```http
GET /refuel/today
```

```json
Response: {
  "data": [
    {
      "vehicleId": "VH002",
      "quantity": 95.2,
      "cost": 114.24,
      "operationId": "OP002"
    },
    {
      "vehicleId": "VH003",
      "quantity": 103.8,
      "cost": 124.56,
      "operationId": "OP003"
    }
  ],
  "message": "Today's refuel records retrieved successfully",
  "status": "success"
}
```

---

## Workflow Example 3: Preventive Maintenance Scheduling

### Scenario

Implementing preventive maintenance scheduling based on operation hours and usage patterns.

### Step-by-Step Workflow

#### Phase 1: Maintenance Assessment

**1. Check Vehicle Engine Hours**

```http
GET /vehicles
```

```json
Response: {
  "data": [
    {
      "id": "VH001",
      "serialNumber": "T-001",
      "engineHours": 1550.8,
      "lastMaintenance": "2025-06-15",
      "maintenanceInterval": 250
    }
  ],
  "message": "Vehicles retrieved successfully",
  "status": "success"
}
```

**2. Calculate Maintenance Requirements**

```javascript
// Business Logic Calculation
const hoursUntilMaintenance = (lastMaintenanceHours + maintenanceInterval) - currentHours;
// 1300.0 + 250 - 1550.8 = -0.8 hours (OVERDUE)
```

**3. Update Vehicle Status**

```http
PUT /vehicles/VH001/status
```

```json
Request Body: {
  "status": "maintenance"
}
```

#### Phase 2: Operation Rescheduling

**4. Check Affected Operations**

```http
GET /operations/vehicle/VH001
```

```json
Response: {
  "data": [
    {
      "id": "OP004",
      "status": "planned",
      "date": "2025-07-23",
      "fieldId": "FLD02"
    }
  ],
  "message": "Vehicle operations retrieved successfully",
  "status": "success"
}
```

**5. Find Alternative Vehicle**

```http
GET /vehicles/active
```

```json
Response: {
  "data": [
    {
      "id": "VH005",
      "serialNumber": "T-002",
      "type": "Tractor",
      "status": "active",
      "engineHours": 890.2
    }
  ],
  "message": "Active vehicles retrieved successfully",
  "status": "success"
}
```

**6. Reassign Operation**

```http
PUT /operations/OP004
```

```json
Request Body: {
  "vehicleId": "VH005",
  "notes": "Reassigned due to VH001 maintenance schedule"
}
```

---

## Workflow Example 4: Harvest Operations with Quality Tracking

### Scenario

Managing harvest operations with yield tracking and quality assessment.

### Step-by-Step Workflow

#### Phase 1: Harvest Preparation

**1. Check Field Readiness**

```http
GET /fields/FLD01/operations
```

```json
Response: {
  "data": [
    {
      "operationType": "Plowing",
      "date": "2025-07-21",
      "status": "completed"
    },
    {
      "operationType": "Seeding",
      "date": "2025-07-22",
      "status": "completed"
    }
  ],
  "message": "Field operations retrieved successfully",
  "status": "success"
}
```

**2. Prepare Harvest Equipment**

```http
GET /vehicles/by-type/Harvester
```

```json
Response: {
  "data": [
    {
      "id": "VH006",
      "serialNumber": "H-001",
      "type": "Harvester",
      "status": "active"
    }
  ],
  "message": "Harvesters retrieved successfully",
  "status": "success"
}
```

#### Phase 2: Harvest Execution

**3. Create Harvest Operation**

```http
POST /operations
```

```json
Request Body: {
  "vehicleId": "VH006",
  "operatorId": "OP003",
  "operationTypeId": "OT003",
  "fieldId": "FLD01",
  "date": "2025-10-15",
  "notes": "Corn harvest - monitor yield and moisture content"
}
```

**4. Start Harvest Operation**

```http
PUT /operations/OP005/start
```

```json
Request Body: {
  "startTime": "2025-10-15T06:30:00Z",
  "startHours": 2340.5,
  "weather": "Clear, 18°C, Light wind"
}
```

#### Phase 3: Real-time Monitoring

**5. Record Intermediate Progress**

```http
PUT /operations/OP005
```

```json
Request Body: {
  "areaCovered": "12.5",
  "notes": "50% complete - excellent yield observed, moisture at 14%"
}
```

**6. Monitor Fuel Consumption**

```http
POST /refuel
```

```json
Request Body: {
  "vehicleId": "VH006",
  "operatorId": "OP003",
  "quantity": 120.8,
  "cost": 145.00,
  "date": "2025-10-15",
  "notes": "Mid-harvest refuel"
}
```

#### Phase 4: Harvest Completion

**7. Complete Harvest Operation**

```http
PUT /operations/OP005/complete
```

```json
Request Body: {
  "endTime": "2025-10-15T18:45:00Z",
  "endHours": 2352.8,
  "areaCovered": "25.5",
  "notes": "Harvest completed. Total yield: 280 tons, average moisture: 13.5%"
}
```

**8. Generate Field Productivity Report**

```http
GET /fields/FLD01/statistics
```

```json
Response: {
  "data": {
    "fieldId": "FLD01",
    "totalYield": "280 tons",
    "yieldPerHectare": "10.98 tons/hectare",
    "moistureContent": "13.5%",
    "harvestEfficiency": "2.07 hectares/hour"
  },
  "message": "Field harvest statistics retrieved successfully",
  "status": "success"
}
```

---

## Workflow Example 5: Fleet Fuel Efficiency Analysis

### Scenario

Analyzing fleet fuel efficiency and identifying optimization opportunities.

### Step-by-Step Workflow

#### Phase 1: Data Collection

**1. Get Fleet Fuel Consumption**

```http
GET /refuel/analytics/consumption
```

```json
Response: {
  "data": {
    "totalConsumption": "2450.8 liters",
    "totalCost": "2941.00",
    "averageEfficiency": "12.5 L/hour",
    "period": "Last 30 days"
  },
  "message": "Fuel consumption analytics retrieved successfully",
  "status": "success"
}
```

**2. Analyze Vehicle-Specific Efficiency**

```http
GET /refuel/vehicle/VH001/efficiency
```

```json
Response: {
  "data": {
    "vehicleId": "VH001",
    "averageConsumption": "14.2 L/hour",
    "totalHoursOperated": "95.5 hours",
    "efficiencyRating": "Below Average",
    "recommendedActions": ["Schedule engine tune-up", "Check hydraulic system"]
  },
  "message": "Vehicle fuel efficiency retrieved successfully",
  "status": "success"
}
```

#### Phase 2: Performance Comparison

**3. Compare Operator Performance**

```http
GET /operators/OP001/performance
```

```json
Response: {
  "data": {
    "operatorId": "OP001",
    "operationsCompleted": 15,
    "averageEfficiency": "2.85 hectares/hour",
    "fuelEfficiency": "13.1 L/hour",
    "performanceRating": "Excellent"
  },
  "message": "Operator performance retrieved successfully",
  "status": "success"
}
```

#### Phase 3: Optimization Implementation

**4. Schedule Maintenance for Underperforming Vehicles**

```http
PUT /vehicles/VH001/status
```

```json
Request Body: {
  "status": "maintenance"
}
```

**5. Generate Optimization Report**

```http
GET /refuel/trends/monthly
```

```json
Response: {
  "data": {
    "trends": [
      {
        "month": "2025-07",
        "consumption": "850.2 L",
        "cost": "1020.24",
        "efficiency": "12.8 L/hour"
      }
    ],
    "projectedSavings": "8.5%",
    "recommendations": [
      "Implement operator training program",
      "Schedule regular maintenance intervals",
      "Consider equipment upgrades for VH001"
    ]
  },
  "message": "Monthly fuel trends retrieved successfully",
  "status": "success"
}
```

---

## Integration Patterns

### Cross-Module Data Flow

1. **Resource Validation Chain**:
   Operations → Vehicles → Operators → Fields → Operation Types

2. **Performance Tracking Flow**:
   Operations → Refuel → Analytics → Dashboard

3. **Maintenance Workflow**:
   Vehicle Status → Operation Rescheduling → Resource Reallocation

### Error Handling Examples

**Resource Unavailable Error**:

```json
{
  "error": "Vehicle VH001 is currently under maintenance",
  "code": "RESOURCE_UNAVAILABLE",
  "suggestion": "Use GET /vehicles/active to find available alternatives"
}
```

**Validation Error**:

```json
{
  "error": "Field area coverage exceeds field size",
  "code": "VALIDATION_ERROR",
  "details": "Area covered (30.5 ha) exceeds field size (25.5 ha)"
}
```

### Best Practices for Workflow Implementation

1. **Always validate resource availability before operation creation**
2. **Implement proper error handling and rollback mechanisms**
3. **Use real-time monitoring for active operations**
4. **Maintain comprehensive audit trails**
5. **Implement predictive analytics for maintenance scheduling**
6. **Optimize resource allocation based on performance data**

---

## Summary

These workflow examples demonstrate the comprehensive integration between all agricultural management modules, showing how the system supports complex, real-world agricultural operations from planning through execution to analysis and optimization.