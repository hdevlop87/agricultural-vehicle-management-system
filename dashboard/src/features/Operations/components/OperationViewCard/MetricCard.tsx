import { Card } from '@/components/ui/card';
import React from 'react';

export const MetricCard= ({ icon, label, value, className = "" }) => {
  return (
    <Card className={` rounded-lg p-3 border border-gray-100 shadow-sm  gap-2`}>
      <div className="flex items-center gap-2 ">
        {icon}
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <div className="font-bold text-sm text-muted-foreground">
        {value}
      </div>
    </Card>
  );
};
