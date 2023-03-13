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
import { Mail } from 'src/app/entities/mail';
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

  loadData(): Observable<Mail> {
    let transactionsRepo = this.repoSrvc.transactionsRepo;
    let mailsRepo = this.repoSrvc.mailsRepo;

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
            mailsRepo.findOneBy({
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

          let mailEntity = new Mail();
          mailEntity.id = mail.id!;
          mailEntity.meta_body = result.body;
          mailEntity.date_meta = new Date(result.date);

          return mailEntity;
        }),
        map((mail) => {
          mail.meta_body = this.contentProcessorSrv.extractText(mail.meta_body);

          return mail;
        }),
        map((mail) => {
          mail.transaction = this.contentProcessorSrv.extractData(
            mail.meta_body,
            mail.date_meta
          )!;

          return mail;
        }),
        tap((mail) => {
          mailsRepo.save(mail);
        })
      )
      .pipe(
        catchError((err, caught) => {
          failed = true;
          caught.subscribe((mail) => {
            console.log(`>>>> [JobsService] failed at ID: ${mail.id}`);
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
