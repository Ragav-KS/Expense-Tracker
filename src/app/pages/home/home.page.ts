import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription, first } from 'rxjs';
import { GmailService } from 'src/app/services/Gmail/gmail.service';
import { AppState } from 'src/app/store/app.index';
import { loadMails, loadMailsSuccess } from 'src/app/store/mail/mail.actions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  constructor(
    private gmailSrv: GmailService,
    private store: Store<AppState>,
    private actions$: Actions
  ) {}

  loggedInSubscription!: Subscription;

  loggedIn = false;

  ngOnInit(): void {
    this.loggedInSubscription = this.gmailSrv.loggedIn.subscribe((value) => {
      this.loggedIn = value;
    });
  }

  handleLogin() {
    this.gmailSrv.login();
  }

  handleRefresh(event: Event) {
    this.store.dispatch(loadMails());

    this.actions$.pipe(ofType(loadMailsSuccess), first()).subscribe(() => {
      (event.target as HTMLIonRefresherElement).complete();
    });
  }

  ngOnDestroy(): void {
    this.loggedInSubscription.unsubscribe();
  }
}
