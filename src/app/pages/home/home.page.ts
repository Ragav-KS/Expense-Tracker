import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { JobsService } from 'src/app/services/Jobs/jobs.service';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  constructor(
    private gmailSrv: GmailService,
    private jobsSrv: JobsService,
    private repoSrv: RepositoryService
  ) {}

  loggedInSubscription!: Subscription;
  dataRefreshedSubscription!: Subscription;

  loggedIn = false;

  loginToast: HTMLIonToastElement | undefined;

  expensesSum: number = 0;
  incomeSum: number = 0;

  ngOnInit(): void {
    this.loggedInSubscription = this.gmailSrv.loggedIn.subscribe(
      async (value) => {
        this.loggedIn = value;
      }
    );
  }

  handleLogin() {
    this.gmailSrv.login();
  }

  ngOnDestroy(): void {
    this.loggedInSubscription.unsubscribe();
  }

  async fetchMails() {
    return new Promise<void>((resolve, reject) => {
      this.jobsSrv.loadMails().subscribe({
        next: (transaction) => {
          console.log(transaction);
        },
        complete: () => {
          this.repoSrv.save();
          resolve();
        },
      });
    });
  }

  handleRefresh(event: Event) {
    this.fetchMails().then(() => {
      (event.target as HTMLIonRefresherElement).complete();
    });
  }
}
