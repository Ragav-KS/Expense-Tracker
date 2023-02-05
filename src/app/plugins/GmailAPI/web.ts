import { WebPlugin } from '@capacitor/core';
import type { GmailApiPlugin } from './definitions';

export class GmailApiWeb extends WebPlugin implements GmailApiPlugin {
  private tokenClient!: google.accounts.oauth2.TokenClient;

  private clientId!: string;
  private scopes!: string;
  private discoveryDoc!: string;

  private selectedAccount!: string;

  access_token!: string;

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
    this.discoveryDoc =
      'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

    this.gisInitialize();
    this.gapiLoadClient();

    return { success: true };
  }

  private gisInitialize() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.clientId,
      scope: this.scopes,
      callback: (tokenResponse) => {
        console.log('got access token');

        this.access_token = tokenResponse.access_token;
      },
    });
  }

  private gapiLoadClient() {
    gapi.load('client', this.gapiClientInit);
  }

  private gapiClientInit = () => {
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
  };

  async loadToken(): Promise<void> {
    this.tokenClient.requestAccessToken({
      hint: this.selectedAccount,
    });
  }

  async getToken(): Promise<{ token: string }> {
    return { token: this.access_token };
  }
}
