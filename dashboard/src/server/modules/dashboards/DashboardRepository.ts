import { Repository } from '@/server/shared/decorators';
import { DB } from '@/server/database/db';
import { eq, count, sum, desc, gte, lte, and } from 'drizzle-orm';

@Repository()
export class DashboardRepository {
   declare db: DB;



}