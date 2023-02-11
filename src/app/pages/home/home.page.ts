import { Component, OnInit } from '@angular/core';
import { GoogleAuth } from 'src/app/plugins/GoogleAuth';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import credentials from 'src/res/credentials.json';
import { Preferences } from '@capacitor/preferences';
import { PreferenceStoreService } from 'src/app/services/Storage/preference-store.service';
import { GmailUtils } from 'src/app/services/Gmail/gmail-utils';
import { SqliteStorageService } from 'src/app/services/Storage/sqlite-storage.service';
import { MailProcessorService } from 'src/app/services/Processors/Mail/mail-processor.service';
import { tap } from 'rxjs';

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
    let count = 0;

    await this.MailProcessorSrv.getMailList(
      'from: (alerts@hdfcbank.net) -"OTP is" after:2023-01-05',
      (count: number, sizeEst: number) => {
        console.log(`${count} / ${sizeEst}`);
      }
    )
      .then((list) => {
        console.log(list.length);

        return this.MailProcessorSrv.loadMessages(list, () => {
          count++;
        });
      })
      .then((mails) => {
        return this.MailProcessorSrv.loadContents(mails);
      })
      .then((contents) => {
        console.log(contents[0]);
      });

    console.log(count);
    // await this.MailProcessorSrv.loadContents().then((result) => {
    //   let out = new DOMParser().parseFromString(result[0], 'text/html')
    //     .documentElement.innerText;
    //   console.log(out);
    // });
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
