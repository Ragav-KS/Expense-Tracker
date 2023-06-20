import { createReducer } from '@ngrx/store';

export interface settingStore {
  dateRange: {
    start: Date;
    end: Date;
  };
}

const monthStart = () => {
  let monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  return monthStart;
};

export const initialState: settingStore = {
  dateRange: {
    start: monthStart(),
    end: new Date(),
  },
};

export const settingReducer = createReducer(initialState);
