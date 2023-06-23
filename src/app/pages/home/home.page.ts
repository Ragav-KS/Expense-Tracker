import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { JobsService } from 'src/app/services/Jobs/jobs.service';
import { AppState } from 'src/app/store/app.index';
import { loadMails } from 'src/app/store/mail/mail.actions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  constructor(
    private gmailSrv: GmailService,
    private jobsSrv: JobsService,
    private store: Store<AppState>
  ) {}

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
    this.store.dispatch(loadMails());
  }

  ngOnDestroy(): void {
    this.loggedInSubscription.unsubscribe();
  }
}
