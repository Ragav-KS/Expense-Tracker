import { EventEmitter, Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { Mail } from 'src/app/entities/mail';
import { Party } from 'src/app/entities/party';
import { Transaction } from 'src/app/entities/transaction';
import { DataSource } from 'typeorm';

const DB_NAME = 'myDB';

@Injectable({
  providedIn: 'root',
})
export class SqliteStorageService {
  private platform!: string;
  private native!: boolean;

  private connection!: SQLiteConnection;
  public AppDataSource!: DataSource;

  private connectionReady: boolean = false;
  private connectionReadyEmitter = new EventEmitter<void>();

  private DBReady: boolean = false;
  private DBReadyEmitter = new EventEmitter<void>();

  constructor() {}

  async waitForDB() {
    if (!this.DBReady) {
      console.info('>>>> [sqlite] Waiting for DB');
      await firstValueFrom(this.DBReadyEmitter);
    }
  }

  async initializeConnection() {
    this.platform = Capacitor.getPlatform();

    console.info('>>>> [sqlite] Initializing Sqlite Connection');

    this.connection = new SQLiteConnection(CapacitorSQLite);

    if (this.platform === 'ios' || this.platform === 'android') {
      this.native = true;

      this.connectionReady = true;
      console.info('>>>> [sqlite] Sqlite Connection Ready');
      this.connectionReadyEmitter.emit();
    }
  }

  async initWebStore() {
    console.info('>>>> [sqlite] Initializing Web Store');

    if (this.connection != null) {
      try {
        await this.connection.initWebStore();

        this.connectionReady = true;
        console.info('>>>> [sqlite] Sqlite Connection Ready');
        this.connectionReadyEmitter.emit();
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
    await CapacitorSQLite.closeConnection({
      database: DB_NAME,
    }).catch((err) => {
      console.log('>>>> [sqlite] No open connection to close');
    });

    this.AppDataSource = new DataSource({
      type: 'capacitor',
      driver: this.connection,
      database: DB_NAME,
      entities: [Transaction, Party, Mail],
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

  // This is for web implementation only
  async saveDB() {
    if (!this.native) {
      await CapacitorSQLite.saveToStore({
        database: DB_NAME,
      });
    }
  }
}
