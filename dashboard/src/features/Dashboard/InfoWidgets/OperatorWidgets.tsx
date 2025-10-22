'use client'
import React from 'react';
import InfoWidget from './InfoWidget';
import { useTranslation } from '@/hooks/useLanguage';
import { useDashboardWidgets } from '../hooks/useDashboardHooks';

const OperatorInfo = {
  "completedOperations": {
    titleKey: "dashboard.widgets.completedOperations", 
    image: "plowWidget"
  },
  "totalLiters": {
    titleKey: "dashboard.widgets.totalLiters",
    image: "refuelWidget"
  },
  "totalWorkHours": {
    titleKey: "dashboard.widgets.totalWorkHours",
    image: "hoursWidget"
  }
};

const OperatorWidgets = () => {
  const { widgets } = useDashboardWidgets();
  const { t } = useTranslation();

  const operatorWidgetValues = {
    // totalOperations: widgets.totalOperations,
    completedOperations: widgets.completedOperations,
    // refuelCount: widgets.refuelCount,
    totalLiters: widgets.totalLiters,
    // totalCost: widgets.totalCost,
    totalWorkHours: widgets.totalWorkHours,
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 w-full'>
      {Object.entries(operatorWidgetValues).map(([type, value]) => (
        <InfoWidget
          key={type}
          title={t(OperatorInfo[type].titleKey)}
          image={OperatorInfo[type].image}
          value={value}
        />
      ))}
    </div>
  );
};

export default OperatorWidgets;