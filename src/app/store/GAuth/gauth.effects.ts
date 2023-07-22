import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  Actions,
  ROOT_EFFECTS_INIT,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { concatMap, filter, map, of, switchMap, takeWhile } from 'rxjs';
import { GoogleAuth } from 'src/app/plugins/GoogleAuth';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { PreferenceStoreService } from 'src/app/services/Storage/preference-store.service';
import { setAppLoadStatus } from '../settings/setting.actions';
import { login, setLoginState } from './gauth.actions';

@Injectable()
export class GAuthEffects {
  constructor(
    private actions$: Actions,
    private prefSrv: PreferenceStoreService,
    private gmailSrv: GmailService
  ) {}

  initGauth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      concatMap(() =>
        GoogleAuth.initialize({ androidClientID: '', webClientID: '' })
      ),
      concatMap(() => this.gmailSrv.initialize()),
      map(() => setAppLoadStatus({ googleScripts: 'Loaded' }))
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      concatMap(({ account }) =>
        account ? of(account) : this.prefSrv.get('userID')
      ),
      switchMap((account) =>
        GoogleAuth.getToken({
          selectedAccount: account,
        })
      ),
      map(({ token }) => {
        this.gmailSrv.setToken(token);
      }),
      concatMap(() => {
        return this.gmailSrv.getUserID();
      }),
      map((loggedInAccount) => {
        return setLoginState({ loggedIn: true, account: loggedInAccount });
      })
    )
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setAppLoadStatus),
      filter((loadingStatus) => loadingStatus.googleScripts === 'Loaded'),
      concatMap(() => this.prefSrv.get('userID')),
      takeWhile(
        (account) => account !== null && Capacitor.getPlatform() !== 'web'
      ),
      map((account) => login({ account: account }))
    )
  );
}
