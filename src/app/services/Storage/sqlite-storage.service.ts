import { EventEmitter, Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  CapacitorSQLitePlugin,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Capacitor, CapacitorException } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { PreferenceStoreService } from './preference-store.service';

const DB_SETUP_KEY = 'first_db_setup';
const DB_NAME = 'myDB';

@Injectable({
  providedIn: 'root',
})
export class SqliteStorageService {
  platform!: string;
  native!: boolean;

  sqlitePlugin!: CapacitorSQLitePlugin;

  connection!: SQLiteConnection;
  myDB!: SQLiteDBConnection;

  isService!: boolean;

  connectionReady: boolean = false;
  private connectionReadyEmitter!: EventEmitter<void>;

  constructor(private prefSrv: PreferenceStoreService) {
    this.connectionReady = false;
    this.connectionReadyEmitter = new EventEmitter();
  }

  async initializePlugin(): Promise<boolean> {
    this.platform = Capacitor.getPlatform();

    this.sqlitePlugin = CapacitorSQLite;
    this.connection = new SQLiteConnection(CapacitorSQLite);

    if (this.platform === 'ios' || this.platform === 'android') {
      this.native = true;

      this.connectionReady = true;
      this.connectionReadyEmitter.emit();
    }

    this.isService = true;

    return true;
  }

  async initWebStore(): Promise<void> {
    if (this.platform !== 'web') {
      return Promise.reject(
        new Error(`not implemented for this platform: ${this.platform}`)
      );
    }

    if (this.connection != null) {
      try {
        await this.connection.initWebStore();

        this.connectionReady = true;
        this.connectionReadyEmitter.emit();

        return Promise.resolve();
      } catch (err) {
        return Promise.reject(new Error('Problem'));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }

  async initializeDB() {
    this.setupDatabase();
  }

  private async setupDatabase() {
    if (!this.connectionReady) {
      await firstValueFrom(this.connectionReadyEmitter);
    }

    try {
      await CapacitorSQLite.createConnection({
        database: DB_NAME,
      });
    } catch (error: unknown) {
      if (!(error instanceof CapacitorException)) {
        throw error;
      }
      if (!error.message.includes('already exists')) {
        throw error;
      }
    }

    await CapacitorSQLite.open({ database: DB_NAME });

    const dbSetupDone = await this.prefSrv.get(DB_SETUP_KEY);

    if (!dbSetupDone) {
      await this.execute(`
        CREATE TABLE [mails] ( 
          [id] VARCHAR(250) NOT NULL,
          [threadId] VARCHAR(250) NOT NULL,
          PRIMARY KEY ([id])
        );
      `);

      this.prefSrv.set(DB_SETUP_KEY, '1');
    }
  }

  async query(query: string) {
    let result = await CapacitorSQLite.query({
      database: DB_NAME,
      statement: query,
      values: [],
    });

    await this.saveDB();

    return result;
  }

  async execute(statement: string) {
    let result = await CapacitorSQLite.execute({
      database: DB_NAME,
      statements: statement,
    });

    await this.saveDB();

    return result;
  }

  async saveDB() {
    if (!this.native) {
      await CapacitorSQLite.saveToStore({
        database: DB_NAME,
      });
    }
  }
}
