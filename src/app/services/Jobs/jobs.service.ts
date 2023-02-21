import { Injectable } from '@angular/core';
import { concatMap, filter, from, map, Observable, tap } from 'rxjs';
import { Transaction } from 'src/app/entities/transaction';
import { GmailService } from '../Gmail/gmail.service';
import { ContentProcessorService } from '../Processors/content-processor.service';
import { MailProcessorService } from '../Processors/mail-processor.service';
import { RepositoryService } from '../Repositories/repository.service';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  constructor(
    private gmailSrv: GmailService,
    private mailProcessorSrv: MailProcessorService,
    private contentProcessorSrv: ContentProcessorService,
    private repoSrvc: RepositoryService
  ) {}

  loadData(): Observable<Transaction> {
    let transactionsRepo = this.repoSrvc.transactionsRepo;

    return from(
      this.mailProcessorSrv.getMailList(
        'from: (alerts@hdfcbank.net) -"OTP is" after:2023-02-05'
      )
    ).pipe(
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
        transaction.id = mail.id!;
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
    );
  }
}
