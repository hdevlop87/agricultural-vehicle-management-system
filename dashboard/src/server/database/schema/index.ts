import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, pgEnum, integer, numeric, date, time, jsonb } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { t } from 'najm-api';

export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'pending']);
export const tokenStatusEnum = pgEnum('token_status', ['active', 'revoked', 'expired']);
export const tokenTypeEnum = pgEnum('token_type', ['access', 'refresh']);
export const fileStatusEnum = pgEnum('file_status', ['active', 'deleted', 'archived']);

const timestamps = {
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
};

export const users = pgTable('users', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid(5)),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  password: text('password').notNull(),
  image: text('image').default('noavatar.png'),
  status: userStatusEnum('status').default('pending'),
  roleId: text('role_id').references(() => roles.id),
  ...timestamps,
});

export const tokens = pgTable('tokens', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid(5)),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  token: text('token').notNull().unique(),
  type: tokenTypeEnum('type').default('refresh'),
  status: tokenStatusEnum('status').default('active'),
  expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
  ...timestamps,
});

export const files = pgTable('files', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid(5)),
  name: text('name').notNull().unique(),
  path: text('path').notNull(),
  absPath: text('abs_path').notNull(),
  size: integer('size').notNull(),
  mimeType: text('mime_type').notNull(),
  type: text('type'),
  category: text('category'),
  entityId: text('entity_id'),
  isPublic: boolean('is_public').default(false),
  status: fileStatusEnum('status').default('active'),
  ...timestamps,
});

export const roles = pgTable('roles', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid(5)),
  name: text('name').notNull(),
  description: text('description'),
});

//=====================================================================//
// AGRICULTURAL VEHICLE MANAGEMENT TABLES
//=====================================================================//

export const vehicleTypeEnum = pgEnum('vehicle_type', ['tractor', 'harvester', 'sprayer', 'seeder', 'cultivator', 'other']);
export const vehicleStatusEnum = pgEnum('vehicle_status', ['active', 'maintenance', 'retired']);
export const fuelTypeEnum = pgEnum('fuel_type', ['diesel', 'gasoline', 'electric', 'hybrid']);
export const operatorStatusEnum = pgEnum('operator_status', ['active', 'inactive', 'suspended']);
export const operationStatusEnum = pgEnum('operation_status', ['planned', 'active', 'completed', 'cancelled']);
export const languageEnum = pgEnum('language', ['en', 'fr', 'ar', 'es']);
export const refreshUnitEnum = pgEnum('refresh_unit', ['s', 'm', 'h']);
export const trackerModeEnum = pgEnum('tracker_mode', ['tracking', 'gprs', 'sms', 'sleep_time', 'sleep_shock', 'sleep_deep']);
export const alertTypeEnum = pgEnum('alert_type', ['maintenance', 'fuel', 'security', 'operational', 'system']);
export const alertPriorityEnum = pgEnum('alert_priority', ['low', 'medium', 'high', 'critical']);
export const alertStatusEnum = pgEnum('alert_status', ['active', 'acknowledged', 'resolved', 'dismissed']);
export const maintenanceTypeEnum = pgEnum('maintenance_type', ['scheduled', 'repair', 'inspection', 'oil_change', 'filter_change', 'other']);
export const maintenanceStatusEnum = pgEnum('maintenance_status', ['scheduled', 'in_progress', 'completed', 'cancelled', 'overdue']);
export const trackerSourceEnum = pgEnum('tracker_source', ['physical', 'phone']);
export const trackerStatusEnum = pgEnum('tracker_status', ['active', 'inactive']);

