import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { SqliteStorageService } from './services/Storage/SQLite/sqlite-storage.service';

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
    private sqliteSrv: SqliteStorageService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.info('>>>> Initializing App');

    this.platform.ready().then(async () => {
      let platform = Capacitor.getPlatform();

      console.info(`>>>> Platform is ready - ${platform}`);

      this.sqliteSrv.initializePlugin().then(async (ret) => {
        if (platform === 'web') {
          this.isWeb = true;

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

        this.sqliteSrv.initializeDB();
      });
    });
  }
}
