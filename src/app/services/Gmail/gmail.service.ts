import { Injectable } from '@angular/core';
import { GoogleAuth } from 'src/app/plugins/GoogleAuth';
import credentials from 'src/res/credentials.json';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  private accessToken!: string;

  constructor() {
    GoogleAuth.initialize({
      // selectedAccount: 'your_gmailId@gmail.com',
      androidClientID: credentials.androidClientID,
      webClientID: credentials.webClientID,
    }).then((result) => {
      console.log(result);
    });

    this.gapiLoadClient();
  }

  private gapiLoadClient() {
    gapi.load('client', this.gapiClientInit);
  }

  private gapiClientInit = () => {
    gapi.client
      .init({
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
        ],
      })
      .then(() => {
        console.log('gapi client load success');
      })
      .catch((err) => {
        new Error('gapi client load failed.');
      });
  };

  // TODO: synchronize loadToken and return it.
  async loadToken() {
    await GoogleAuth.getToken().then((result) => {
      this.accessToken = result.token;
    });

    gapi.client.setToken({
      access_token: this.accessToken,
    });

    alert(this.accessToken);
  }

  async fetchMails() {
    let response!: gapi.client.Response<gapi.client.gmail.ListMessagesResponse>;

    await gapi.client.gmail.users.messages
      .list({
        userId: 'me',
        // labelIds: options.labelIds,
        // q: options.query,
      })
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        throw new Error('Failed to fetch messages.');
      });

    console.log(response);
  }
}
