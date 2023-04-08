import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoreService } from 'src/app/services/Core/core.service';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';
import { MoreThan } from 'typeorm';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit, OnDestroy {
  constructor(
    private repoSrv: RepositoryService,
    private coreSrv: CoreService
  ) {}

  dataRefreshedSubscription!: Subscription;

  expensesSum: number = 0;
  incomeSum: number = 0;

  ngOnInit() {
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

    let dateRange = this.coreSrv.displayDateRange;

    transactionsRepo
      .sum('amount', {
        transactionType: 'debit',
        date: MoreThan(dateRange.start),
      })
      .then((sum) => {
        this.expensesSum = sum ? sum : 0;
      });

    transactionsRepo
      .sum('amount', {
        transactionType: 'credit',
        date: MoreThan(dateRange.start),
      })
      .then((sum) => {
        this.incomeSum = sum ? sum : 0;
      });
  }
}
