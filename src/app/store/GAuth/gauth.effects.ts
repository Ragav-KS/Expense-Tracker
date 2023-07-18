import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, of, switchMap } from 'rxjs';
import { GoogleAuth } from 'src/app/plugins/GoogleAuth';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { PreferenceStoreService } from 'src/app/services/Storage/preference-store.service';
import { login, setLoginState } from './gauth.actions';

@Injectable()
export class GAuthEffects {
  constructor(
    private actions$: Actions,
    private prefSrv: PreferenceStoreService,
    private gmailSrv: GmailService
  ) {}

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
}
