import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { GmailService } from './services/Gmail/gmail.service';
import { PreferenceStoreService } from './services/Storage/preference-store.service';
import { SqliteStorageService } from './services/Storage/sqlite-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  initPlugin!: boolean;
  isWeb!: boolean;

  constructor(
    private platform: Platform,
    private gmailSrv: GmailService,
    private sqliteSrv: SqliteStorageService,
    private prefSrv: PreferenceStoreService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.info('>>>> Initializing App');

    this.platform.ready().then(async () => {
      let platform = Capacitor.getPlatform();

      console.info(`>>>> Platform is ready - ${platform}`);

      this.sqliteSrv.initializeConnection().then(async () => {
        if (platform === 'web') {
          this.isWeb = true;
          await this.initializeJeepSqlite();
        }

        await this.sqliteSrv.initializeDB();
      });

      if (platform !== 'web') {
        if (await this.prefSrv.get('userID')) {
          await this.gmailSrv.login();
        }
      }
    });
  }

  async initializeJeepSqlite() {
    console.info('>>>> [sqlite] Load jeep-sqlite');

    await customElements.whenDefined('jeep-sqlite');
    const jeepSqliteEl = document.querySelector('jeep-sqlite');

    if (jeepSqliteEl != null) {
      await this.sqliteSrv.initWebStore();
      console.info(
        `>>>> [sqlite] webStore Open? -> ${await jeepSqliteEl.isStoreOpen()}`
      );
    } else {
      throw Error('jeepSqliteEl is null');
    }
  }
}
