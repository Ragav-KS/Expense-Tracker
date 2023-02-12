import { Component, OnInit } from '@angular/core';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { ContentProcessorService } from 'src/app/services/Processors/Content/content-processor.service';
import { MailProcessorService } from 'src/app/services/Processors/Mail/mail-processor.service';
import {
  concatMap,
  from,
  map,
  mergeMap,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { PreferenceStoreService } from 'src/app/services/Storage/preference-store.service';
import { SqliteStorageService } from 'src/app/services/Storage/sqlite-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private gmailSrv: GmailService,
    private prefSrv: PreferenceStoreService,
    private sqliteSrv: SqliteStorageService,
    private mailProcessorSrv: MailProcessorService,
    private contentProcessorSrv: ContentProcessorService
  ) {}

  ngOnInit(): void {
    this.handleLogin();
    this.sqliteSrv.initializeDB();
  }

  async handleLogin() {
    let userID: string = await this.prefSrv.get('userID');

    this.gmailSrv.loadToken(userID).then((result) => {
      this.prefSrv.set('userID', result);
    });
  }

  async handlefetchMails() {
    this.mailProcessorSrv
      .getMailList('from: (alerts@hdfcbank.net) -"OTP is" after:2023-02-05')
      .then((list) => {
        from(list)
          .pipe(
            // map((mail) => mail.id!),
            concatMap(async (mail) => {
              let mailId = mail.id!;

              let result = await this.mailProcessorSrv
                .getMail(mailId)
                .then((mail) => {
                  return this.mailProcessorSrv.getPayload(mail);
                })
                .then((payload) => {
                  return this.contentProcessorSrv.extractText(payload.body);
                })
                .then((text) => {
                  return this.contentProcessorSrv.extractData(text);
                });

              return {
                id: mailId,
                ...result,
              };
            })
          )
          .subscribe(console.log);
      });
  }

  async handleTestDatabase() {
    console.log(await this.sqliteSrv.query('SELECT * FROM [mails]'));

    console.log(
      await this.sqliteSrv.execute(
        `INSERT INTO [mails] ([id], [threadId]) VALUES ('aaa','bbb');`
      )
    );

    console.log(await this.sqliteSrv.query('SELECT * FROM [mails]'));
  }
}
