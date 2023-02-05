export interface GmailApiPlugin {
  initialize(options: {
    selectedAccount?: string;
    webClientID: string;
    androidClientID: string;
  }): Promise<{ success: boolean }>;

  getToken(): Promise<{ token: string }>;
}
