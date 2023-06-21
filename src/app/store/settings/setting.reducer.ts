import { createReducer, on } from '@ngrx/store';
import { setLastSyncDate } from './setting.actions';
import { monthStart } from './setting.util';

export interface settingStore {
  dateRange: {
    start: Date;
    end: Date;
  };
  lastSync: Date;
  bank: string;
}

export const initialState: settingStore = {
  dateRange: {
    start: monthStart(),
    end: new Date(),
  },
  lastSync: monthStart(),
  bank: 'HDFC',
};

export const settingReducer = createReducer(
  initialState,
  on(setLastSyncDate, (state, { date }) => ({ ...state, lastSync: date }))
);
