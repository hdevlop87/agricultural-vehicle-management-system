import { Controller,Headers, Get, t } from 'najm-api';
import { isAdmin,isOperator } from '@/server/shared/guards';
import { DashboardService } from './DashboardService';
import { OperationService } from '../operations';

@Controller('/dashboard')

export class DashboardController {
   constructor(
      private dashboardService: DashboardService,
      private operationService: OperationService,
   ) { }

   @Get('/widgets')
   async getWidgets(@Headers('authorization') authorization) {
      const widgets = await this.dashboardService.getWidgets(authorization);
      return {
         data: widgets,
         message: t('dashboard.success.widgetsRetrieved'),
         status: 'success'
      };
   }

   @Get('/operations/distribution')
   async getOperationDistribution() {
      const data = await this.operationService.getOperationDistribution();
      return {
         data,
         message: t('dashboard.success.operationDistributionRetrieved'),
         status: 'success'
      };
   }


}