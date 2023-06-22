import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DateRangeSelectComponent } from './date-range-select/date-range-select.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {
  dateRangeMode: string = 'Current Month';

  constructor(private modalCtrl: ModalController) {}

  handleChooseDateRange() {
    this.modalCtrl
      .create({
        component: DateRangeSelectComponent,
        initialBreakpoint: 0.6,
        breakpoints: [0, 0.6, 1],
        handleBehavior: 'cycle',
      })
      .then((modal) => {
        modal.onDidDismiss<{ label: string }>().then(({ data, role }) => {
          if (role === 'confirm') {
            this.dateRangeMode = data!.label;
          }
        });

        return modal.present();
      });
  }
}
