import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NearbyWorkshopPage } from './nearby-workshop';

@NgModule({
  declarations: [
    NearbyWorkshopPage,
  ],
  imports: [
    IonicPageModule.forChild(NearbyWorkshopPage),
  ],
})
export class NearbyWorkshopPageModule {}
