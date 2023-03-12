import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  constructor(private repoSrv: RepositoryService) {}

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
}
