import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkshopMapPage } from './workshop-map';

@NgModule({
  declarations: [
    WorkshopMapPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkshopMapPage),
  ],
})
export class WorkshopMapPageModule {}
