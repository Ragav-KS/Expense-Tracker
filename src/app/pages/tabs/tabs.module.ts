import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { DateRangeSelectComponent } from './date-range-select/date-range-select.component';
import { TabsPage } from './tabs.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TabsPageRoutingModule],
  declarations: [TabsPage, DateRangeSelectComponent],
})
export class TabsPageModule {}
