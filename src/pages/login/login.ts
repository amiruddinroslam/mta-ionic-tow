import { TabsPage } from './../tabs/tabs';
import { AuthService } from './../../services/auth';
import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Tabs, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Firebase } from '@ionic-native/firebase';
import { Observable } from 'rxjs/Observable';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  animations: [
 
    //For the logo
    trigger('flyInBottomSlow', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({transform: 'translate3d(0,2000px,0'}),
        animate('2000ms ease-in-out')
      ])
    ]),
 
    //For the background detail
    trigger('flyInBottomFast', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({transform: 'translate3d(0,2000px,0)'}),
        animate('1000ms ease-in-out')
      ])
    ]),
 
    //For the login form
    trigger('bounceInBottom', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        animate('2000ms 200ms ease-in', keyframes([
          style({transform: 'translate3d(0,2000px,0)', offset: 0}),
          style({transform: 'translate3d(0,-20px,0)', offset: 0.9}),
          style({transform: 'translate3d(0,0,0)', offset: 1})
        ]))
      ])
    ]),
 
    //For login button
    trigger('fadeIn', [
      state('in', style({
        opacity: 1
      })),
      transition('void => *', [
        style({opacity: 0}),
        animate('1000ms 2000ms ease-in')
      ])
    ])
  ]
})
export class LoginPage {

  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";

  user: Observable<any>;

  constructor(public navCtrl: NavController, private authService: AuthService,
  private loadingCtrl: LoadingController, private toastCtrl: ToastController,
  private firebaseNative: Firebase, private afAuth: AngularFireAuth,
  private db: AngularFireDatabase, private alertCtrl: AlertController) {
  }

  onLogin(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loading.present();

    const toast = this.toastCtrl.create({
      message: 'Wrong email or password. Please try again.',
			duration: 2000
    });

    const alertUser = this.alertCtrl.create({
      title: 'Error',
      message: 'This app is only for towing service provider use. For customer, please use Mobile Tow Assist.',
      buttons: ['Ok']
    });

    this.authService.login(form.value.email, form.value.password)
    .then(data => {
      this.afAuth.authState.subscribe(auth => {
        this.user = this.db.object(`user/${auth.uid}`).valueChanges();
        this.user.subscribe(res => {
          if (res.role != 2) {
            alertUser.present();
            this.authService.logout();
            this.navCtrl.setRoot(LoginPage);
          }
        })
			});
      loading.dismiss();
      this.navCtrl.setRoot(TabsPage);
    })
    .catch(error => {
      loading.dismiss();
      toast.present();
    })
  }

}
