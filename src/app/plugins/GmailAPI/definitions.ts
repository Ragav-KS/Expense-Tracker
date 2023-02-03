export interface GmailApiPlugin {
  initialize(options: {
    webClientID: string;
    androidClientID: string;
  }): Promise<{ success: boolean }>;
}
