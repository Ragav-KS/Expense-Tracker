import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/services/Jobs/jobs.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  constructor(private jobsSrv: JobsService) {}

  ngOnInit() {}

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
