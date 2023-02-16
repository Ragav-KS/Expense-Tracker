import { EventEmitter, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { GoogleAuth } from 'src/app/plugins/GoogleAuth';
import credentials from 'src/res/credentials.json';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  private discoveryDoc: string =
    'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

  private accessToken!: string;

  private gapiLoaded = false;
  private gapiLoadedEmitter = new EventEmitter<void>();

  public loggedIn = false;

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
          this.gapiLoaded = true;
          console.log('>>>> [GAuth] client load success');
          this.gapiLoadedEmitter.emit();
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
      this.loggedIn = true;
      this.accessToken = result.token;
    });

    console.log('>>>> [GAuth] got access token');

    gapi.client.setToken({
      access_token: this.accessToken,
    });

    if (!this.gapiLoaded) {
      console.info('>>>> [sqlite] Waiting for Gapi Client');
      await firstValueFrom(this.gapiLoadedEmitter);
    }

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

  public async getMailsList({
    userId = 'me',
    pageToken,
    labelIds,
    query,
  }: {
    userId?: string;
    pageToken?: string;
    labelIds?: string[];
    query?: string;
  }): Promise<gapi.client.gmail.ListMessagesResponse> {
    let response!: gapi.client.Response<gapi.client.gmail.ListMessagesResponse>;

    await gapi.client.gmail.users.messages
      .list({
        userId: userId,
        labelIds: labelIds,
        q: query,
        pageToken: pageToken,
        maxResults: 500,
      })
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        throw new Error('Failed to fetch message list.');
      });

    return response.result;
  }

  public async getMail(
    mailId: string,
    userId: string = 'me'
  ): Promise<gapi.client.gmail.Message> {
    let response!: gapi.client.Response<gapi.client.gmail.Message>;

    await gapi.client.gmail.users.messages
      .get({
        id: mailId,
        userId: userId,
        prettyPrint: true,
      })
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        throw new Error('Failed to fetch message.');
      });

    return response.result;
  }
}
