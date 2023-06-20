import { createAction, props } from '@ngrx/store';

export const setDateRange = createAction(
  '[Setting] Set Date Range',
  props<{
    mode: 'current' | 'previous' | 'custom';
    dateRange?: {
      start: Date;
      end: Date;
    };
  }>
);

export const setLastSyncDate = createAction(
  '[Setting] Set Last Sync Date',
  props<{ date: Date }>()
);
