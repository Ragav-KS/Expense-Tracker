import { Component, OnInit } from '@angular/core';
import { GoogleAuth } from 'src/app/plugins/GoogleAuth';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import credentials from 'src/res/credentials.json';
import { Preferences } from '@capacitor/preferences';
import { PreferenceStoreService } from 'src/app/services/PreferenceStore/preference-store.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private gmailSrv: GmailService,
    private prefSrv: PreferenceStoreService
  ) {}

  ngOnInit(): void {
    console.log();
  }

  async handleLogin() {
    let userID: string = await this.prefSrv.get('userID');

    this.gmailSrv.loadToken(userID).then((result) => {
      this.prefSrv.set('userID', result);
    });
  }

  handlefetchMails() {
    this.gmailSrv
      .getMailsList({})
      .then((result) => {
        console.log(result);

        let mailId = result.messages![0].id!;

        return this.gmailSrv.getMail(mailId);
      })
      .then((result) => {
        console.log(result);
      });
  }
}
