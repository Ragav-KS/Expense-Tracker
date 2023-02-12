import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { banksConfig } from 'src/res/banksConfig';

@Injectable({
  providedIn: 'root',
})
export class ContentProcessorService {
  regexObjects: { mode: string; type: string; regex: RegExp }[];
  private readonly parser!: DOMParser;

  constructor() {
    this.parser = new DOMParser();

    this.regexObjects = banksConfig.find(
      (item) => item.name === 'HDFC'
    )?.regexList!;
  }

  extractTextPipe(
    payload: Observable<{ id: string; html: string }>
  ): Observable<{
    id: string;
    text: string;
  }> {
    return new Observable((observer) => {
      payload.subscribe((payload) => {
        let extractedText = this.parser.parseFromString(
          payload.html,
          'text/html'
        ).documentElement.innerText;

        observer.next({
          id: payload.id,
          text: extractedText,
        });
      });
    });
  }

  extractDataPipe(
    payloadText: Observable<{ id: string; text: string }>
  ): Observable<{ [key: string]: string | null }> {
    return new Observable((observer) => {
      payloadText.subscribe((payload) => {
        let data: {
          [key: string]: string | null;
        } = {
          id: payload.id,
          amount: null,
          type: null,
          account: null,
          mode: null,
          party: null,
          date: null,
          time: null,
        };

        for (let regexObj of this.regexObjects) {
          let match = regexObj.regex.exec(payload.text);

          if (match) {
            data['amount'] = match.groups!['amount'];
            data['type'] = regexObj['type'];
            data['account'] = match?.groups!['account'];
            data['mode'] = regexObj['mode'];
            data['party'] = match.groups!['party'];
            data['date'] = match.groups!['date'];
            data['time'] = match.groups!['time'];
            break;
          }
        }

        observer.next(data);
      });
    });
  }
}
