import { useQuery } from '@tanstack/react-query';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import * as operationApi from '@/services/operationApi';

export const useActiveOperation = () => {
  const { user, isOperator } = useRoleGuard();

  return useQuery({
    queryKey: ['active-operation', user?.id],
    queryFn: async () => {
      if (!user?.id || !isOperator()) return null;

      try {
        // Get today's operations for this operator
        const operations = await operationApi.getTodayOperationsByOperatorApi({ operatorId: user.id });

        // Find active operation
        const activeOperation = operations.find(op => op.status === 'active');
        return activeOperation || null;
      } catch (error) {
        console.error('Error fetching active operation:', error);
        return null;
      }
    },
    enabled: !!user?.id && isOperator(),
    refetchInterval: 60000, // Check every minute
    retry: 1,
  });
};