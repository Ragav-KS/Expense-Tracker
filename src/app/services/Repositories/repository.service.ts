import { EventEmitter, Injectable } from '@angular/core';
import { IMail, MailEntity } from 'src/app/entities/mail';
import { IParty, PartyEntity } from 'src/app/entities/party';
import { ITransaction, TransactionEntity } from 'src/app/entities/transaction';
import { Repository } from 'typeorm';
import { SqliteStorageService } from '../Storage/sqlite-storage.service';
import { AppState } from 'src/app/store/app.index';
import { Store } from '@ngrx/store';
import { refresh } from 'src/app/store/transaction/transaction.actions';

@Injectable({
  providedIn: 'root',
})
export class RepositoryService {
  public mailsRepo!: Repository<IMail>;
  public transactionsRepo!: Repository<ITransaction>;
  public partiesRepo!: Repository<IParty>;

  constructor(
    private sqliteSrv: SqliteStorageService,
    private store: Store<AppState>
  ) {
    this.loadRepo().then(() => {
      this.store.dispatch(refresh());
    });
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
    this.store.dispatch(refresh());
  }
}
