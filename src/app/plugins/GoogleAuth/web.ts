import { EventEmitter } from '@angular/core';
import { WebPlugin } from '@capacitor/core';
import type { GoogleAuthPlugin } from './definitions';

export class GoogleAuthWeb extends WebPlugin implements GoogleAuthPlugin {
  private tokenClient!: google.accounts.oauth2.TokenClient;

  private clientId!: string;

  private scopes!: string;

  private selectedAccount!: string;

  access_token!: string;

  private accessTokenEmitter!: EventEmitter<string>;

  constructor() {
    super();
  }

  async initialize(options: {
    selectedAccount?: string;
    webClientID: string;
    androidClientID: string;
  }): Promise<{ success: boolean }> {
    this.clientId = options.webClientID;
    this.selectedAccount = options.selectedAccount!;

    this.scopes = 'https://www.googleapis.com/auth/gmail.readonly';

    this.accessTokenEmitter = new EventEmitter();

    this.gisInitialize();

    return { success: true };
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

  async getToken(): Promise<{ token: string }> {
    this.tokenClient.requestAccessToken({
      hint: this.selectedAccount,
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
