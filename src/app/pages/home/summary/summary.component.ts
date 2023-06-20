import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.index';
import {
  selectExpensesSum,
  selectIncomeSum,
} from 'src/app/store/transaction/transaction.selectors';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>) {}

  expenseSumSubscription!: Subscription;
  incomeSumSubscription!: Subscription;

  expensesSum: number = 0;
  incomeSum: number = 0;

  ngOnInit() {
    this.expenseSumSubscription = this.store
      .select(selectExpensesSum)
      .subscribe((expensesSum) => {
        this.expensesSum = expensesSum;
      });

    this.incomeSumSubscription = this.store
      .select(selectIncomeSum)
      .subscribe((incomeSum) => {
        this.incomeSum = incomeSum;
      });
  }

  ngOnDestroy(): void {
    this.expenseSumSubscription.unsubscribe();
    this.incomeSumSubscription.unsubscribe();
  }
}
