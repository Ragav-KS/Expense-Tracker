import { Injectable } from '@angular/core';
import { gmailApi } from 'src/app/plugins/GmailAPI';
import credentials from 'src/res/credentials.json';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  private accessToken!: string;

  constructor() {
    gmailApi
      .initialize({
        // selectedAccount: 'your_gmailId@gmail.com',
        androidClientID: credentials.androidClientID,
        webClientID: credentials.webClientID,
      })
      .then((result) => {
        console.log(result);
      });
  }

  // TODO: synchronize loadToken and return it.
  async loadToken() {
    await gmailApi.getToken().then((result) => {
      this.accessToken = result.token;
    });

    alert(this.accessToken);
  }
}
