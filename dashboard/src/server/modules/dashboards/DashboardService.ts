import { Injectable } from 'najm-api';
import { FieldService } from '../fields/FieldService';
import { VehicleService } from '../vehicles/VehicleService';
import { OperationService } from '../operations/OperationService';
import { OperatorService } from '../operators/OperatorService';
import { RefuelService } from '../refuels/RefuelService';
import { AuthService } from '../auth';
import { RoleGuards } from '@/server/shared/guards';


@Injectable()
export class DashboardService {
  constructor(
    private authService: AuthService,
    private fieldService: FieldService,
    private vehicleService: VehicleService,
    private operationService: OperationService,
    private operatorService: OperatorService,
    private refuelService: RefuelService,
  ) { }

  // ===== WIDGETS METHOD - OPERATOR OR ADMIN =====
  async getWidgets(authorization: string) {
    const userProfile = await this.authService.getUserProfile(authorization);
    const isAdmin = await RoleGuards.isAdmin(authorization);
    if (isAdmin) {
      return await this.getAdminWidgets();
    }
    return await this.getOperatorWidgets(userProfile.operatorId);
  }

  // ===== ADMIN WIDGETS =====
  private async getAdminWidgets() {
    const [
      fieldCount,
      activeVehicles,
      todayOperations,
      operatorCount,
      fuelTotals
    ] = await Promise.all([
      this.fieldService.getCount(),
      this.vehicleService.getActiveVehicles(),
      this.operationService.getTodayOperations(),
      this.operatorService.getCount(),
      this.refuelService.getFuelTotals(),
    ]);

    return {
      totalFields: fieldCount.count,
      activeVehicles: activeVehicles.length,
      operationsToday: todayOperations.length,
      totalOperators: operatorCount.count,
      totalLiters: fuelTotals.totalLiters,
      totalCost: fuelTotals.totalCost,
    };
  }

  // ===== OPERATOR WIDGETS =====
  private async getOperatorWidgets(operatorId) {
    const [
      allOperationsCount,
      completedOperationsCount,
      fuelConsumption,
      completedDuration
    ] = await Promise.all([
      this.operatorService.getAllOperationCount(operatorId),
      this.operatorService.getCompletedOperationCount(operatorId),
      this.operatorService.getFuelConsumption(operatorId),
      this.operatorService.getCompletedOperationDuration(operatorId)
    ]);

    return {
      totalOperations: allOperationsCount.count,
      completedOperations: completedOperationsCount.count,
      refuelCount: fuelConsumption.refuelCount,
      totalLiters: fuelConsumption.totalLiters,
      totalCost: fuelConsumption.totalCost,
      totalWorkHours: completedDuration.totalDuration,
    };
  }



  // ===== INDIVIDUAL METHODS (KEEP FOR BACKWARD COMPATIBILITY) =====
  async getFuelTotals() {
    return await this.refuelService.getFuelTotals();
  }

  async getFieldCount() {
    return await this.fieldService.getCount();
  }

  async getActiveVehicles() {
    return await this.vehicleService.getActiveVehicles();
  }

  async getTodayOperations() {
    return await this.operationService.getTodayOperations();
  }

  async getOperatorCount() {
    return await this.operatorService.getCount();
  }

  async getVehicleCount() {
    return await this.vehicleService.getCount();
  }
}