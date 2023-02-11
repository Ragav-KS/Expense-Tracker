import { EventEmitter, Injectable } from '@angular/core';
import { GoogleAuth } from 'src/app/plugins/GoogleAuth';
import credentials from 'src/res/credentials.json';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  private discoveryDoc: string =
    'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

  private accessToken!: string;

  private gapiLoadedEmitter!: EventEmitter<void>;

  constructor() {
    GoogleAuth.initialize({
      androidClientID: credentials.androidClientID,
      webClientID: credentials.webClientID,
    });

    this.gapiLoadedEmitter = new EventEmitter();

    this.gapiLoadClient();
  }

  private gapiLoadClient() {
    gapi.load('client', () => {
      gapi.client
        .init({
          discoveryDocs: [this.discoveryDoc],
        })
        .then(() => {
          this.gapiLoadedEmitter.emit();
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

    return new Promise((resolve, reject) => {
      this.gapiLoadedEmitter.subscribe((token) => {
        let selectedUserID!: string;

        gapi.client.gmail.users
          .getProfile({ userId: 'me' })
          .then((res) => {
            selectedUserID = res.result.emailAddress!;
            resolve(selectedUserID);
          })
          .catch((err) => {
            throw new Error('Failed to fetch user profile.');
          });
      });
    });
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
