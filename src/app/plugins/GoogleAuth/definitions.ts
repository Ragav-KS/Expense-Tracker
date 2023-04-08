export interface GoogleAuthPlugin {
  initialize(options: {
    webClientID: string;
    androidClientID: string;
  }): Promise<void>;

  getToken(options: { selectedAccount?: string }): Promise<{ token: string }>;
}
