import { Controller, Get, Post, Put, Delete, Params, Body, Query, t } from 'najm-api';
import { TrackerService } from './TrackerService';
import { isAdmin } from '@/server/shared/guards';


@Controller('/trackers')

export class TrackerController {
  constructor(
    private trackerService: TrackerService,
  ) { }

  @Get()
  @isAdmin()
  async getTrackers() {
    const trackers = await this.trackerService.getAll();
    return {
      data: trackers,
      message: t('trackers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/count')
  @isAdmin()
  async getTrackersCount() {
    const count = await this.trackerService.getCount();
    return {
      data: count,
      message: t('trackers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/online')
  @isAdmin()
  async getOnlineTrackers() {
    const trackers = await this.trackerService.getOnlineTrackers();
    return {
      data: trackers,
      message: t('trackers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/offline')
  @isAdmin()
  async getOfflineTrackers() {
    const trackers = await this.trackerService.getOfflineTrackers();
    return {
      data: trackers,
      message: t('trackers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/status/:status')
  @isAdmin()
  async getTrackersByStatus(@Params('status') status) {
    const trackers = await this.trackerService.getByStatus(status);
    return {
      data: trackers,
      message: t('trackers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/vehicle/:vehicleId')
  @isAdmin()
  async getTrackerByVehicle(@Params('vehicleId') vehicleId) {
    const tracker = await this.trackerService.getByVehicleId(vehicleId);
    return {
      data: tracker,
      message: t('trackers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/device/:deviceId')
  @isAdmin()
  async getTrackerByDeviceId(@Params('deviceId') deviceId) {
    const tracker = await this.trackerService.getByDeviceId(deviceId);
    return {
      data: tracker,
      message: t('trackers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/location/current')
  @isAdmin()
  async getCurrentLocation(@Params('id') id) {
    const currentLocation = await this.trackerService.getCurrentLocation(id);
    return {
      data: currentLocation,
      message: t('trackers.success.currentLocationRetrieved'),
      status: 'success'
    };
  }

  @Get('/:id/history')
  @isAdmin()
  async getTrackerLocationHistory(@Params('id') id, @Query('limit') limit?) {
    const history = await this.trackerService.getLocationHistory(id, limit ? parseInt(limit) : 50);
    return {
      data: history,
      message: t('trackers.success.historyRetrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @isAdmin()
  async getTracker(@Params('id') id) {
    const tracker = await this.trackerService.getById(id);
    return {
      data: tracker,
      message: t('trackers.success.retrieved'),
      status: 'success'
    };
  }


  @Post()
  @isAdmin()
  async createTracker(@Body() data) {
    const tracker = await this.trackerService.create(data);
    return {
      data: tracker,
      message: t('trackers.success.created'),
      status: 'success'
    };
  }

  @Put('/:id/status')
  @isAdmin()
  async updateTrackerStatus(@Params('id') id, @Body() body) {
    const updatedTracker = await this.trackerService.updateStatus(id, body.status);
    return {
      data: updatedTracker,
      message: t('trackers.success.statusUpdated'),
      status: 'success'
    };
  }

  @Put('/:id')
  @isAdmin()
  async updateTracker(@Params('id') id, @Body() data) {
    const tracker = await this.trackerService.update(id, data);
    return {
      data: tracker,
      message: t('trackers.success.updated'),
      status: 'success'
    };
  }

  @Put('/bulk')
  @isAdmin()
  async bulkUpdate(@Body() data: { ids, updates }) {
    const result = await this.trackerService.bulkUpdate(data.ids, data.updates);
    return {
      data: result,
      message: t('trackers.success.bulkUpdated'),
      status: 'success'
    };
  }

  @Put('/offline/mark')
  @isAdmin()
  async markOfflineTrackers(@Body() body: { timeoutMinutes? }) {
    const { timeoutMinutes = 30 } = body;
    const result = await this.trackerService.markOfflineTrackers(timeoutMinutes);
    return {
      data: result,
      message: t('trackers.success.offlineMarkingComplete'),
      status: 'success'
    };
  }

  @Delete('/:id')
  @isAdmin()
  async deleteTracker(@Params('id') id) {
    const result = await this.trackerService.delete(id);
    return {
      data: result,
      message: t('trackers.success.deleted'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedTrackers(@Body() data) {
    const result = await this.trackerService.seedDemoTrackers(data);
    return {
      data: result,
      message: t('trackers.success.seeded'),
      status: 'success'
    };
  }

  @Delete()
  @isAdmin()
  async deleteAllTrackers() {
    const result = await this.trackerService.deleteAll();
    return {
      data: result,
      message: t('trackers.success.allDeleted'),
      status: 'success'
    };
  }

  @Post('/device/location')
  async updateLocation(@Body() data) {
    const result = await this.trackerService.updateLocation(data);
    return {
      data: result,
      message: t('trackers.success.locationUpdated'),
      status: 'success'
    };
  }

  @Post('/device/status')
  async updateStatusFromDevice(@Body() data) {
    const tracker = await this.trackerService.updateStatusFromDevice(data);
    return {
      data: tracker,
      message: t('trackers.success.statusUpdated'),
      status: 'success'
    };
  }
}