import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { JobsService } from 'src/app/services/Jobs/jobs.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  constructor(private gmailSrv: GmailService, private jobsSrv: JobsService) {}

  loggedInSubscription!: Subscription;

  loggedIn = false;

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

  handleRefresh(event: Event) {
    this.jobsSrv
      .fetchMails()
      .catch((err) => {
        if (err.message === 'Unauthenticated') {
          // Add logic to show alert/toast
          return;
        }
        console.error(err);
      })
      .finally(() => {
        (event.target as HTMLIonRefresherElement).complete();
      });
  }

  ngOnDestroy(): void {
    this.loggedInSubscription.unsubscribe();
  }
}
