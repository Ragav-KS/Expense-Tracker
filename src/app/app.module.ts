import { CUSTOM_ELEMENTS_SCHEMA, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import 'reflect-metadata';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GAuthEffects } from './store/GAuth/gauth.effects';
import { reducers } from './store/app.index';
import { MailEffects } from './store/mail/mail.effects';
import { SettingEffects } from './store/settings/setting.effects';
import { TransactionEffects } from './store/transaction/transaction.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      logOnly: !isDevMode(),
      trace: true,
    }),
    EffectsModule.forRoot([
      TransactionEffects,
      SettingEffects,
      MailEffects,
      GAuthEffects,
    ]),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