export const vehicles = pgTable('vehicles', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid(5)),
  type: vehicleTypeEnum('type').notNull(),
  name: text('name').notNull(),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  year: text('year'),
  licensePlate: text('license_plate'),
  image: text('image').default('novehicle.png'),
  purchaseDate: date('purchase_date').default(sql`CURRENT_DATE`),
  purchasePrice: numeric('purchase_price', { precision: 12, scale: 2 }).default('0'),
  status: vehicleStatusEnum('status').default('active'),
  fuelType: fuelTypeEnum('fuel_type').default('diesel'),
  tankCapacity: numeric('tank_capacity', { precision: 8, scale: 2 }).default('0'),
  initialHours: numeric('initial_hours', { precision: 10, scale: 2 }).default('0'),
  initialMileage: numeric('initial_mileage', { precision: 10, scale: 2 }).default('0'),
  currentHours: numeric('current_hours', { precision: 10, scale: 2 }).default('0'),
  currentMileage: numeric('current_mileage', { precision: 10, scale: 2 }).default('0'),
  notes: text('notes'),
  ...timestamps,
});

export const operators = pgTable('operators', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid(5)),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  cin: text('cin').unique(),
  phone: text('phone'),
  licenseNumber: text('license_number'),
  licenseExpiry: date('license_expiry'),
  hireDate: date('hire_date'),
  status: operatorStatusEnum('status').default('active'),
  hourlyRate: numeric('hourly_rate', { precision: 8, scale: 2 }),
  ...timestamps,
});

export const fields = pgTable('fields', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid(5)),
  name: text('name').notNull(),
  area: numeric('area', { precision: 8, scale: 2 }),
  location: jsonb('location'), // Store as {"lat": number, "lng": number}
  description: text('description'),
  ...timestamps,
});

export const operations = pgTable('operations', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid(5)),
  vehicleId: text('vehicle_id').references(() => vehicles.id).notNull(),
  operatorId: text('operator_id').references(() => operators.id, { onDelete: 'cascade' }).notNull(),
  operationType: text('operation_type').notNull(),
  fieldId: text('field_id').references(() => fields.id),
  date: date('date').notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  duration: numeric('duration', { precision: 8, scale: 2 }),
  startHours: numeric('start_hours', { precision: 10, scale: 2 }),
  endHours: numeric('end_hours', { precision: 10, scale: 2 }).default('0'),
  startMileage: numeric('start_mileage', { precision: 10, scale: 2 }),
  endMileage: numeric('end_mileage', { precision: 10, scale: 2 }).default('0'),
  areaCovered: numeric('area_covered', { precision: 10, scale: 2 }),
  weather: text('weather'),
  status: operationStatusEnum('status').default('planned'),
  notes: text('notes'),
  ...timestamps,
});

export const refuels = pgTable('refuels', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid(5)),
  vehicleId: text('vehicle_id').references(() => vehicles.id).notNull(),
  operatorId: text('operator_id').references(() => operators.id, { onDelete: 'cascade' }).notNull(),
  datetime: timestamp('datetime', { mode: 'string' }).notNull(),
  voucherNumber: text('voucher_number'),
  liters: numeric('liters', { precision: 8, scale: 2 }).notNull(),
  costPerLiter: numeric('cost_per_liter', { precision: 6, scale: 2 }),
  totalCost: numeric('total_cost', { precision: 10, scale: 2 }),
  hoursAtRefuel: numeric('hours_at_refuel', { precision: 10, scale: 2 }),
  mileageAtRefuel: numeric('mileage_at_refuel', { precision: 10, scale: 2 }),
  fuelLevelAfter: numeric('fuel_level_after', { precision: 5, scale: 1 }).default('100'),
  attendant: text('attendant'),
  notes: text('notes'),
  ...timestamps,
});

export const trackers = pgTable('trackers', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid(5)),
  deviceId: text('device_id').notNull().unique(),
  name: text('name').notNull(),
  operatorId: text('operator_id').references(() => operators.id, { onDelete: 'cascade' }),
  vehicleId: text('vehicle_id').references(() => vehicles.id, { onDelete: 'set null' }),
  status: trackerStatusEnum('status').default('active'),
  lastSeen: timestamp('last_seen', { mode: 'string' }),
  isOnline: boolean('is_online').default(false),
  manufacturer: text('manufacturer').default('Unknown'),
  mode: trackerModeEnum('mode').default('tracking'),
  source: trackerSourceEnum('source').notNull(),
  refreshInterval: integer('refresh_interval').default(60),
  refreshUnit: refreshUnitEnum('refresh_unit').default('s'),
  ...timestamps,
});

