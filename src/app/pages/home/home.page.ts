import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { concatMap, filter, firstValueFrom, from, map, tap } from 'rxjs';
import { Transaction } from 'src/app/entities/transaction';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { JobsService } from 'src/app/services/Jobs/jobs.service';
import { ContentProcessorService } from 'src/app/services/Processors/Content/content-processor.service';
import { MailProcessorService } from 'src/app/services/Processors/Mail/mail-processor.service';
import { SqliteStorageService } from 'src/app/services/Storage/SQLite/sqlite-storage.service';
import { Repository } from 'typeorm';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private gmailSrv: GmailService,
    private sqliteSrv: SqliteStorageService,
    private mailProcessorSrv: MailProcessorService,
    private contentProcessorSrv: ContentProcessorService,
    private jobsSrv: JobsService,
    private navCtrl: NavController
  ) {}

  private transactionsRepo!: Repository<Transaction>;

  ngOnInit(): void {
    this.loadRepo();
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

  async handleLogin() {
    await this.gmailSrv.login();
  }

  async handlefetchMails() {
    this.jobsSrv.loadData().subscribe({
      next: (transaction) => {
        console.log(transaction);
      },
      complete: () => {
        console.log('done');
        this.sqliteSrv.saveDB();
      },
    });
  }

  async handleDBRead() {
    const savedPhotos = await this.transactionsRepo.find();
    console.log(savedPhotos);
  }

  handleGoToTransactions() {
    this.navCtrl.navigateForward('/transactions');
  }
}
