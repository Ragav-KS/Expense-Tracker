import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionsPageRoutingModule } from './transactions-routing.module';

import { TransactionsPage } from './transactions.page';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionsPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [TransactionsPage, TransactionFormComponent],
})
export class TransactionsPageModule {}
