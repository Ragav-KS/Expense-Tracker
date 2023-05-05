import { EventEmitter, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IMail, MailEntity } from 'src/app/entities/mail';
import { IParty, PartyEntity } from 'src/app/entities/party';
import { ITransaction, TransactionEntity } from 'src/app/entities/transaction';
import { Repository } from 'typeorm';
import { SqliteStorageService } from '../Storage/sqlite-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RepositoryService {
  private repoLoaded = false;
  private repoLoadedEmitter = new EventEmitter<void>();

  public dataRefreshed = new EventEmitter<void>();

  public mailsRepo!: Repository<IMail>;
  public transactionsRepo!: Repository<ITransaction>;
  public partiesRepo!: Repository<IParty>;

  constructor(private sqliteSrv: SqliteStorageService) {
    this.loadRepo().then(() => {
      this.repoLoaded = true;
      this.repoLoadedEmitter.emit();
      this.dataRefreshed.emit();
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

    this.transactionsRepo =
      this.sqliteSrv.AppDataSource.getRepository(TransactionEntity);

    this.partiesRepo = this.sqliteSrv.AppDataSource.getRepository(PartyEntity);

    this.mailsRepo = this.sqliteSrv.AppDataSource.getRepository(MailEntity);

    console.info('>>>> [sqlite] Repository Loaded');
  }

  async save() {
    await this.sqliteSrv.saveDB();
    this.dataRefreshed.emit();
  }
}
