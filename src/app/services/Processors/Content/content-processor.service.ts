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

  async extractText(html: string) {
    return this.parser.parseFromString(html, 'text/html').documentElement
      .innerText;
  }

  async extractData(payloadText: string) {
    let data: {
      [key: string]: string | null;
    } = {
      amount: null,
      type: null,
      account: null,
      mode: null,
      party: null,
      date: null,
      time: null,
    };

    for (let regexObj of this.regexObjects) {
      let match = regexObj.regex.exec(payloadText);

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

    return data;
  }
}
