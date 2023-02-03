import { Component, OnInit } from '@angular/core';
import { gmailApi } from 'src/app/plugins/GmailAPI';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor() {}

  ngOnInit(): void {
    gmailApi
      .initialize({ androidClientID: 'Android test', webClientID: 'Web test' })
      .then((result) => {
        console.log(result);
      });
  }
}
