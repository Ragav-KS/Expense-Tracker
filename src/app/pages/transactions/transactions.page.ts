import { Component, OnInit } from '@angular/core';
import { SqliteStorageService } from 'src/app/services/Storage/SQLite/sqlite-storage.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  transactionsList: {
    [key: string]: string | null;
  }[] = [];
  constructor(private sqliteSrv: SqliteStorageService) {}

  ngOnInit() {}
}
