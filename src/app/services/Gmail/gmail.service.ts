import { EventEmitter, Injectable } from '@angular/core';
import format from 'date-fns/format';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { GoogleAuth } from 'src/app/plugins/GoogleAuth';
import credentials from 'src/res/credentials.json';
import { PreferenceStoreService } from '../Storage/preference-store.service';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  private discoveryDoc: string =
    'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

  private accessToken!: string;

  private gapiLoaded = false;
  private gapiLoadedEmitter = new EventEmitter<void>();

  public loggedIn = new BehaviorSubject<boolean>(false);
  public loginEmitter = new EventEmitter<void>();

  constructor(private prefSrv: PreferenceStoreService) {
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
          new Error('gapi client load failed.' + err);
        });
    });
  }

  async login() {
    let userID = await this.prefSrv.get('userID');

    await this.loadToken(userID);

    userID = await this.getUserID();

    console.info(`>>>> [GAuth] logged in as ${userID}`);
    await this.prefSrv.set('userID', userID);
  }

  private async loadToken(account?: string) {
    await GoogleAuth.getToken({
      selectedAccount: account,
    }).then((result) => {
      this.accessToken = result.token;
    });

    console.log('>>>> [GAuth] got access token');

    gapi.client.setToken({
      access_token: this.accessToken,
    });

    this.loggedIn.next(true);
    this.loginEmitter.emit();

    if (!this.gapiLoaded) {
      console.info('>>>> [GAuth] Waiting for Gapi Client');
      await firstValueFrom(this.gapiLoadedEmitter);
    }
  }

  public async getUserID(): Promise<string> {
    let selectedUserID!: string;

    await gapi.client.gmail.users
      .getProfile({ userId: 'me' })
      .then((res) => {
        selectedUserID = res.result.emailAddress!;
      })
      .catch((err) => {
        throw new Error('Failed to fetch user profile.' + err);
      });

    return selectedUserID;
  }

  public buildQuery({
    from,
    after,
    exclude,
  }: {
    from?: string;
    exclude?: string;
    after?: Date;
  }): string {
    let query = '';

    if (from) {
      query += `from: (${from}) `;
    }

    if (exclude) {
      query += `-"${exclude}" `;
    }

    if (after) {
      const dateString = format(after, 'yyyy-MM-dd');
      query += `after:${dateString} `;
    }

    return query.trim();
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
  }) {
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
        throw err.result.error;
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
        throw err.result.error;
      });

    return response.result;
  }
}
