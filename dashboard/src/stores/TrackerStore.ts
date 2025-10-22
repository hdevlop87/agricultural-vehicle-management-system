import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import createSelectors from './selectors';

interface TrackerLocation {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  altitude?: number;
  timestamp: string;
}

interface TrackerStatus {
  battery?: number;
  signal?: number;
  temperature?: number;
  voltage?: number;
}

interface TrackerAlarm {
  alarmType: string;
  message: string;
  timestamp: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface Tracker {
  id: string;
  name?: string;
  status: 'online' | 'offline' | 'idle' | 'alarm';
  location?: TrackerLocation;
  statusData?: TrackerStatus;
  lastAlarm?: TrackerAlarm;
  lastUpdate: Date;
  isActive: boolean;
}

interface TrackerWidgets {
  totalTrackers: number;
  onlineTrackers: number;
  offlineTrackers: number;
  activeAlarms: number;
  avgBattery: number;
}

interface TrackerState {
  isBrokerConnected: boolean;
  trackers: Record<string, Tracker>;
  selectedTracker: string | null;
  recentActivity: string[];
  widgets: TrackerWidgets;
  mapCenter: { lat: number; lng: number };
  mapZoom: number;

  // Connection methods
  setIsBrokerConnected: (connected: boolean) => void;
  
  // Tracker methods
  updateTrackerLocation: (trackerId: string, location: TrackerLocation) => void;
  updateTrackerStatus: (trackerId: string, status: TrackerStatus) => void;
  setTrackerOffline: (trackerId: string) => void;
  triggerTrackerAlarm: (trackerId: string, alarm: TrackerAlarm) => void;
  addTracker: (tracker: Tracker) => void;
  removeTracker: (trackerId: string) => void;
  setTrackerName: (trackerId: string, name: string) => void;
  
  // Selection methods
  setSelectedTracker: (trackerId: string | null) => void;
  getSelectedTracker: () => Tracker | null;
  
  // Activity methods
  addActivity: (activity: string) => void;
  clearActivity: () => void;
  
  // Map methods
  setMapCenter: (lat: number, lng: number) => void;
  setMapZoom: (zoom: number) => void;
  
  // Widget methods
  updateWidgets: () => void;
  
