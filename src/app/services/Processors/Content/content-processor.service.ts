import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from 'src/app/entities/transaction';
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

  extractText(html: string): string {
    return this.parser.parseFromString(html, 'text/html').documentElement
      .innerText;
  }

  extractData(transaction: Transaction, payloadText: string): Transaction {
    for (let regexObj of this.regexObjects) {
      let match = regexObj.regex.exec(payloadText);

      if (match) {
        transaction.amount = Number(match.groups!['amount']);
        transaction.transactionType = regexObj['type'];
        transaction.account = match?.groups!['account'];
        transaction.mode = regexObj['mode'];
        transaction.party = match.groups!['party'];
        // transaction.date = match.groups!['date'];
        // transaction.time = match.groups!['time'];
        break;
      }
    }

    return transaction;
  }
}
