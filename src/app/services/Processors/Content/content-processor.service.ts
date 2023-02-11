import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContentProcessorService {
  constructor() {}

  private readonly parser = new DOMParser();

  async extractText(html: string[]): Promise<string[]> {
    let extractedText: string[] = [];

    html.forEach((item) => {
      let extract = this.parser.parseFromString(item, 'text/html')
        .documentElement.innerText;

      extractedText.push(extract);
    });

    return extractedText;
  }
}
