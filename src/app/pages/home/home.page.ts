import { Component, OnInit } from '@angular/core';
import { GoogleAuth } from 'src/app/plugins/GoogleAuth';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import credentials from 'src/res/credentials.json';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private gmailSrv: GmailService) {}

  ngOnInit(): void {
    console.log();
  }

  handleLogin() {
    this.gmailSrv.loadToken().then((result) => {
      console.log(result);
    });
  }

  handlefetchMails() {
    this.gmailSrv.fetchMails().then((result) => {
      console.log(result);
    });
  }
}
