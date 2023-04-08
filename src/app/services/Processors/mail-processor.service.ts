import { Injectable } from '@angular/core';
import { GmailService } from '../Gmail/gmail.service';

@Injectable({
  providedIn: 'root',
})
export class MailProcessorService {
  constructor(private gmailSrv: GmailService) {}

  async getMailList(query: string): Promise<gapi.client.gmail.Message[]> {
    let mailList: gapi.client.gmail.Message[] = [];

    let nextPageToken: string | undefined = '';
    while (nextPageToken != undefined) {
      await this.gmailSrv
        .getMailsList({
          pageToken: nextPageToken,
          query: query,
        })
        .then((result) => {
          mailList.push(...result.messages!);

          nextPageToken = result.nextPageToken;
        });
    }

    return mailList;
  }

  getPayload(mail: gapi.client.gmail.Message): {
    date: string;
    subject: string;
    body: string;
  } {
    let payload = mail.payload!;

    let headers = new Map<string, string>();
    payload.headers!.forEach((header) => {
      headers.set(header.name!, header.value!);
    });

    let mailDate = headers.get('Date')!;
    let subject = headers.get('Subject')!;

    let mime = payload.mimeType!;

    let decodedBody: string;
    let body: string;
    if (mime.includes('multipart')) {
      let parts = payload.parts!;
      body = parts[0].body!.data!;
    } else {
      body = payload.body!.data!;
    }

    decodedBody = atob(body!.replace(/-/g, '+').replace(/_/g, '/'));

    return {
      date: mailDate,
      subject: subject,
      body: decodedBody!,
    };
  }
}
