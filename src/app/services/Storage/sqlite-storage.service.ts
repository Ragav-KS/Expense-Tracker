import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  CapacitorSQLitePlugin,
  SQLiteConnection,
} from '@capacitor-community/sqlite';
import { PreferenceStoreService } from './preference-store.service';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class SqliteStorageService {
  platform!: string;
  native!: boolean;

  sqlitePlugin!: CapacitorSQLitePlugin;
  sqlite!: SQLiteConnection;

  isService!: boolean;

  constructor(private prefSrv: PreferenceStoreService) {}

  async initializePlugin(): Promise<boolean> {
    this.platform = Capacitor.getPlatform();

    if (this.platform === 'ios' || this.platform === 'android')
      this.native = true;

    this.sqlitePlugin = CapacitorSQLite;
    this.sqlite = new SQLiteConnection(this.sqlitePlugin);

    this.isService = true;

    return true;
  }

  async initWebStore(): Promise<void> {
    if (this.platform !== 'web') {
      return Promise.reject(
        new Error(`not implemented for this platform: ${this.platform}`)
      );
    }

    if (this.sqlite != null) {
      try {
        await this.sqlite.initWebStore();
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(new Error('Problem'));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
}
