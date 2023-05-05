import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ITransaction } from 'src/app/entities/transaction';
import { DataService } from 'src/app/services/Core/data.service';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';
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
    private repoSrv: RepositoryService,
    private modalCtrl: ModalController,
    private DataSrv: DataService
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
    this.repoSrv.transactionsRepo.remove(transaction).then(() => {
      this.repoSrv.save();
    });
  }

  keyDescOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => {
    return a.key > b.key ? -1 : b.key > a.key ? 1 : 0;
  };
}
