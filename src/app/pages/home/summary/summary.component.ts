import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';
import { MoreThan } from 'typeorm';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit, OnDestroy {
  constructor(private repoSrv: RepositoryService) {}

  dataRefreshedSubscription!: Subscription;
  monthStart!: Date;

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

    this.monthStart = new Date();
    this.monthStart.setDate(1);
    this.monthStart.setHours(0, 0, 0, 0);
  }

  ngOnDestroy(): void {
    this.dataRefreshedSubscription.unsubscribe();
  }

  refresh() {
    let transactionsRepo = this.repoSrv.transactionsRepo;

    transactionsRepo
      .sum('amount', {
        transactionType: 'debit',
        date: MoreThan(this.monthStart),
      })
      .then((sum) => {
        this.expensesSum = sum ? sum : 0;
      });

    transactionsRepo
      .sum('amount', {
        transactionType: 'credit',
        date: MoreThan(this.monthStart),
      })
      .then((sum) => {
        this.incomeSum = sum ? sum : 0;
      });
  }
}
