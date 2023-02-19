import { EventEmitter, Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  CapacitorSQLitePlugin,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Capacitor, CapacitorException } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { Transaction } from 'src/app/entities/transaction';
import { DataSource } from 'typeorm';
import { PreferenceStoreService } from '../Preferences/preference-store.service';

const DB_SETUP_KEY = 'first_db_setup';
const DB_NAME = 'myDB';

@Injectable({
  providedIn: 'root',
})
export class SqliteStorageService {
  private platform!: string;
  private native!: boolean;

  private connection!: SQLiteConnection;
  private myDB!: SQLiteDBConnection;
  public AppDataSource!: DataSource;

  private connectionReady: boolean = false;
  private connectionReadyEmitter = new EventEmitter<void>();

  public DBReady: boolean = false;
  public DBReadyEmitter = new EventEmitter<void>();

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

    // Close open connections before opening a new one. Workaround for CloseConnection error while debugging for android
    CapacitorSQLite.closeConnection({
      database: DB_NAME,
    }).catch((err) => {
      console.log('>>>> [sqlite] No open connection to close');
    });

    this.AppDataSource = new DataSource({
      type: 'capacitor',
      driver: this.connection,
      database: DB_NAME,
      entities: [Transaction],
      synchronize: true,
    });

    await this.AppDataSource.initialize()
      .then(() => {
        console.log('>>>> [typeorm] Data Source has been initialized!');
      })
      .catch((err) => {
        throw Error('Error during Data Source initialization');
      });

    this.DBReady = true;
    console.info('>>>> [sqlite] DB Ready');
    this.DBReadyEmitter.emit();
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
