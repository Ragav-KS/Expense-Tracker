import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { GmailUtils } from '../../Gmail/gmail-utils';
import { GmailService } from '../../Gmail/gmail.service';

@Injectable({
  providedIn: 'root',
})
export class MailProcessorService {
  // mailList: gapi.client.gmail.Message[] = [];

  // mails: gapi.client.gmail.Message[] = [];

  // contents: string[] = [];

  constructor(private gmailSrv: GmailService) {}

  async getMailList(
    progressCallback: CallableFunction = async (
      count: number,
      sizeEst: number
    ) => {}
  ): Promise<gapi.client.gmail.Message[]> {
    let nextPageToken: string | undefined = '';
    let mailList: gapi.client.gmail.Message[] = [];

    while (nextPageToken != undefined) {
      await this.gmailSrv
        .getMailsList({
          pageToken: nextPageToken,
          query: 'from: (alerts@hdfcbank.net) -"OTP is" after:2023-01-05',
        })
        .then((result) => {
          progressCallback(result.messages?.length, result.resultSizeEstimate!);

          mailList.push(...result.messages!);

          nextPageToken = result.nextPageToken;
        });
    }

    return mailList;
  }

  async loadMessages(
    mailList: gapi.client.gmail.Message[] = [],
    callBack: CallableFunction = async (mail?: gapi.client.gmail.Message) => {}
  ): Promise<gapi.client.gmail.Message[]> {
    let mails: gapi.client.gmail.Message[] = [];

    await Promise.all(
      mailList.map((mail) => {
        return new Promise<void>((resolve, reject) => {
          this.gmailSrv.getMail(mail.id!).then((result) => {
            callBack(result);

            mails.push(result);

            resolve();
          });
        });
      })
    );

    return mails;
  }

  async loadContents(
    mails: gapi.client.gmail.Message[] = [],
    callBack: CallableFunction = async (
      content?: gapi.client.gmail.Message
    ) => {}
  ) {
    let contents: string[] = [];

    await Promise.all(
      mails.map(async (mail) => {
        await GmailUtils.getContentFromMessage(mail).then((result) => {
          callBack(result.body);

          contents.push(result.body);
        });
      })
    );

    return contents;
  }
}
