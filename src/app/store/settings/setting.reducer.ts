import { createReducer, on } from '@ngrx/store';
import { setDateRange, setLastSyncDate } from './setting.actions';
import { monthStart } from './setting.util';

export interface SettingStore {
  dateRange: {
    start: Date;
    end: Date;
  };
  lastSync: Date;
  bank: string;
}

export const initialState: SettingStore = {
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
  on(setLastSyncDate, (state, { date }) => ({ ...state, lastSync: date }))
);
