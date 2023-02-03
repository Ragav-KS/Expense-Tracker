import { registerPlugin } from '@capacitor/core';

import type { GmailApiPlugin } from './definitions';

const gmailApi = registerPlugin<GmailApiPlugin>('gmailAPI', {
  web: () => import('./web').then((m) => new m.GmailApiWeb()),
});

export * from './definitions';
export { gmailApi };
