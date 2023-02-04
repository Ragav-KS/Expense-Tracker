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
        androidClientID: credentials.androidClientID,
        webClientID: credentials.webClientID,
      })
      .then((result) => {
        console.log(result);
      });
  }

  handleLogin() {
    console.log('test');

    gmailApi.loadToken();
  }

  handleGetToken() {
    gmailApi.getToken().then((result) => {
      console.log(result);
    });
  }
}
