import { Injectable } from '@angular/core';
import { concatMap, filter, firstValueFrom, from, map, tap } from 'rxjs';
import { Transaction } from 'src/app/entities/transaction';
import { Repository } from 'typeorm';
import { GmailService } from '../Gmail/gmail.service';
import { ContentProcessorService } from '../Processors/Content/content-processor.service';
import { MailProcessorService } from '../Processors/Mail/mail-processor.service';
import { SqliteStorageService } from '../Storage/SQLite/sqlite-storage.service';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  transactionsRepo!: Repository<Transaction>;

  constructor(
    private gmailSrv: GmailService,
    private sqliteSrv: SqliteStorageService,
    private mailProcessorSrv: MailProcessorService,
    private contentProcessorSrv: ContentProcessorService
  ) {
    this.loadRepo();
  }

  private async loadRepo() {
    if (!this.sqliteSrv.DBReady) {
      await firstValueFrom(this.sqliteSrv.DBReadyEmitter);
    }

    this.transactionsRepo = this.sqliteSrv.AppDataSource.getRepository(
      'Transaction'
    ) as Repository<Transaction>;
    console.info('>>>> [sqlite] Repository Loaded');
  }

  loadData() {
    return from(
      this.mailProcessorSrv.getMailList(
        'from: (alerts@hdfcbank.net) -"OTP is" after:2023-02-05'
      )
    ).pipe(
      concatMap((list) => from(list)),
      map((mail) => mail.id!),
      concatMap((mailId) =>
        from(
          this.transactionsRepo.findOneBy({
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
        return this.mailProcessorSrv.getMail(mailId);
      }),
      map((mail) => {
        let result = this.mailProcessorSrv.getPayload(mail);
        let transaction = new Transaction();
        transaction.id = mail.id!;
        // transaction.date = result.date;
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
        this.transactionsRepo.save(transaction);
      })
    );
  }
}
