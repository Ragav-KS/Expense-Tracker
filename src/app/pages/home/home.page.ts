import { Component, OnInit } from '@angular/core';
import { concatMap, firstValueFrom, from, map } from 'rxjs';
import { Transaction } from 'src/app/entities/transaction';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { ContentProcessorService } from 'src/app/services/Processors/Content/content-processor.service';
import { MailProcessorService } from 'src/app/services/Processors/Mail/mail-processor.service';
import { SqliteStorageService } from 'src/app/services/Storage/SQLite/sqlite-storage.service';
import { Repository } from 'typeorm';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private gmailSrv: GmailService,
    private sqliteSrv: SqliteStorageService,
    private mailProcessorSrv: MailProcessorService,
    private contentProcessorSrv: ContentProcessorService
  ) {}

  private transactionsRepo!: Repository<Transaction>;

  ngOnInit(): void {
    this.loadRepo();
  }

  async loadRepo() {
    if (!this.sqliteSrv.DBReady) {
      await firstValueFrom(this.sqliteSrv.DBReadyEmitter);
    }

    this.transactionsRepo = this.sqliteSrv.AppDataSource.getRepository(
      'Transaction'
    ) as Repository<Transaction>;
    console.info('>>>> [sqlite] Repository Loaded');
  }

  async handleLogin() {
    await this.gmailSrv.login();
  }

  async handlefetchMails() {
    this.mailProcessorSrv
      .getMailList('from: (alerts@hdfcbank.net) -"OTP is" after:2023-02-05')
      .then((list) => {
        console.log(list);

        from(list)
          .pipe(
            map((mail) => mail.id!),
            concatMap(async (mailId) => {
              return this.mailProcessorSrv.getMail(mailId);
            }),
            map((mail) => {
              let result = this.mailProcessorSrv.getPayload(mail);

              return {
                id: mail.id!,
                body: result.body,
                date: result.date,
              };
            }),
            map((payload) => {
              let result = this.contentProcessorSrv.extractText(payload.body);

              return {
                id: payload.id,
                text: result,
                date: payload.date,
              };
            }),
            map((payloadText) => {
              let result = this.contentProcessorSrv.extractData(
                payloadText.text
              );

              return {
                id: payloadText.id,
                ...result,
                date: payloadText.date,
              };
            })
          )
          .subscribe(console.log);
      });
  }

  async handleDBCreate() {
    const transaction = new Transaction();
    transaction.amount = 1000;

    await this.transactionsRepo.save(transaction);
    console.log('Photo has been saved. Photo id is', transaction.id);

    await this.sqliteSrv.saveDB();
  }

  async handleDBRead() {
    const savedPhotos = await this.transactionsRepo.find();
    console.log('All photos from the db: ', savedPhotos);
  }
}
