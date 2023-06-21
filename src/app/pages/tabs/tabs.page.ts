import { Component, OnInit } from '@angular/core';
import { AlertController, AlertInput } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { JobsService } from 'src/app/services/Jobs/jobs.service';
import { AppState } from 'src/app/store/app.index';
import { setDateRange } from 'src/app/store/settings/setting.actions';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  dateRangeMode: string = 'Current Month';
  alertInputs: AlertInput[] = [
    {
      name: 'current',
      type: 'radio',
      label: 'Current Month',
      value: 'current',
    },
    {
      name: 'previous',
      type: 'radio',
      label: 'Previous Month',
      value: 'previous',
    },
  ];

  constructor(
    private jobsSrv: JobsService,
    private store: Store<AppState>,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async handleChooseRange() {
    const alert = await this.alertController.create({
      header: 'Choose Time-frame',
      buttons: [
        {
          text: 'Ok',
          handler: (value: 'current' | 'previous') => {
            this.store.dispatch(setDateRange({ mode: value }));
            this.dateRangeMode = this.alertInputs.find(
              (input) => input.value === value
            )?.label!;
          },
        },
      ],
      inputs: this.alertInputs,
    });
    await alert.present();
  }

  handleRefresh(event: Event) {
    this.jobsSrv
      .fetchMails()
      .catch((err) => {
        if (err.message === 'Unauthenticated') {
          // Add logic to show alert/toast
          return;
        }
        console.error(err);
      })
      .finally(() => {
        (event.target as HTMLIonRefresherElement).complete();
      });
  }
}
