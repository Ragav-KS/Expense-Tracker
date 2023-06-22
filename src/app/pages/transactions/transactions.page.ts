import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ITransaction } from 'src/app/entities/transaction';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';
import { JobsService } from 'src/app/services/Jobs/jobs.service';
import { AppState } from 'src/app/store/app.index';
import { Store } from '@ngrx/store';
import {
  selectGroupedTransactionsList,
  selectTransactionsList,
} from 'src/app/store/transaction/transaction.selectors';
import { removeTransaction } from 'src/app/store/transaction/transaction.actions';

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
    private jobsSrv: JobsService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.transactionsListSubscription = this.store
      .select(selectGroupedTransactionsList)
      .subscribe((transactions) => {
        this.transactionsGrouped = transactions;
      });
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
    this.store.dispatch(removeTransaction({ transaction }));
  }

  keyDescOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => {
    return a.key > b.key ? -1 : b.key > a.key ? 1 : 0;
  };
}
