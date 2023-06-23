import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription, first } from 'rxjs';
import { ITransaction } from 'src/app/entities/transaction';
import { AppState } from 'src/app/store/app.index';
import { loadMails, loadMailsSuccess } from 'src/app/store/mail/mail.actions';
import { removeTransaction } from 'src/app/store/transaction/transaction.actions';
import { selectGroupedTransactionsList } from 'src/app/store/transaction/transaction.selectors';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';

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
    private store: Store<AppState>,
    private actions$: Actions
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
    this.store.dispatch(loadMails());

    this.actions$.pipe(ofType(loadMailsSuccess), first()).subscribe(() => {
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
