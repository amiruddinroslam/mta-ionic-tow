import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TowRequestPage } from './tow-request';

@NgModule({
  declarations: [
    TowRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(TowRequestPage),
  ],
})
export class TowRequestPageModule {}
