import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Transaction } from 'src/app/entities/transaction';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { JobsService } from 'src/app/services/Jobs/jobs.service';
import { SqliteStorageService } from 'src/app/services/Storage/sqlite-storage.service';
import { Repository } from 'typeorm';

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

  private transactionsRepo!: Repository<Transaction>;

  loggedIn = false;

  expensesSum: number = 0;
  incomeSum: number = 0;

  ngOnInit(): void {
    this.gmailSrv.loggedIn.subscribe((value) => {
      this.loggedIn = value;
    });

    this.loadRepo().then(() => {
      return this.refresh();
    });
  }

  async refresh() {
    this.transactionsRepo
      .sum('amount', {
        transactionType: 'debit',
      })
      .then((sum) => {
        this.expensesSum = sum!;
      });

    this.transactionsRepo
      .sum('amount', {
        transactionType: 'credit',
      })
      .then((sum) => {
        this.incomeSum = sum!;
      });
  }

  async loadRepo() {
    if (!this.sqliteSrv.DBReady) {
      await firstValueFrom(this.sqliteSrv.DBReadyEmitter);
    }

    this.transactionsRepo = this.sqliteSrv.AppDataSource.getRepository(
      'Transactions'
    ) as Repository<Transaction>;
    console.info('>>>> [sqlite] Repository Loaded');
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
