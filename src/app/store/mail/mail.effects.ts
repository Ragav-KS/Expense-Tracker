import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  EMPTY,
  catchError,
  combineLatest,
  concatMap,
  exhaustMap,
  from,
  map,
  of,
  repeat,
} from 'rxjs';
import { IMail } from 'src/app/entities/mail';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { ContentProcessorService } from 'src/app/services/Processors/content-processor.service';
import { MailProcessorService } from 'src/app/services/Processors/mail-processor.service';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';
import { banksConfig } from 'src/res/banksConfig';
import { AppState } from '../app.index';
import { setLastSyncDate } from '../settings/setting.actions';
import { selectBank, selectLastSyncDate } from '../settings/setting.selectors';
import { refresh } from '../transaction/transaction.actions';
import {
  loadMails,
  loadMailsSuccess,
  loadTransactionMail,
} from './mail.actions';

@Injectable()
export class MailEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private gmailSrv: GmailService,
    private mailProcessorSrv: MailProcessorService,
    private contentProcessorSrv: ContentProcessorService,
    private repoSrv: RepositoryService
  ) {}

  lastMail: string = '';

  loadMailList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMails),
      concatLatestFrom((_) => [
        this.store.select(selectBank),
        this.store.select(selectLastSyncDate),
      ]),
      exhaustMap(([_, bank, lastSync]) => {
        const bankConfig = banksConfig.find((item) => item.name === bank)!;
        const query = this.gmailSrv.buildQuery({
          from: bankConfig.gmailFilter.from,
          after: lastSync,
          exclude: bankConfig.gmailFilter.exclude,
        });
        return this.mailProcessorSrv.getMailList(query);
      }),
      map((mailList) => mailList.map((mail) => mail.id!)),
      exhaustMap((mailIdList) => {
        if (mailIdList.length === 0) {
          throw new Error('Mail List empty');
        }
        const placeHolders = mailIdList.map((_) => `(?)`).join(', ');

        const mailsRepo = this.repoSrv.mailsRepo;

        return mailsRepo
          .query(
            `
                WITH v(id) AS (VALUES ${placeHolders})
                SELECT v.id FROM v
                EXCEPT
                SELECT id FROM mails;
              `,
            mailIdList
          )
          .then((arr: { id: string; lastMail?: boolean }[]) => {
            if (arr.at(-1)) {
              arr.at(-1)!.lastMail = true;
            }
            return arr;
          });
      }),
      concatMap((mailList) => {
        if (mailList.length) return from(mailList);
        else throw new Error('Mail List empty');
      }),
      map(({ id, lastMail }) =>
        loadTransactionMail({ mailId: id, skipSave: !lastMail })
      ),
      catchError((error: Error) => {
        if (error.message === 'Mail List empty') return of(loadMailsSuccess());
        else return EMPTY;
      }),
      repeat()
    )
  );

  loadTransactionMail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTransactionMail),
      concatMap(({ mailId, skipSave }) => {
        return combineLatest([
          of(skipSave),
          from(this.gmailSrv.getMail(mailId)).pipe(
            map((mail) => {
              const payload = this.mailProcessorSrv.getPayload(mail);
              const extractedBody = this.contentProcessorSrv.extractText(
                payload.body
              );
              const transaction = this.contentProcessorSrv.extractData(
                extractedBody,
                new Date(payload.date)
              );

              return {
                id: mail.id,
                transaction: transaction,
              } as IMail;
            }),
            concatMap((mail) => {
              const mailsRepo = this.repoSrv.mailsRepo;
              return mailsRepo.save(mail, {});
            })
          ),
        ]);
      }),
      concatMap(([skip, mail]) => {
        if (skip) {
          return EMPTY;
        } else {
          return from(this.repoSrv.save()).pipe(
            concatMap(() => [
              setLastSyncDate({ date: new Date() }),
              refresh(),
              loadMailsSuccess(),
            ])
          );
        }
      })
    )
  );
}
