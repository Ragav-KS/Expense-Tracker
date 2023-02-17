import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Transaction } from 'src/app/entities/transaction';
import { SqliteStorageService } from 'src/app/services/Storage/SQLite/sqlite-storage.service';
import { Repository } from 'typeorm';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  transactionsList: Transaction[] = [];

  private transactionsRepo!: Repository<Transaction>;

  constructor(private sqliteSrv: SqliteStorageService) {}

  ngOnInit() {
    this.loadRepo().then(() => {
      this.transactionsRepo.find().then((transactions) => {
        this.transactionsList = transactions;
      });
    });
  }

  async loadRepo() {
    if (!this.sqliteSrv.DBReady) {
      await firstValueFrom(this.sqliteSrv.DBReadyEmitter);
    }

    this.transactionsRepo = this.sqliteSrv.AppDataSource.getRepository(
      'Transaction'
    ) as Repository<Transaction>;
    console.info('>>>> [sqlite] Repository Loaded');
  }
}
