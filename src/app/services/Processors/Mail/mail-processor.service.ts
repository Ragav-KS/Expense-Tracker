import { Injectable } from '@angular/core';
import { GmailUtils } from '../../Gmail/gmail-utils';
import { GmailService } from '../../Gmail/gmail.service';

@Injectable({
  providedIn: 'root',
})
export class MailProcessorService {
  mailList: gapi.client.gmail.Message[] = [];

  mails: gapi.client.gmail.Message[] = [];

  contents: string[] = [];

  constructor(private gmailSrv: GmailService) {}

  async getMailList(
    progressCallback: CallableFunction = async (
      count: number,
      sizeEst: number
    ) => {}
  ): Promise<gapi.client.gmail.Message[]> {
    let nextPageToken: string | undefined = '';

    while (nextPageToken != undefined) {
      await this.gmailSrv
        .getMailsList({
          pageToken: nextPageToken,
          query: 'from: (alerts@hdfcbank.net) -"OTP is" after:2022-01-05',
        })
        .then((result) => {
          progressCallback(result.messages?.length, result.resultSizeEstimate!);

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

  async loadContents() {
    await Promise.all(
      this.mails.map(async (mail) => {
        await GmailUtils.getContentFromMessage(mail).then((result) => {
          this.contents.push(result.body);
        });
      })
    );

    return this.contents;
  }
}
