import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { CoreService } from 'src/app/services/Core/core.service';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';
import { Between } from 'typeorm';
import { load, refresh } from './transaction.actions';

@Injectable()
export class TransactionEffects {
  constructor(
    private actions$: Actions,
    private repoSrv: RepositoryService,
    private coreSrv: CoreService
  ) {}

  loadMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(refresh),
      switchMap(async () => {
        return {
          list: await this.repoSrv.transactionsRepo.find({
            order: {
              date: 'DESC',
            },
            where: {
              date: Between(
                this.coreSrv.displayDateRange.start,
                this.coreSrv.displayDateRange.end
              ),
            },
          }),
        };
      }),
      map((payload) => load(payload))
    )
  );
}
