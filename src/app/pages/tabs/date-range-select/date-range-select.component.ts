import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.index';
import { setDateRange } from 'src/app/store/settings/setting.actions';

type IOption = {
  label: string;
  value: 'current' | 'previous' | 'custom';
};

@Component({
  selector: 'app-date-range-select',
  templateUrl: './date-range-select.component.html',
  styleUrls: [],
})
export class DateRangeSelectComponent implements OnInit {
  options: IOption[] = [
    {
      label: 'Current Month',
      value: 'current',
    },
    {
      label: 'Previous Month',
      value: 'previous',
    },
    {
      label: 'Custom Range',
      value: 'custom',
    },
  ];

  mode: IOption = this.options[0];

  startDate!: Date;
  endDate!: Date;
  today!: Date;

  constructor(
    private modalCtrl: ModalController,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.today = new Date();

    this.startDate = new Date(this.today);
    this.startDate.setDate(this.startDate.getDate() - 1);

    this.endDate = new Date(this.today);
  }

  dateToString(date: Date) {
    return date.toISOString();
  }

  stringToDate(date: string) {
    return new Date(date);
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.store.dispatch(
      setDateRange({
        mode: this.mode.value,
        dateRange: {
          start: this.startDate,
          end: this.endDate,
        },
      })
    );

    this.modalCtrl.dismiss(
      {
        label: this.mode.label,
      },
      'confirm'
    );
  }
}
