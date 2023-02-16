import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class PreferenceStoreService {
  constructor() {}

  async get(key: string, defaultVal?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      Preferences.get({ key: key })
        .then((result) => {
          resolve(result.value!);
        })
        .catch((err) => {
          resolve(defaultVal!);
        });
    });
  }

  async set(key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      Preferences.set({ key: key, value: value })
        .then((result) => {
          resolve();
        })
        .catch((err) => {
          throw new Error(`Failed to store value with key: ${key}.`);
        });
    });
  }
}
