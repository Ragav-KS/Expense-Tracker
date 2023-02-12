import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GmailUtils } from '../../Gmail/gmail-utils';
import { GmailService } from '../../Gmail/gmail.service';

@Injectable({
  providedIn: 'root',
})
export class MailProcessorService {
  constructor(private gmailSrv: GmailService) {}

  async getMailList(
    query: string,
    progressCallback: CallableFunction = async (
      count: number,
      sizeEst: number
    ) => {}
  ): Promise<gapi.client.gmail.Message[]> {
    let mailList: gapi.client.gmail.Message[] = [];

    let nextPageToken: string | undefined = '';
    while (nextPageToken != undefined) {
      await this.gmailSrv
        .getMailsList({
          pageToken: nextPageToken,
          query: query,
        })
        .then((result) => {
          progressCallback(result.messages?.length, result.resultSizeEstimate!);

          mailList.push(...result.messages!);

          nextPageToken = result.nextPageToken;
        });
    }

    return mailList;
  }

  getMailPipe(
    mailId: Observable<string>
  ): Observable<gapi.client.gmail.Message> {
    return new Observable((observer) => {
      mailId.subscribe((mailId) => {
        this.gmailSrv.getMail(mailId).then((result) => {
          observer.next(result);
        });
      });
    });
  }

  getPayloadPipe(
    mail: Observable<gapi.client.gmail.Message>
  ): Observable<{ id: string; html: string }> {
    return new Observable((observer) => {
      mail.subscribe((mail) => {
        GmailUtils.getPayloadFromMail(mail).then((result) => {
          observer.next({
            id: mail.id!,
            html: result.body,
          });
        });
      });
    });
  }
}
