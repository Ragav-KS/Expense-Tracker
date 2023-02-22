import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { firstValueFrom, Subscribable, Subscription } from 'rxjs';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { JobsService } from 'src/app/services/Jobs/jobs.service';
import { SqliteStorageService } from 'src/app/services/Storage/sqlite-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  constructor(
    private gmailSrv: GmailService,
    private sqliteSrv: SqliteStorageService,
    private jobsSrv: JobsService,
    private navCtrl: NavController,
    private repoSrv: RepositoryService
  ) {}

  dataRefreshedSubscription!: Subscription;
  loggedIn = false;

  expensesSum: number = 0;
  incomeSum: number = 0;

  ngOnInit(): void {
    this.gmailSrv.loggedIn.subscribe((value) => {
      this.loggedIn = value;
    });

    this.repoSrv.waitForRepo().then(() => {
      this.refresh();
    });

    this.dataRefreshedSubscription = this.repoSrv.dataRefreshed.subscribe(
      () => {
        this.refresh();
      }
    );
  }

  ngOnDestroy(): void {
    this.dataRefreshedSubscription.unsubscribe();
  }

  refresh() {
    let transactionsRepo = this.repoSrv.transactionsRepo;

    transactionsRepo
      .sum('amount', {
        transactionType: 'debit',
      })
      .then((sum) => {
        this.expensesSum = sum ? sum : 0;
      });

    transactionsRepo
      .sum('amount', {
        transactionType: 'credit',
      })
      .then((sum) => {
        this.incomeSum = sum ? sum : 0;
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
        alert('Done');
        this.sqliteSrv.saveDB();
        this.repoSrv.dataRefreshed.emit();
      },
    });
  }

  handleGoToTransactions() {
    this.navCtrl.navigateForward('/transactions');
  }
}
