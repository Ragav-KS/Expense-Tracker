import { Component, OnInit } from '@angular/core';
import { concatMap, from, map } from 'rxjs';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { ContentProcessorService } from 'src/app/services/Processors/Content/content-processor.service';
import { MailProcessorService } from 'src/app/services/Processors/Mail/mail-processor.service';
import { SqliteStorageService } from 'src/app/services/Storage/SQLite/sqlite-storage.service';

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

  ngOnInit(): void {}

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
