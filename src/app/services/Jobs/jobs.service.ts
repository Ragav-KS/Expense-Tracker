import { Injectable } from '@angular/core';
import {
  catchError,
  concatMap,
  filter,
  finalize,
  from,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { Transaction } from 'src/app/entities/transaction';
import { banksConfig } from 'src/res/banksConfig';
import { GmailService } from '../Gmail/gmail.service';
import { ContentProcessorService } from '../Processors/content-processor.service';
import { MailProcessorService } from '../Processors/mail-processor.service';
import { RepositoryService } from '../Repositories/repository.service';
import { PreferenceStoreService } from '../Storage/preference-store.service';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  private bankConfig!: typeof banksConfig[0];
  private lastSync!: Date;

  constructor(
    private gmailSrv: GmailService,
    private mailProcessorSrv: MailProcessorService,
    private contentProcessorSrv: ContentProcessorService,
    private repoSrvc: RepositoryService,
    private prefSrv: PreferenceStoreService
  ) {
    this.bankConfig = banksConfig.find((item) => item.name === 'HDFC')!;

    prefSrv.get('lastSync').then((lastSync) => {
      if (!lastSync) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);

        this.lastSync = startOfMonth;
      } else {
        this.lastSync = new Date(lastSync);
      }
    });
  }

  loadData(): Observable<Transaction> {
    let transactionsRepo = this.repoSrvc.transactionsRepo;

    let failed = false;
    return from(
      this.mailProcessorSrv.getMailList(
        this.gmailSrv.buildQuery({
          from: this.bankConfig.gmailFilter.from,
          after: this.lastSync,
          exclude: this.bankConfig.gmailFilter.exclude,
        })
      )
    )
      .pipe(
        concatMap((list) => from(list)),
        map((mail) => mail.id!),
        concatMap((mailId) =>
          from(
            transactionsRepo.findOneBy({
              id: mailId,
            })
          ).pipe(
            filter((trns) => {
              return trns == null;
            }),
            map(() => mailId)
          )
        ),
        concatMap(async (mailId) => {
          return this.gmailSrv.getMail(mailId);
        }),
        map((mail) => {
          let result = this.mailProcessorSrv.getPayload(mail);
          let transaction = new Transaction();
          // transaction.id = mail.id!;
          transaction.date = new Date(result.date);

          return {
            transaction: transaction,
            body: result.body,
          };
        }),
        map((payload) => {
          let result = this.contentProcessorSrv.extractText(payload.body);

          return {
            transaction: payload.transaction,
            text: result,
          };
        }),
        map((payloadText) => {
          let transaction = this.contentProcessorSrv.extractData(
            payloadText.transaction,
            payloadText.text
          );

          return transaction;
        }),
        tap((transaction) => {
          transactionsRepo.save(transaction);
        })
      )
      .pipe(
        catchError((err, caught) => {
          failed = true;
          caught.subscribe((transaction) => {
            console.log(`>>>> [JobsService] failed at ID: ${transaction.id}`);
          });

          return throwError(() => err);
        }),
        finalize(() => {
          if (!failed) {
            this.prefSrv.set('lastSync', new Date().toISOString());
          }
        })
      );
  }
}
