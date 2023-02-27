import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
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
    private jobsSrv: JobsService,
    private navCtrl: NavController,
    private repoSrv: RepositoryService,
    private toastCtrl: ToastController
  ) {}

  dataRefreshedSubscription!: Subscription;
  loggedIn = false;

  expensesSum: number = 0;
  incomeSum: number = 0;

  ngOnInit(): void {
    this.gmailSrv.loggedIn.subscribe((value) => {
      this.loggedIn = value;

      if (!value) {
        this.toastCtrl
          .create({
            message: 'Please login',
            duration: 0,
            position: 'top',
            cssClass: 'custom-toast',
            id: 'login-toast',
            buttons: [
              {
                role: 'login',
                handler: () => {
                  this.gmailSrv.login();
                },
                text: 'Login',
              },
              {
                role: 'cancel',
                text: 'Cancel',
              },
            ],
          })
          .then((toast) => {
            toast.present();
          });
      } else {
        this.toastCtrl.dismiss('login-toast');
      }
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

  async handlefetchMails() {
    this.jobsSrv.loadData().subscribe({
      next: (transaction) => {
        console.log(transaction);
      },
      complete: () => {
        alert('Done');
        this.repoSrv.save();
      },
    });
  }

  handleGoToTransactions() {
    this.navCtrl.navigateForward('/transactions');
  }
}
