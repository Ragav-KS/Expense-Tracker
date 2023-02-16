import { Component } from '@angular/core';
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
    this.platform.ready().then(async () => {
      this.sqliteSrv.initializePlugin().then(async (ret) => {
        this.initPlugin = ret;
        if (this.sqliteSrv.platform === 'web') {
          this.isWeb = true;

          await customElements.whenDefined('jeep-sqlite');
          const jeepSqliteEl = document.querySelector('jeep-sqlite');

          if (jeepSqliteEl != null) {
            await this.sqliteSrv.initWebStore();
            console.log(`>>>> isStoreOpen ${await jeepSqliteEl.isStoreOpen()}`);
          } else {
            console.log('>>>> jeepSqliteEl is null');
          }
        }

        console.log(`>>>> in App  this.initPlugin ${this.initPlugin}`);
      });
    });
  }
}
