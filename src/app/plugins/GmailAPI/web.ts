import { WebPlugin } from '@capacitor/core';
import type { GmailApiPlugin } from './definitions';

export class GmailApiWeb extends WebPlugin implements GmailApiPlugin {
  constructor() {
    super();
  }

  async initialize(options: {
    webClientID: string;
    androidClientID: string;
  }): Promise<{ success: boolean }> {
    console.log(options.webClientID);

    return { success: true };
  }
}