export const trackerHistory = pgTable('tracker_location_history', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid(5)),
  trackerId: text('tracker_id').references(() => trackers.id, { onDelete: 'cascade' }).notNull(),
  batteryLevel: integer('battery_level'),
  isMoving: boolean('is_moving').default(false),
  location: jsonb('location'),
  altitude: numeric('altitude', { precision: 8, scale: 2 }),
  speed: numeric('speed', { precision: 6, scale: 2 }),
  timestamp: timestamp('timestamp', { mode: 'string' }).defaultNow(),
});

export const alerts = pgTable('alerts', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid(5)),
  type: alertTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  priority: alertPriorityEnum('priority').default('medium'),
  status: alertStatusEnum('status').default('active'),
  vehicleId: text('vehicle_id').references(() => vehicles.id),
  operatorId: text('operator_id').references(() => operators.id),
  ...timestamps,
});

export const maintenance = pgTable('maintenance', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid(5)),
  vehicleId: text('vehicle_id').references(() => vehicles.id).notNull(),
  type: maintenanceTypeEnum('type').notNull(),
  title: text('title').notNull(),
  status: maintenanceStatusEnum('status').default('scheduled'),
  dueHours: numeric('due_hours', { precision: 10, scale: 2 }),
  cost: numeric('cost', { precision: 8, scale: 2 }),
  scheduledDate: date('scheduled_date'),
  completedAt: timestamp('completed_at', { mode: 'string' }),
  priority: text('priority').default('normal'),
  partsUsed: text('parts_used'),
  assignedTo: text('assigned_to'),
  notes: text('notes'),
  ...timestamps,
});

export const settings = pgTable('settings', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid(5)),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),

  maintenanceAlerts: boolean('maintenance_alerts').default(true),
  fuelLowAlerts: boolean('fuel_low_alerts').default(true),
  operationUpdates: boolean('operation_updates').default(false),
  systemNotifications: boolean('system_notifications').default(true),
  emailNotifications: boolean('email_notifications').default(false),
  smsNotifications: boolean('sms_notifications').default(false),

  twoFactorAuth: boolean('two_factor_auth').default(false),
  sessionTimeout: boolean('session_timeout').default(true),
  passwordExpiry: boolean('password_expiry').default(false),
  loginNotifications: boolean('login_notifications').default(true),

  autoTrackLocation: boolean('auto_track_location').default(true),
  maintenanceReminders: boolean('maintenance_reminders').default(true),
  fuelThresholdAlerts: boolean('fuel_threshold_alerts').default(true),
  operationAutoStart: boolean('operation_auto_start').default(false),

  fuelThreshold: text('fuel_threshold').default('25'),
  maintenanceInterval: text('maintenance_interval').default('250'),
  locationUpdateInterval: text('location_update_interval').default('30'),
  timeZone: text('time_zone').default('UTC'),
  language: languageEnum('language').default('en'),
  theme: text('theme').default('system'),

  ...timestamps,
});

//=====================================================================//
// ZOD VALIDATION SCHEMAS
//=====================================================================//

export const createUserSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(2, { message: t('users.validation.nameMinLength') }),
  email: z.string().email({ message: t('users.validation.emailInvalid') }),
  password: z.string().min(8, { message: t('users.validation.passwordMinLength') }).optional(),
});

export const createOperatorSchema = z.object({
  id: z.string().min(1).optional(),
  userId: z.string().min(1, { message: t('operators.validation.userIdRequired') }),
  cin: z.string().optional(),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.string().optional(),
  hireDate: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
  hourlyRate: z.string().optional(),
});

