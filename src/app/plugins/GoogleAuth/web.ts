import { EventEmitter } from '@angular/core';
import { WebPlugin } from '@capacitor/core';
import type { GoogleAuthPlugin } from './definitions';

export class GoogleAuthWeb extends WebPlugin implements GoogleAuthPlugin {
  private scopes: string = 'https://www.googleapis.com/auth/gmail.readonly';

  private tokenClient!: google.accounts.oauth2.TokenClient;

  private clientId!: string;
  private access_token!: string;

  private accessTokenEmitter!: EventEmitter<string>;

  constructor() {
    super();
  }

  async initialize(options: {
    webClientID: string;
    androidClientID: string;
  }): Promise<void> {
    this.clientId = options.webClientID;

    this.accessTokenEmitter = new EventEmitter();

    this.gisInitialize();
  }

  private gisInitialize() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.clientId,
      scope: this.scopes,
      callback: (tokenResponse) => {
        this.accessTokenEmitter.emit(tokenResponse.access_token);
      },
    });
  }

  async getToken(options: {
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
