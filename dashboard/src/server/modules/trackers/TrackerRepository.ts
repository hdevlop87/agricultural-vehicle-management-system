import { DB } from '@/server/database/db';
import { trackers, vehicles, trackerHistory, operators, users } from '@/server/database/schema';
import { Repository } from '@/server/shared/decorators';
import { count, eq, desc, sql, and, or, gte, lte, isNull, lt, isNotNull } from 'drizzle-orm';

@Repository()
export class TrackerRepository {

  declare db: DB;

  private getTracker() {
    return {
      id: trackers.id,
      deviceId: trackers.deviceId,
      name: trackers.name,
      operatorId: trackers.operatorId,
      vehicleId: trackers.vehicleId,
      vehicleName: vehicles.name,
      vehicleBrand: vehicles.brand,
      vehicleModel: vehicles.model,
      vehicleLicensePlate: vehicles.licensePlate,
      status: trackers.status,
      manufacturer: trackers.manufacturer,
      source: trackers.source,
      mode: trackers.mode,
      refreshInterval: trackers.refreshInterval,
      refreshUnit: trackers.refreshUnit,
      lastSeen: trackers.lastSeen,
      isOnline: trackers.isOnline,
      createdAt: trackers.createdAt,
      updatedAt: trackers.updatedAt,
    };
  }

  async getCount() {
    const [trackersCount] = await this.db
      .select({ count: count() })
      .from(trackers);
    return trackersCount;
  }

  async getAll() {
    return await this.db
      .select(this.getTracker())
      .from(trackers)
      .leftJoin(vehicles, eq(trackers.vehicleId, vehicles.id))
      .orderBy(desc(trackers.createdAt));
  }

  async getById(id: string) {
    const [existingTracker] = await this.db
      .select(this.getTracker())
      .from(trackers)
      .leftJoin(vehicles, eq(trackers.vehicleId, vehicles.id))
      .where(eq(trackers.id, id))
      .limit(1);
    return existingTracker;
  }

  async getByDeviceId(deviceId: string) {
    const [existingTracker] = await this.db
      .select(this.getTracker())
      .from(trackers)
      .leftJoin(vehicles, eq(trackers.vehicleId, vehicles.id))
      .where(eq(trackers.deviceId, deviceId))
      .limit(1);
    return existingTracker;
  }

  async getByVehicleId(vehicleId) {
    const [existingTracker] = await this.db
      .select(this.getTracker())
      .from(trackers)
      .leftJoin(vehicles, eq(trackers.vehicleId, vehicles.id))
      .where(eq(trackers.vehicleId, vehicleId))
      .limit(1);
    return existingTracker;
  }

  async getByStatus(status) {
    return await this.db
      .select(this.getTracker())
      .from(trackers)
      .leftJoin(vehicles, eq(trackers.vehicleId, vehicles.id))
      .where(eq(trackers.status, status))
      .orderBy(desc(trackers.createdAt));
  }

  async getOnlineTrackers() {
    return await this.db
      .select(this.getTracker())
      .from(trackers)
      .leftJoin(vehicles, eq(trackers.vehicleId, vehicles.id))
      .where(
        and(
          eq(trackers.status, 'active'),
          eq(trackers.isOnline, true)
        )
      )
      .orderBy(desc(trackers.lastSeen));
  }

  async getOfflineTrackers() {
    return await this.db
      .select(this.getTracker())
      .from(trackers)
      .leftJoin(vehicles, eq(trackers.vehicleId, vehicles.id))
      .where(
        and(
          eq(trackers.status, 'active'),
          eq(trackers.isOnline, false)
        )
      )
      .orderBy(desc(trackers.lastSeen));
  }

  async create(data: any) {
    const [newTracker] = await this.db
      .insert(trackers)
      .values(data)
      .returning();
    return newTracker;
  }

  async update(id: string, data: any) {
    const [updatedTracker] = await this.db
      .update(trackers)
      .set(data)
      .where(eq(trackers.id, id))
      .returning();
    return updatedTracker;
  }

  async delete(id: string) {
    const [deletedTracker] = await this.db
      .delete(trackers)
      .where(eq(trackers.id, id))
      .returning();
    return deletedTracker;
  }

  async deleteAll() {
    const allTrackers = await this.db
      .select()
      .from(trackers)
      .orderBy(desc(trackers.createdAt));

    const deletedTrackers = await this.db
      .delete(trackers)
      .returning();

    return {
      deletedCount: deletedTrackers.length,
      deletedTrackers: deletedTrackers
    };
  }

  async markOfflineTrackers(timeoutMinutes: number = 30) {
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - timeoutMinutes);

    const updatedTrackers = await this.db
      .update(trackers)
      .set({ isOnline: false })
      .where(
        and(
          eq(trackers.isOnline, true),
          or(
            isNull(trackers.lastSeen),
            lt(trackers.lastSeen, cutoffTime.toISOString())
          )
        )
      )
      .returning();

    return {
      markedOffline: updatedTrackers.length,
      cutoffTime: cutoffTime.toISOString()
    };
  }

  async checkVehicleHasTracker(vehicleId: string) {
    const [existingTracker] = await this.db
      .select({ id: trackers.id })
      .from(trackers)
      .where(eq(trackers.vehicleId, vehicleId))
      .limit(1);

    return !!existingTracker;
  }

  async getByOperatorId(operatorId: string) {
    const [existingTracker] = await this.db
      .select(this.getTracker())
      .from(trackers)
      .leftJoin(vehicles, eq(trackers.vehicleId, vehicles.id))
      .where(eq(trackers.operatorId, operatorId))
      .limit(1);
    return existingTracker;
  }

  async getPhoneTrackers() {
    return await this.db
      .select(this.getTracker())
      .from(trackers)
      .leftJoin(vehicles, eq(trackers.vehicleId, vehicles.id))
      .where(eq(trackers.source, 'phone'))
      .orderBy(desc(trackers.createdAt));
  }

  async createLocationHistory(data: any) {
    const [newEntry] = await this.db
      .insert(trackerHistory)
      .values({
        trackerId: data.trackerId,
        location: data.location,
        altitude: data.altitude,
        speed: data.speed,
        batteryLevel: data.batteryLevel,
        isMoving: data.isMoving,
        timestamp: data.timestamp || new Date().toISOString()
      })
      .returning();
    return newEntry;
  }

  async getLocationHistory(trackerId: string, limit: number = 50) {
    return await this.db
      .select()
      .from(trackerHistory)
      .where(eq(trackerHistory.trackerId, trackerId))
      .orderBy(desc(trackerHistory.timestamp))
      .limit(limit);
  }

  async getTrackersWithVehicleInfo() {
    return await this.db
      .select({
        trackerId: trackers.id,
        trackerName: trackers.name,
        deviceId: trackers.deviceId,
        vehicleId: vehicles.id,
        vehicleName: vehicles.name,
        vehicleBrand: vehicles.brand,
        vehicleModel: vehicles.model,
        isOnline: trackers.isOnline,
        lastSeen: trackers.lastSeen,
      })
      .from(trackers)
      .innerJoin(vehicles, eq(trackers.vehicleId, vehicles.id))
      .where(eq(trackers.status, 'active'))
      .orderBy(desc(trackers.lastSeen));
  }
}