import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GmailService } from 'src/app/services/Gmail/gmail.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  constructor(private gmailSrv: GmailService) {}

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

  ngOnDestroy(): void {
    this.loggedInSubscription.unsubscribe();
  }
}
