import { createFeatureSelector, createSelector } from '@ngrx/store';
import { settingStore } from './setting.reducer';

const selectSettingsFeature = createFeatureSelector<settingStore>('setting');

export const selectDateRange = createSelector(
  selectSettingsFeature,
  (settingStore) => settingStore.dateRange
);

export const selectBank = createSelector(
  selectSettingsFeature,
  (settingStore) => settingStore.bank
);

export const selectLastSyncDate = createSelector(
  selectSettingsFeature,
  (settingStore) => settingStore.lastSync
);
