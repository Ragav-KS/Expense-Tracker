import { Component, OnInit } from '@angular/core';
import { gmailApi } from 'src/app/plugins/GmailAPI';
import credentials from 'src/res/credentials.json';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log();

    gmailApi
      .initialize({
        selectedAccount: 'your_gmailId@gmail.com',
        androidClientID: credentials.androidClientID,
        webClientID: credentials.webClientID,
      })
      .then((result) => {
        console.log(result);
      });
  }

  handleLogin() {
    gmailApi.getToken().then((result) => {
      console.log(result);
      alert(result.token);
    });
  }

  handleGetToken() {}
}