export const createRoleSchema = z.object({
  name: z.string().min(2, { message: t('roles.validation.nameRequired') }),
  description: z.string(),
});

export const createVehicleSchema = z.object({
  id: z.string().min(1).optional(),
  type: z.enum(['tractor', 'harvester', 'sprayer', 'seeder', 'cultivator', 'other']),
  name: z.string().min(2, { message: t('vehicles.validation.nameMinLength') }),
  brand: z.string().min(2, { message: t('vehicles.validation.brandRequired') }),
  model: z.string().min(2, { message: t('vehicles.validation.modelRequired') }),
  year: z.coerce.string().optional(),
  licensePlate: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.coerce.string().optional(),
  status: z.enum(['active', 'maintenance', 'retired']).default('active'),
  fuelType: z.enum(['diesel', 'gasoline', 'electric', 'hybrid']).default('diesel'),
  tankCapacity: z.coerce.string().optional(),
  initialHours: z.coerce.string().default('0'),
  initialMileage: z.coerce.string().default('0'),
  currentHours: z.coerce.string().default('0'),
  currentMileage: z.coerce.string().default('0'),
  notes: z.string().optional(),
});

export const createFieldSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(2, { message: t('fields.validation.nameMinLength') }),
  area: z.union([z.string(), z.number()]).optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number()
  }).nullable().optional(),
  description: z.string().optional(),
});

export const createOperationSchema = z.object({
  vehicleId: z.string().min(1, { message: t('operations.validation.vehicleRequired') }),
  operatorId: z.string().min(1, { message: t('operations.validation.operatorRequired') }),
  operationType: z.string().min(2, { message: t('operations.validation.typeRequired') }),
  fieldId: z.string().optional(),
  date: z.string().min(1, { message: t('operations.validation.dateRequired') }),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  startHours: z.string().min(1, { message: t('operations.validation.startHoursRequired') }),
  endHours: z.string().optional(),
  startMileage: z.string().optional(),
  endMileage: z.string().optional(),
  areaCovered: z.string().optional(),
  weather: z.string().optional(),
  status: z.enum(['planned', 'active', 'completed', 'cancelled']).default('planned'),
  notes: z.string().optional(),
});

export const createRefuelSchema = z.object({
  vehicleId: z.string().min(1, { message: t('refuels.validation.vehicleRequired') }),
  operatorId: z.string().min(1, { message: t('refuels.validation.operatorRequired') }),
  datetime: z.string().min(1, { message: t('refuels.validation.datetimeRequired') }),
  voucherNumber: z.string().optional(),
  liters: z.string().min(1, { message: t('refuels.validation.litersRequired') }),
  costPerLiter: z.string().optional(),
  totalCost: z.string().optional(),
  hoursAtRefuel: z.string().optional(),
  mileageAtRefuel: z.string().optional(),
  fuelLevelAfter: z.string().default('100'),
  attendant: z.string().optional(),
  notes: z.string().optional(),
});

export const createTrackerSchema = z.object({
  id: z.string().min(1).optional(),
  deviceId: z.string().min(1, { message: t('trackers.validation.deviceIdRequired') }),
  name: z.string().min(2, { message: t('trackers.validation.nameMinLength') }),
  operatorId: z.string().min(1).optional(),
  vehicleId: z.string().min(1).optional(),
  source: z.enum(['physical', 'phone']).default('physical'),
  mode: z.enum(['tracking', 'gprs', 'sms', 'sleep_time', 'sleep_shock', 'sleep_deep']).default('tracking'),
  status: z.enum(['active', 'inactive']).default('active'),
  lastSeen: z.string().optional(),
  isOnline: z.boolean().default(false),
  manufacturer: z.string().min(1).default('Unknown'),
  refreshInterval: z.number().min(20).max(999).default(60),
  refreshUnit: z.enum(['s', 'm', 'h']).default('s'),
});

