import { Injectable } from '@angular/core';
import { GoogleAuth } from 'src/app/plugins/GoogleAuth';
import credentials from 'src/res/credentials.json';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  private discoveryDoc: string =
    'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

  private accessToken!: string;

  constructor() {
    GoogleAuth.initialize({
      androidClientID: credentials.androidClientID,
      webClientID: credentials.webClientID,
    });

    this.gapiLoadClient();
  }

  private gapiLoadClient() {
    gapi.load('client', () => {
      gapi.client
        .init({
          discoveryDocs: [this.discoveryDoc],
        })
        .then(() => {
          console.log('gapi client load success');
        })
        .catch((err) => {
          new Error('gapi client load failed.');
        });
    });
  }

  public async loadToken(account?: string): Promise<string> {
    await GoogleAuth.getToken({
      selectedAccount: account,
    }).then((result) => {
      this.accessToken = result.token;
    });

    gapi.client.setToken({
      access_token: this.accessToken,
    });

    let selectedUserID!: string;
    await gapi.client.gmail.users
      .getProfile({ userId: 'me' })
      .then((res) => {
        selectedUserID = res.result.emailAddress!;
      })
      .catch((err) => {
        throw new Error('Failed to fetch user profile.');
      });

    return selectedUserID;
  }

  public async fetchMails(
    userId: string = 'me',
    labelIds?: string[],
    query?: string
  ): Promise<gapi.client.gmail.ListMessagesResponse> {
    let response!: gapi.client.Response<gapi.client.gmail.ListMessagesResponse>;

    await gapi.client.gmail.users.messages
      .list({
        userId: userId,
        labelIds: labelIds,
        q: query,
      })
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        throw new Error('Failed to fetch messages.');
      });

    return response.result;
  }
}
