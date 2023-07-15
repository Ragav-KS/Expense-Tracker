import { EventEmitter } from '@angular/core';
import { WebPlugin } from '@capacitor/core';
import { take } from 'rxjs';
import { get } from 'scriptjs';
import credentials from 'src/res/credentials.json';
import type { GoogleAuthPlugin } from './definitions';

export class GoogleAuthWeb extends WebPlugin implements GoogleAuthPlugin {
  private scopes: string = 'https://www.googleapis.com/auth/gmail.readonly';

  private tokenClient!: google.accounts.oauth2.TokenClient;

  private clientId!: string;
  private access_token!: string;

  private accessTokenEmitter: EventEmitter<string> = new EventEmitter();

  public async initialize(options: {
    webClientID: string;
    androidClientID: string;
  }) {
    return this.loadScript().then(() => {
      return this.gisInitialize();
    });
  }

  private loadScript() {
    return new Promise<void>((resolve, reject) => {
      get('https://accounts.google.com/gsi/client', () => {
        console.log('>>>> [GoogleAuth] Google Gsi Script loaded');
        resolve();
      });
    });
  }

  private gisInitialize() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: credentials.webClientID,
      scope: this.scopes,
      callback: (tokenResponse) => {
        this.accessTokenEmitter.emit(tokenResponse.access_token);
        console.log('>>>> [GoogleAuth] Token received');
      },
    });
  }

  public async getToken(options: {
    selectedAccount?: string;
  }): Promise<{ token: string }> {
    this.tokenClient.requestAccessToken({
      hint: options.selectedAccount,
    });

    return new Promise((resolve, reject) => {
      this.accessTokenEmitter.subscribe((token) => {
        this.access_token = token;

        resolve({
          token: this.access_token,
        });
      });
    });
  }
}