  // Utility methods
  getAllTrackers: () => Tracker[];
  getOnlineTrackers: () => Tracker[];
  getOfflineTrackers: () => Tracker[];
  getTrackersWithAlarms: () => Tracker[];
}

const trackerStore = create<TrackerState>()(
  devtools((set, get) => ({
    isBrokerConnected: false,
    trackers: {},
    selectedTracker: null,
    recentActivity: [],
    mapCenter: { lat: 0, lng: 0 },
    mapZoom: 10,
    
    widgets: {
      totalTrackers: 0,
      onlineTrackers: 0,
      offlineTrackers: 0,
      activeAlarms: 0,
      avgBattery: 0,
    },

    setIsBrokerConnected: (isBrokerConnected) => set({ isBrokerConnected }),

    updateTrackerLocation: (trackerId, location) => {
      set((state) => {
        const tracker = state.trackers[trackerId] || {
          id: trackerId,
          status: 'online',
          lastUpdate: new Date(),
          isActive: true,
        };

        const updatedTracker = {
          ...tracker,
          location,
          status: 'online' as const,
          lastUpdate: new Date(),
          isActive: true,
        };

        return {
          trackers: {
            ...state.trackers,
            [trackerId]: updatedTracker,
          },
        };
      });
      
      get().addActivity(`Tracker ${trackerId} location updated`);
      get().updateWidgets();
    },

    updateTrackerStatus: (trackerId, statusData) => {
      set((state) => {
        const tracker = state.trackers[trackerId] || {
          id: trackerId,
          status: 'online',
          lastUpdate: new Date(),
          isActive: true,
        };

        const updatedTracker = {
          ...tracker,
          statusData: { ...tracker.statusData, ...statusData },
          lastUpdate: new Date(),
        };

        return {
          trackers: {
            ...state.trackers,
            [trackerId]: updatedTracker,
          },
        };
      });
      
      get().updateWidgets();
    },

    setTrackerOffline: (trackerId) => {
      set((state) => {
        const tracker = state.trackers[trackerId];
        if (!tracker) return state;

        return {
          trackers: {
            ...state.trackers,
            [trackerId]: {
              ...tracker,
              status: 'offline',
              lastUpdate: new Date(),
              isActive: false,
            },
          },
        };
      });
      
      get().addActivity(`Tracker ${trackerId} went offline`);
      get().updateWidgets();
    },

    triggerTrackerAlarm: (trackerId, alarm) => {
      set((state) => {
        const tracker = state.trackers[trackerId] || {
          id: trackerId,
          status: 'alarm',
          lastUpdate: new Date(),
          isActive: true,
        };

        const updatedTracker = {
          ...tracker,
          status: 'alarm' as const,
          lastAlarm: alarm,
          lastUpdate: new Date(),
        };

        return {
          trackers: {
            ...state.trackers,
            [trackerId]: updatedTracker,
          },
        };
      });
      
      get().addActivity(`🚨 ALARM: Tracker ${trackerId} - ${alarm.message}`);
      get().updateWidgets();
    },

    addTracker: (tracker) => {
      set((state) => ({
        trackers: {
          ...state.trackers,
          [tracker.id]: tracker,
        },
      }));
      
      get().addActivity(`Tracker ${tracker.id} added`);
      get().updateWidgets();
    },

    removeTracker: (trackerId) => {
      set((state) => {
        const { [trackerId]: removed, ...remainingTrackers } = state.trackers;
        return { trackers: remainingTrackers };
      });
      
      get().addActivity(`Tracker ${trackerId} removed`);
      get().updateWidgets();
    },

    setTrackerName: (trackerId, name) => {
      set((state) => {
        const tracker = state.trackers[trackerId];
        if (!tracker) return state;

        return {
          trackers: {
            ...state.trackers,
            [trackerId]: { ...tracker, name },
          },
        };
      });
    },

    setSelectedTracker: (selectedTracker) => set({ selectedTracker }),
    
    getSelectedTracker: () => {
      const { selectedTracker, trackers } = get();
      return selectedTracker ? trackers[selectedTracker] || null : null;
    },

    addActivity: (activity) => {
      set((state) => ({
        recentActivity: [
          `${new Date().toLocaleTimeString()} - ${activity}`,
          ...state.recentActivity.slice(0, 49), // Keep last 50 activities
        ],
      }));
    },

    clearActivity: () => set({ recentActivity: [] }),

    setMapCenter: (lat, lng) => set({ mapCenter: { lat, lng } }),
    setMapZoom: (mapZoom) => set({ mapZoom }),

    updateWidgets: () => {
      const trackers = Object.values(get().trackers);
      const totalTrackers = trackers.length;
      const onlineTrackers = trackers.filter(t => t.status === 'online').length;
      const offlineTrackers = trackers.filter(t => t.status === 'offline').length;
      const activeAlarms = trackers.filter(t => t.status === 'alarm').length;
      
      const batteriesWithData = trackers
        .filter(t => t.statusData?.battery !== undefined)
        .map(t => t.statusData!.battery!);
      
      const avgBattery = batteriesWithData.length > 0
        ? batteriesWithData.reduce((sum, battery) => sum + battery, 0) / batteriesWithData.length
        : 0;

      set({
        widgets: {
          totalTrackers,
          onlineTrackers,
          offlineTrackers,
          activeAlarms,
          avgBattery: Math.round(avgBattery),
        },
      });
    },

    getAllTrackers: () => Object.values(get().trackers),
    getOnlineTrackers: () => Object.values(get().trackers).filter(t => t.status === 'online'),
    getOfflineTrackers: () => Object.values(get().trackers).filter(t => t.status === 'offline'),
    getTrackersWithAlarms: () => Object.values(get().trackers).filter(t => t.status === 'alarm'),
  }))
);

export const useTrackerStore = createSelectors(trackerStore);

export const useBrokerConnection = () => useTrackerStore.use.isBrokerConnected();
export const useAllTrackers = () => useTrackerStore.use.trackers();
export const useSelectedTracker = () => useTrackerStore.use.selectedTracker();
export const useTrackerActivity = () => useTrackerStore.use.recentActivity();
export const useTrackerWidgets = () => useTrackerStore.use.widgets();
export const useMapSettings = () => ({
  center: useTrackerStore.use.mapCenter(),
  zoom: useTrackerStore.use.mapZoom(),
});

// Utility selectors
export const useOnlineTrackers = () => {
  const trackers = useTrackerStore.use.trackers();
  return Object.values(trackers).filter(t => t.status === 'online');
};

export const useOfflineTrackers = () => {
  const trackers = useTrackerStore.use.trackers();
  return Object.values(trackers).filter(t => t.status === 'offline');
};

export const useAlarmedTrackers = () => {
  const trackers = useTrackerStore.use.trackers();
  return Object.values(trackers).filter(t => t.status === 'alarm');
};