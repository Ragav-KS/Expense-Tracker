import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ITransaction } from 'src/app/entities/transaction';
import { DataService } from 'src/app/services/Core/data.service';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';
import { JobsService } from 'src/app/services/Jobs/jobs.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit, OnDestroy {
  transactionsList: ITransaction[] = [];
  transactionsGrouped: Map<number, ITransaction[]> = new Map();

  private transactionsListSubscription!: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private DataSrv: DataService,
    private jobsSrv: JobsService
  ) {}

  ngOnInit() {
    this.transactionsListSubscription = this.DataSrv.transactionsList.subscribe(
      (transactions) => {
        this.transactionsList = transactions;
        this.groupTransactions();
      }
    );
  }

  ngOnDestroy(): void {
    this.transactionsListSubscription.unsubscribe();
  }

  handleRefresh(event: Event) {
    this.jobsSrv
      .fetchMails()
      .catch((err) => {
        if (err.message === 'Unauthenticated') {
          // Add logic to show alert/toast
          return;
        }
        console.error(err);
      })
      .finally(() => {
        (event.target as HTMLIonRefresherElement).complete();
      });
  }

  groupTransactions() {
    let transactionsGrouped = new Map();

    this.transactionsList.forEach((transaction) => {
      const date = transaction.date;
      const dateKey = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).getTime();
      const transactions = transactionsGrouped.get(dateKey);
      if (transactions) {
        transactions.push(transaction);
      } else {
        transactionsGrouped.set(dateKey, [transaction]);
      }
    });

    this.transactionsGrouped = transactionsGrouped;
  }

  editTransaction(transaction: ITransaction) {
    this.modalCtrl
      .create({
        component: TransactionFormComponent,
        componentProps: {
          transaction: transaction,
        },
      })
      .then((modal) => {
        return modal.present();
      })
      .then((value) => {
        console.log('>>>> [page] modal present', value);
      });
  }

  addTransaction() {
    this.modalCtrl
      .create({
        component: TransactionFormComponent,
      })
      .then((modal) => {
        return modal.present();
      })
      .then((value) => {
        console.log('>>>> [page] modal present', value);
      });
  }

  deleteTransaction(transaction: ITransaction) {
    this.DataSrv.deleteTransaction(transaction).catch((err) => {
      // TODO: show error message in a modal/toast
      console.error(err);
    });
  }

  keyDescOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => {
    return a.key > b.key ? -1 : b.key > a.key ? 1 : 0;
  };
}
