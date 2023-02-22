import { EventEmitter, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Transaction } from 'src/app/entities/transaction';
import { Repository } from 'typeorm';
import { SqliteStorageService } from '../Storage/sqlite-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RepositoryService {
  private repoLoaded = false;
  private repoLoadedEmitter = new EventEmitter<void>();

  public dataRefreshed = new EventEmitter<void>();

  public transactionsRepo!: Repository<Transaction>;

  constructor(private sqliteSrv: SqliteStorageService) {
    this.loadRepo().then(() => {
      this.repoLoaded = true;
      this.repoLoadedEmitter.emit();
    });
  }

  async waitForRepo() {
    if (!this.repoLoaded) {
      console.info('>>>> [sqlite] Waiting for Repository');
      await firstValueFrom(this.repoLoadedEmitter);
    }
  }

  async loadRepo() {
    await this.sqliteSrv.waitForDB();

    this.transactionsRepo = this.sqliteSrv.AppDataSource.getRepository(
      'Transactions'
    ) as Repository<Transaction>;

    console.info('>>>> [sqlite] Repository Loaded');
  }
}
