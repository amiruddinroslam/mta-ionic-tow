import { PaymentPage } from './../pages/payment/payment';
import { LoginPage } from './../pages/login/login';
import { TowRequest } from './../models/towRequest';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { NearbyWorkshopPage } from '../pages/nearby-workshop/nearby-workshop';
import { TowRequestPage } from '../pages/tow-request/tow-request';
import { TowRequestConfirmationPage } from '../pages/tow-request/tow-request-confirmation/towRequestConfirmation';
import { HistoryPage } from '../pages/history/history';

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
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { credentials } from './config';
import { Firebase } from '@ionic-native/firebase';
import { FcmProvider } from '../providers/fcm/fcm';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    TabsPage,
    ProfilePage,
    NearbyWorkshopPage,
    TowRequestPage,
    TowRequestConfirmationPage,
    PaymentPage,
    HistoryPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(credentials.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserAnimationsModule
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
    TowRequestConfirmationPage,
    PaymentPage,
    HistoryPage
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
    Device,
    FcmProvider
  ]
})
export class AppModule {}
