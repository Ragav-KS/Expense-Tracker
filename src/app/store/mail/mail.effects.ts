import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { loadMails } from './mail.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../app.index';
import { selectBank, selectLastSyncDate } from '../settings/setting.selectors';
import { refresh } from '../transaction/transaction.actions';
import { concatMap, exhaustMap, from, map, of } from 'rxjs';
import { banksConfig } from 'src/res/banksConfig';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { setLastSyncDate } from '../settings/setting.actions';
import { MailProcessorService } from 'src/app/services/Processors/mail-processor.service';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';

@Injectable()
export class MailEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private gmailSrv: GmailService,
    private mailProcessorSrv: MailProcessorService,
    private repoSrv: RepositoryService
  ) {}

  mailsRepo = this.repoSrv.mailsRepo;

  loadMails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMails),
      concatLatestFrom((_) => [
        this.store.select(selectBank),
        this.store.select(selectLastSyncDate),
      ]),
      exhaustMap(([_, bank, lastSync]) => {
        let bankConfig = banksConfig.find((item) => item.name === bank)!;
        let query = this.gmailSrv.buildQuery({
          from: bankConfig.gmailFilter.from,
          after: lastSync,
          exclude: bankConfig.gmailFilter.exclude,
        });
        return this.mailProcessorSrv.getMailList(query);
      }),
      concatMap((mailList) => from(mailList)),
      map(() => refresh())
    )
  );
}
