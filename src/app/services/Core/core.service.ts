import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private monthStart!: Date;

  constructor() {
    this.monthStart = new Date();
    this.monthStart.setDate(1);
    this.monthStart.setHours(0, 0, 0, 0);
  }

  get displayDateRange() {
    return {
      start: this.monthStart,
      end: new Date(),
    };
  }
}
