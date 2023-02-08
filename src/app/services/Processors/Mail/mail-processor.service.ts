import { Injectable } from '@angular/core';
import { GmailService } from '../../Gmail/gmail.service';

@Injectable({
  providedIn: 'root',
})
export class MailProcessorService {
  mailList: gapi.client.gmail.Message[] = [];

  constructor(private gmailSrv: GmailService) {}

  async loadMailList() {
    let nextPageToken: string | undefined = '';

    while (nextPageToken != undefined) {
      await this.gmailSrv
        .getMailsList({
          pageToken: nextPageToken,
          query: 'from: (alerts@hdfcbank.net) -"OTP is" after:2023-01-01',
        })
        .then((result) => {
          this.mailList.push(...result.messages!);

          nextPageToken = result.nextPageToken;
        });
    }

    console.log(this.mailList);

    return this.mailList;
  }
}
