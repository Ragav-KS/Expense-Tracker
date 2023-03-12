import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {

  constructor() { }
  
  expensesSum: number = 0;
  incomeSum: number = 0;

  ngOnInit() {}

}
