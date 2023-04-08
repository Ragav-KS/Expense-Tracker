import { Injectable } from '@angular/core';
import { ITransaction } from 'src/app/entities/transaction';
import { banksConfig } from 'src/res/banksConfig';

@Injectable({
  providedIn: 'root',
})
export class ContentProcessorService {
  regexObjects: { mode: string; type: string; regex: RegExp }[];
  private readonly parser = new DOMParser();

  constructor() {
    this.regexObjects = banksConfig.find(
      (item) => item.name === 'HDFC'
    )?.regexList!;
  }

  extractText(html: string): string {
    return this.parser.parseFromString(html, 'text/html').documentElement
      .innerText;
  }

  extractData(payloadText: string, mailDate: Date): ITransaction | null {
    let transaction: ITransaction | null = null;

    for (let regexObj of this.regexObjects) {
      let match = regexObj.regex.exec(payloadText);

      if (match) {
        transaction = {
          amount: Number(match.groups!['amount'].replace(/,/g, '')),
          transactionType: regexObj['type'],
          account: match.groups!['account'],
          mode: regexObj['mode'],
          date: mailDate,
          party: {
            id: match.groups!['party'],
          },
        };

        // transaction.date = match.groups!['date'];
        // transaction.time = match.groups!['time'];
        break;
      }
    }

    return transaction;
  }
}
