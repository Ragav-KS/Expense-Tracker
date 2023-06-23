import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, exhaustMap, from, map, tap } from 'rxjs';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { MailProcessorService } from 'src/app/services/Processors/mail-processor.service';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';
import { banksConfig } from 'src/res/banksConfig';
import { AppState } from '../app.index';
import { selectBank, selectLastSyncDate } from '../settings/setting.selectors';
import { loadMails } from './mail.actions';

@Injectable()
export class MailEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private gmailSrv: GmailService,
    private mailProcessorSrv: MailProcessorService,
    private repoSrv: RepositoryService
  ) {}

  loadMails$ = createEffect(
    () =>
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
        map((mailList) => mailList.map((mail) => mail.id!)),
        exhaustMap((mailIdList) => {
          const placeHolders = mailIdList.map((_) => `(?)`).join(', ');

          const mailsRepo = this.repoSrv.mailsRepo;

          return mailsRepo
            .query(
              `
                VALUES ${placeHolders}
                EXCEPT
                SELECT id FROM mails;
              `,
              mailIdList
            )
            .then((arr: { column1: string }[]) => {
              return arr.map((obj) => obj.column1);
            });
        }),
        concatMap((mailList) => from(mailList)),
        tap((id) => console.log(id))
      ),
    { dispatch: false }
  );
}
