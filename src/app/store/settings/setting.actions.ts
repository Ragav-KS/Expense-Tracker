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
