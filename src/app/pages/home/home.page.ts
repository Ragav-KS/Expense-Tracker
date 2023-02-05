import { Component, OnInit } from '@angular/core';
import { gmailApi } from 'src/app/plugins/GmailAPI';
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
    this.gmailSrv.loadToken();
  }

  handleGetToken() {
    // this.gmailSrv.getToken();
  }
}
