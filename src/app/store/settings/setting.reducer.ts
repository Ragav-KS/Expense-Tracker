import { createReducer, on } from '@ngrx/store';
import {
  setAppLoadStatus,
  setDateRange,
  setLastSyncDate,
} from './setting.actions';
import { monthStart } from './setting.util';

export type loadItem = 'googleScripts';
export type LoadStatus = 'Not Loaded' | 'Loading' | 'Failed' | 'Loaded';

export interface SettingStore {
  appLoadStatus: Record<loadItem, LoadStatus>;
  dateRange: {
    start: Date;
    end: Date;
  };
  lastSync: Date;
  bank: string;
}

export const initialState: SettingStore = {
  appLoadStatus: {
    googleScripts: 'Not Loaded',
  },
  dateRange: {
    start: monthStart(),
    end: new Date(),
  },
  lastSync: monthStart(),
  bank: 'HDFC',
};

export const settingReducer = createReducer(
  initialState,
  on(setDateRange, (state, { mode, dateRange }) => {
    switch (mode) {
      case 'current':
        return Object.assign({}, state, {
          dateRange: {
            start: monthStart(),
            end: new Date(),
          },
        });
      case 'previous':
        let prevMonth = new Date();
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        return Object.assign({}, state, {
          dateRange: {
            start: monthStart(prevMonth),
            end: monthStart(),
          },
        });
      case 'custom':
        return Object.assign({}, state, {
          dateRange: {
            start: dateRange!.start,
            end: dateRange!.end,
          },
        });
    }
  }),
  on(setAppLoadStatus, (state, loadStatus) => {
    return Object.assign({}, state, {
      appLoadStatus: {
        ...state.appLoadStatus,
        ...loadStatus,
      },
    });
  }),
  on(setLastSyncDate, (state, { date }) => ({ ...state, lastSync: date }))
);
