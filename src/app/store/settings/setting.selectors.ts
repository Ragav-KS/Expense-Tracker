import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingStore } from './setting.reducer';

const selectSettingsFeature = createFeatureSelector<SettingStore>('setting');

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
