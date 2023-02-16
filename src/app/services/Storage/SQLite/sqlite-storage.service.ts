import { EventEmitter, Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  CapacitorSQLitePlugin,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Capacitor, CapacitorException } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { PreferenceStoreService } from '../Preferences/preference-store.service';

const DB_SETUP_KEY = 'first_db_setup';
const DB_NAME = 'myDB';

@Injectable({
  providedIn: 'root',
})
export class SqliteStorageService {
  private platform!: string;
  private native!: boolean;

  connection!: SQLiteConnection;
  myDB!: SQLiteDBConnection;

  connectionReady: boolean = false;
  private connectionReadyEmitter = new EventEmitter<void>();

  constructor(private prefSrv: PreferenceStoreService) {}

  async initializePlugin(): Promise<boolean> {
    this.platform = Capacitor.getPlatform();

    console.info('>>>> [sqlite] Initializing Sqlite Connection');

    this.connection = new SQLiteConnection(CapacitorSQLite);

    if (this.platform === 'ios' || this.platform === 'android') {
      this.native = true;

      this.connectionReady = true;
      console.info('>>>> [sqlite] Sqlite Connection Ready');
      this.connectionReadyEmitter.emit();
    }

    return true;
  }

  async initWebStore(): Promise<void> {
    console.info('>>>> [sqlite] Initializing Web Store');

    if (this.connection != null) {
      try {
        await this.connection.initWebStore();

        this.connectionReady = true;
        console.info('>>>> [sqlite] Sqlite Connection Ready');
        this.connectionReadyEmitter.emit();

        return;
      } catch (err) {
        throw err;
      }
    } else {
      throw Error(`no connection open`);
    }
  }

  async initializeDB() {
    if (!this.connectionReady) {
      console.info('>>>> [sqlite] Waiting for Sqlite Connection');
      await firstValueFrom(this.connectionReadyEmitter);
    }

    console.info('>>>> [sqlite] Initializing DB');

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

    console.info('>>>> [sqlite] DB Connected');

    const dbSetupDone = await this.prefSrv.get(DB_SETUP_KEY);

    if (!dbSetupDone) {
      console.info('>>>> [sqlite] Setting up DB');

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
