import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/services/Jobs/jobs.service';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  constructor(
    private jobsSrv: JobsService,
    private repoSrv: RepositoryService
  ) {}

  ngOnInit() {}

  async fetchMails() {
    return new Promise<void>((resolve, reject) => {
      this.jobsSrv.loadMails().subscribe({
        next: (transaction) => {
          console.log(transaction);
        },
        complete: () => {
          this.repoSrv.save();
          resolve();
        },
      });
    });
  }

  handleRefresh(event: Event) {
    this.fetchMails().then(() => {
      (event.target as HTMLIonRefresherElement).complete();
    });
  }
}
