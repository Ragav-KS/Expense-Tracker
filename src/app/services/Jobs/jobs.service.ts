import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { concatMap, filter, from, map, Observable } from 'rxjs';
import { IMail } from 'src/app/entities/mail';
import { AppState } from 'src/app/store/app.index';
import { setLastSyncDate } from 'src/app/store/settings/setting.actions';
import { selectLastSyncDate } from 'src/app/store/settings/setting.selectors';
import { refresh } from 'src/app/store/transaction/transaction.actions';
import { banksConfig } from 'src/res/banksConfig';
import { GmailService } from '../Gmail/gmail.service';
import { ContentProcessorService } from '../Processors/content-processor.service';
import { MailProcessorService } from '../Processors/mail-processor.service';
import { RepositoryService } from '../Repositories/repository.service';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  private bankConfig!: (typeof banksConfig)[0];
  private lastSync!: Date;

  constructor(
    private gmailSrv: GmailService,
    private mailProcessorSrv: MailProcessorService,
    private contentProcessorSrv: ContentProcessorService,
    private repoSrv: RepositoryService,
    private store: Store<AppState>
  ) {
    this.bankConfig = banksConfig.find((item) => item.name === 'HDFC')!;

    this.store.select(selectLastSyncDate).subscribe((date) => {
      this.lastSync = date;
    });
  }

  async fetchMails() {
    return new Promise<void>((resolve, reject) => {
      this.fetchMailsObservable().subscribe({
        next: (transaction) => {
          console.log(transaction);
        },
        complete: async () => {
          await this.repoSrv.save();
          this.store.dispatch(refresh());
          this.store.dispatch(setLastSyncDate({ date: new Date() }));
          resolve();
        },
        error: (err) => {
          if (err.status == 'UNAUTHENTICATED') {
            reject(Error('Unauthenticated'));
          }

          reject(err);
        },
      });
    });
  }

  private fetchMailsObservable(): Observable<IMail> {
    let mailsRepo = this.repoSrv.mailsRepo;

    return from(
      this.mailProcessorSrv.getMailList(
        this.gmailSrv.buildQuery({
          from: this.bankConfig.gmailFilter.from,
          after: this.lastSync,
          exclude: this.bankConfig.gmailFilter.exclude,
        })
      )
    ).pipe(
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

        let mailEntity: IMail = {
          id: mail.id!,
          meta_body: result.body,
          date_meta: new Date(result.date),
        };

        return mailEntity;
      }),
      map((mail) => {
        mail.meta_body = this.contentProcessorSrv.extractText(mail.meta_body!);

        return mail;
      }),
      map((mail) => {
        mail.transaction = this.contentProcessorSrv.extractData(
          mail.meta_body!,
          mail.date_meta!
        );

        return mail;
      }),
      concatMap((mail) => {
        return mailsRepo.save(mail);
      })
    );
  }
}
