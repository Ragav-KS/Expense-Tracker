import { createAction, props } from '@ngrx/store';
import { LoadStatus, loadItem } from './setting.reducer';

export const setDateRange = createAction(
  '[Setting] Set Date Range',
  props<{
    mode: 'current' | 'previous' | 'custom';
    dateRange?: {
      start: Date;
      end: Date;
    };
  }>()
);

export const setLastSyncDate = createAction(
  '[Setting] Set Last Sync Date',
  props<{ date: Date }>()
);

export const setAppLoadStatus = createAction(
  '[Setting] Set App Load Status',
  props<Partial<Record<loadItem, LoadStatus>>>()
);
