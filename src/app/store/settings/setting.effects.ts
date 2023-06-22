import { Injectable } from '@angular/core';
import {
  Actions,
  ROOT_EFFECTS_INIT,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs';
import { PreferenceStoreService } from 'src/app/services/Storage/preference-store.service';
import { setDateRange, setLastSyncDate } from './setting.actions';
import { monthStart } from './setting.util';
import { refresh } from '../transaction/transaction.actions';

@Injectable()
export class SettingEffects {
  constructor(
    private actions$: Actions,
    private prefSrv: PreferenceStoreService
  ) {}

  initLastSyncDate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() => this.prefSrv.get('lastSync')),
      map((val) => (val ? new Date(val) : monthStart())),
      map((date) => setLastSyncDate({ date: date }))
    )
  );

  setLastSyncDate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setLastSyncDate),
        tap(({ date }) => this.prefSrv.set('lastSync', date.toISOString()))
      ),
    { dispatch: false }
  );

  refreshAfterDateRangeChange$ = createEffect(() =>
    this.actions$.pipe(ofType(setDateRange), map(refresh))
  );
}
