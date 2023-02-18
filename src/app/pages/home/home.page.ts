import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { JobsService } from 'src/app/services/Jobs/jobs.service';
import { SqliteStorageService } from 'src/app/services/Storage/SQLite/sqlite-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private gmailSrv: GmailService,
    private sqliteSrv: SqliteStorageService,
    private jobsSrv: JobsService,
    private navCtrl: NavController
  ) {}

  loggedIn = false;

  ngOnInit(): void {
    this.gmailSrv.loggedIn.subscribe((value) => {
      this.loggedIn = value;
    });
  }

  async handleLogin() {
    await this.gmailSrv.login();
  }

  async handlefetchMails() {
    this.jobsSrv.loadData().subscribe({
      next: (transaction) => {
        console.log(transaction);
      },
      complete: () => {
        console.log('done');
        this.sqliteSrv.saveDB();
      },
    });
  }

  handleGoToTransactions() {
    this.navCtrl.navigateForward('/transactions');
  }
}
