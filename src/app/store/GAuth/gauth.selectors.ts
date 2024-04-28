import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GAuthStore } from './gauth.reducer';

const selectGauthFeature = createFeatureSelector<GAuthStore>('gAuth');

export const selectLoginStatus = createSelector(
  selectGauthFeature,
  (gAuthStore) => gAuthStore.loggedIn
);
