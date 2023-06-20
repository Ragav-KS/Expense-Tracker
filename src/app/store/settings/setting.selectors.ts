import { createFeatureSelector, createSelector } from '@ngrx/store';
import { settingStore } from './setting.reducer';

const selectSettingsFeature = createFeatureSelector<settingStore>('setting');

export const selectDateRange = createSelector(
  selectSettingsFeature,
  (transactionStore) => transactionStore.dateRange
);
