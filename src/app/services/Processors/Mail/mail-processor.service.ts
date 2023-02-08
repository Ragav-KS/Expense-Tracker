import { Injectable } from '@angular/core';
import { GmailService } from '../../Gmail/gmail.service';

@Injectable({
  providedIn: 'root',
})
export class MailProcessorService {
  mailList: gapi.client.gmail.Message[] = [];

  mails: gapi.client.gmail.Message[] = [];

  constructor(private gmailSrv: GmailService) {}

  async loadMailList() {
    let nextPageToken: string | undefined = '';

    while (nextPageToken != undefined) {
      await this.gmailSrv
        .getMailsList({
          pageToken: nextPageToken,
          query: 'from: (alerts@hdfcbank.net) -"OTP is" after:2023-02-05',
        })
        .then((result) => {
          this.mailList.push(...result.messages!);

          nextPageToken = result.nextPageToken;
        });
    }

    return this.mailList;
  }

  async loadMessages() {
    await Promise.all(
      this.mailList.map(async (mail) => {
        await this.gmailSrv.getMail(mail.id!).then((result) => {
          this.mails.push(result);
        });
      })
    );

    return this.mails;
  }
}
