import { HistoryPage } from './../pages/history/history';
import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { LoginPage } from '../pages/login/login';
import * as firebase from 'Firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild('nav') nav; NavController;

  userRef: AngularFireObject<any>;
  user: Observable<any>;

  rootPage:any = LoginPage;
  homePage = HomePage;
  profilePage = ProfilePage;
  tabsPage = TabsPage;
  historyPage = HistoryPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menuCtrl: MenuController,
    private db: AngularFireDatabase) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('Platform is ready');
      // this.fcm.subscribeToTopic('all');
      // this.fcm.getToken().then(token => {
      //   // backend.registerToken(token);
      // });
      // this.fcm.onNotification().subscribe(data => {
      //   alert('message received')
      //   if(data.wasTapped) {
      //   console.info("Received in background");
      //   } else {
      //   console.info("Received in foreground");
      //   };
      // });
      // this.fcm.onTokenRefresh().subscribe(token => {
      //   // backend.registerToken(token);
      // });
      statusBar.styleDefault();
      splashScreen.hide();
      // ).subscribe()
    });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
       this.userRef = this.db.object('user/'+user.uid);
       this.user = this.userRef.valueChanges();
      } 
    });
  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout() {
    this.nav.setRoot(LoginPage);
    firebase.auth().signOut();
  }
}
