'use client'

import React from 'react';
import InfoWidget from './InfoWidget';
import { useDashboardWidgets } from '@/features/Dashboard/hooks/useDashboardHooks';
import { useTranslation } from '@/hooks/useLanguage';

const Info = {
  "totalLiters": {
    titleKey: "dashboard.widgets.totalLiters",
    image: "refuelWidget"
  },
  "totalFields": {
    titleKey: "dashboard.widgets.totalFields",
    image: "fieldWidget"
  },
  "activeVehicles": {
    titleKey: "dashboard.widgets.activeVehicles",
    image: "tractorWidget"
  },
  "operationsToday": {
    titleKey: "dashboard.widgets.operationsToday",
    image: "plowWidget"
  },
  "totalOperators": {
    titleKey: "dashboard.widgets.totalOperators",
    image: "operatorWidget"
  }
};

const AdminWidgets = () => {
  const { widgets } = useDashboardWidgets();
  const { t } = useTranslation();
  const widgetValues = {
    totalLiters: widgets.totalLiters,
    totalFields: widgets.totalFields,
    activeVehicles: widgets.activeVehicles,
    operationsToday: widgets.operationsToday,
    totalOperators: widgets.totalOperators,
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full'>
      {Object.entries(widgetValues).map(([type, value]) => (
        <InfoWidget
          key={type}
          title={t(Info[type].titleKey)}
          image={Info[type].image}
          value={value}
        />
      ))}
    </div>
  );
};

export default AdminWidgets;