import { LoginPage } from './../pages/login/login';
import { TowRequest } from './../models/towRequest';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { NearbyWorkshopPage } from '../pages/nearby-workshop/nearby-workshop';
import { TowRequestPage } from '../pages/tow-request/tow-request';
import { TowRequestConfirmationPage } from '../pages/tow-request/tow-request-confirmation/towRequestConfirmation';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from './../services/auth';
import { TowRequestsService } from '../services/towRequests';

//native
import { Geolocation } from '@ionic-native/geolocation'; 
import { Device } from '@ionic-native/device';

//firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { credentials } from './config';
import { Firebase } from '@ionic-native/firebase';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    TabsPage,
    ProfilePage,
    NearbyWorkshopPage,
    TowRequestPage,
    TowRequestConfirmationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(credentials.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    TabsPage,
    ProfilePage,
    NearbyWorkshopPage,
    TowRequestPage,
    TowRequestConfirmationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    AngularFireDatabase,
    AuthService,
    TowRequestsService,
    TowRequest,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Firebase,
    Device
  ]
})
export class AppModule {}
