import { Injectable } from '@angular/core';
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

  async extractText(html: string[]): Promise<string[]> {
    let extractedText: string[] = [];

    html.forEach((item) => {
      let extract = this.parser.parseFromString(item, 'text/html')
        .documentElement.innerText;

      extractedText.push(extract);
    });

    return extractedText;
  }

  async extractData(text: string[]) {
    let matchList: {
      [key: string]: string | null;
    }[] = [];

    text.forEach((item) => {
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
        let match = regexObj.regex.exec(item);

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

      matchList.push(data);
    });

    return matchList;
  }
}
