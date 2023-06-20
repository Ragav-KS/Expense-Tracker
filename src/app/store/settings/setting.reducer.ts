import { createReducer } from '@ngrx/store';

export interface settingStore {
  dateRange: {
    start: Date;
    end: Date;
  };
  bank: string;
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
  bank: 'HDFC',
};

export const settingReducer = createReducer(initialState);
