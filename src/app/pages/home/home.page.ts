import { Component, OnInit } from '@angular/core';
import { GoogleAuth } from 'src/app/plugins/GoogleAuth';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import credentials from 'src/res/credentials.json';
import { Preferences } from '@capacitor/preferences';
import { PreferenceStoreService } from 'src/app/services/Storage/preference-store.service';
import { GmailUtils } from 'src/app/services/Gmail/gmail-utils';
import { SqliteStorageService } from 'src/app/services/Storage/sqlite-storage.service';
import { MailProcessorService } from 'src/app/services/Processors/Mail/mail-processor.service';
import { from, map, Observable, tap } from 'rxjs';

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
    private MailProcessorSrv: MailProcessorService
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
    this.MailProcessorSrv.getMailList(
      'from: (alerts@hdfcbank.net) -"OTP is" after:2023-02-05'
    ).then((list) => {
      from(list)
        .pipe(
          map((mail) => mail.id!),
          (id) => {
            return this.MailProcessorSrv.getMailPipe(id);
          },
          (mail) => {
            return this.MailProcessorSrv.getBodyPipe(mail);
          }
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
