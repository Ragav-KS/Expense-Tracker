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

  extractText(data: Observable<{ id: string; html: string }>): Observable<{
    id: string;
    text: string;
  }> {
    return new Observable((observer) => {
      data.subscribe((data) => {
        let extractedText = this.parser.parseFromString(data.html, 'text/html')
          .documentElement.innerText;

        observer.next({
          id: data.id,
          text: extractedText,
        });
      });
    });
  }

  extractData(
    data: Observable<{ id: string; text: string }>
  ): Observable<{ [key: string]: string | null }> {
    return new Observable((observer) => {
      data.subscribe((data) => {
        let extractedData: {
          [key: string]: string | null;
        } = {
          id: data.id,
          amount: null,
          type: null,
          account: null,
          mode: null,
          party: null,
          date: null,
          time: null,
        };

        for (let regexObj of this.regexObjects) {
          let match = regexObj.regex.exec(data.text);

          if (match) {
            extractedData['amount'] = match.groups!['amount'];
            extractedData['type'] = regexObj['type'];
            extractedData['account'] = match?.groups!['account'];
            extractedData['mode'] = regexObj['mode'];
            extractedData['party'] = match.groups!['party'];
            extractedData['date'] = match.groups!['date'];
            extractedData['time'] = match.groups!['time'];
            break;
          }
        }

        observer.next(extractedData);
      });
    });
  }
}
