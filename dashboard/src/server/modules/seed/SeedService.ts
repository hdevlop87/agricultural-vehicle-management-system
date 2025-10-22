import { Injectable,t } from 'najm-api';
import { FieldService } from '../fields/FieldService';
import { VehicleService } from '../vehicles/VehicleService';
import { OperatorService } from '../operators/OperatorService';
import { OperationService } from '../operations/OperationService';
import { RefuelService } from '../refuels/RefuelService';
import { TrackerService } from '../trackers/TrackerService';
import { UserService } from '../users/UserService';
import { RoleService } from '../roles';
import { MaintenanceService } from '../maintenance/MaintenanceService';
import { AlertService } from '../alerts/AlertService';
import operatorsData from './data/operators.json'
import vehiclesData from './data/vehicles.json'
import fieldsData from './data/fields.json'
import refuelData from './data/refuels.json'
import operationsData from './data/operations.json'
import trackersData from './data/trackers.json'
import maintenanceData from './data/maintenance.json'
import alertsData from './data/alerts.json'

@Injectable()
export class SeedService {
  constructor(
    public roleService: RoleService,
    public fieldService: FieldService,
    public vehicleService: VehicleService,
    public operatorService: OperatorService,
    public operationService: OperationService,
    public refuelService: RefuelService,
    public trackerService: TrackerService,
    public userService: UserService,
    public maintenanceService: MaintenanceService,
    public alertService: AlertService,
  ) { }

  private validateSeedingPermissions(API_KEY: string): void {
    const allowSeeding = process.env.ALLOW_SEEDING === 'true';
    const seedApiKey = process.env.NEXT_PUBLIC_SEED_API_KEY;

    if (!allowSeeding) {
      throw new Error(t('system.errors.seedingDisabled'));
    }

    if (!API_KEY || API_KEY !== seedApiKey) {
      throw new Error(t('system.errors.invalidSeedApiKey'));
    }
  }

  async seedSystem(API_KEY: string) {
    this.validateSeedingPermissions(API_KEY);

    console.log('🌱 Seeding system defaults...');
    const roles = await this.roleService.seedDefaultRoles();
    const adminUser = await this.userService.seedAdminUser();

    console.log('✅ System seeded successfully');
    return {
      roles,
      adminUser
    }
  }

  async seedDemo(API_KEY: string) {
    this.validateSeedingPermissions(API_KEY);

    await this.clearAll();

    console.log('🌱 Starting demo data seeding...');
    
    await this.fieldService.seedDemoFields(fieldsData);
    console.log('✅ Fields seeded');
    
    await this.vehicleService.seedDemoVehicles(vehiclesData);
    console.log('✅ Vehicles seeded');
    
    await this.operatorService.seedDemoOperators(operatorsData);
    console.log('✅ Operators seeded');

    await this.trackerService.seedDemoTrackers(trackersData);
    console.log('✅ Trackers seeded');

    await this.operationService.seedDemoOperations(operationsData);
    console.log('✅ Operations seeded');

    await this.refuelService.seedDemoRefuels(refuelData);
    console.log('✅ Refuels seeded');
    
    await this.maintenanceService.seedDemoMaintenances(maintenanceData);
    console.log('✅ Maintenances seeded');
    
    await this.alertService.seedDemoAlerts(alertsData);
    console.log('✅ Alerts seeded');

    console.log('🎉 Demo system seeded successfully');
    return 'Demo system seeded successfully'
  }

  async clearAll(): Promise<string> {
    console.log('🧹 Clearing all data...');
    
    await this.alertService.deleteAll();
    console.log('  - Alerts cleared');
    
    await this.maintenanceService.deleteAll();
    console.log('  - Maintenances cleared');
    
    await this.operationService.deleteAll();
    console.log('  - Operations cleared');
    
    await this.refuelService.deleteAll();
    console.log('  - Refuels cleared');
    
    await this.operatorService.deleteAll();
    console.log('  - Operators cleared');

    await this.trackerService.deleteAll();
    console.log('  - Trackers cleared');

    await this.vehicleService.deleteAll();
    console.log('  - Vehicles cleared');
    
    await this.fieldService.deleteAll();
    console.log('  - Fields cleared');
    
    await this.userService.deleteAll();
    console.log('  - Users cleared');
    
    console.log('✅ All data cleared');
    return 'All data cleared successfully';
  }
}