import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/Core/data.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit, OnDestroy {
  constructor(private DataSrv: DataService) {}

  expenseSumSubscription!: Subscription;
  incomeSumSubscription!: Subscription;

  expensesSum: number = 0;
  incomeSum: number = 0;

  ngOnInit() {
    this.expenseSumSubscription = this.DataSrv.expensesSum.subscribe(
      (expensesSum) => {
        this.expensesSum = expensesSum;
      }
    );

    this.incomeSumSubscription = this.DataSrv.incomeSum.subscribe(
      (incomeSum) => {
        this.incomeSum = incomeSum;
      }
    );
  }

  ngOnDestroy(): void {
    this.expenseSumSubscription.unsubscribe();
    this.incomeSumSubscription.unsubscribe();
  }
}