export const updateTrackerSchema = z.object({
  id: z.string().min(1),
  deviceId: z.string().min(1).optional(),
  name: z.string().min(2).optional(),
  vehicleId: z.string().min(1).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  lastSeen: z.string().optional(),
  isOnline: z.boolean().optional(),
  manufacturer: z.string().min(1).optional(),
  refreshInterval: z.number().min(20).max(999).default(60),
  refreshUnit: z.enum(['s', 'm', 'h']).default('s'),
});

export const createHistorySchema = z.object({
  trackerId: z.string().min(1, { message: t('trackers.validation.trackerRequired') }),
  location: z.object({
    lat: z.number().min(-90).max(90, { message: t('trackers.validation.latitudeInvalid') }),
    lng: z.number().min(-180).max(180, { message: t('trackers.validation.longitudeInvalid') })
  }),
  altitude: z.number().optional(),
  speed: z.number().min(0).optional(),
  batteryLevel: z.number().min(0).max(100).optional(),
  isMoving: z.boolean().optional(),
  accuracy: z.number().min(0).optional(),
  timestamp: z.string().optional(),
});

export const updateTrackerStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['active', 'inactive']),
  lastSeen: z.string().optional(),
  isOnline: z.boolean().optional(),
});

export const alertValidationSchema = (t) => z.object({
  type: z.enum(['maintenance', 'fuel', 'security', 'operational', 'system']).optional(),
  title: z.string().min(1, { message: t('alerts.validation.titleRequired') }).optional(),
  message: z.string().min(1, { message: t('alerts.validation.messageRequired') }).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium').optional(),
  vehicleId: z.string().nullable().optional(),
  operatorId: z.string().nullable().optional(),
});

export const createMaintenanceSchema = z.object({
  vehicleId: z.string().min(1, { message: t('maintenance.validation.vehicleRequired') }),
  type: z.enum(['scheduled', 'repair', 'inspection', 'oil_change', 'filter_change', 'other']),
  title: z.string().min(1, { message: t('maintenance.validation.titleRequired') }),
  dueHours: z.string().optional(),
  cost: z.union([z.string(), z.number()]).optional(),
  scheduledDate: z.string().optional(),
  priority: z.string().default('normal'),
  partsUsed: z.string().nullable().optional(),
  assignedTo: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
  notes: z.string().optional(),
});

export const locationUpdateSchema = z.object({
  deviceId: z.string().min(1, { message: t('trackers.validation.deviceIdRequired') }),
  latitude: z.number().min(-90).max(90, { message: t('trackers.validation.latitudeInvalid') }),
  longitude: z.number().min(-180).max(180, { message: t('trackers.validation.longitudeInvalid') }),
  altitude: z.number().optional(),
  speed: z.number().min(0).optional(),
  batteryLevel: z.number().min(0).max(100).optional(),
  isMoving: z.boolean().optional(),
  accuracy: z.number().min(0).optional(),
  timestamp: z.string().optional(),
});

export const updateSettingsSchema = z.object({

  maintenanceAlerts: z.boolean().optional(),
  fuelLowAlerts: z.boolean().optional(),
  operationUpdates: z.boolean().optional(),
  systemNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),

  // Security Settings
  twoFactorAuth: z.boolean().optional(),
  sessionTimeout: z.boolean().optional(),
  passwordExpiry: z.boolean().optional(),
  loginNotifications: z.boolean().optional(),

  // Operational Settings
  autoTrackLocation: z.boolean().optional(),
  maintenanceReminders: z.boolean().optional(),
  fuelThresholdAlerts: z.boolean().optional(),
  operationAutoStart: z.boolean().optional(),

  // Preferences
  fuelThreshold: z.string().optional(),
  maintenanceInterval: z.string().optional(),
  locationUpdateInterval: z.string().optional(),
  timeZone: z.string().max(50).optional(),
  language: z.enum(['en', 'fr', 'ar', 'es']).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
});
