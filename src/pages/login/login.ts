import { TabsPage } from './../tabs/tabs';
import { AuthService } from './../../services/auth';
import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Tabs } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Firebase } from '@ionic-native/firebase';
import { AngularFirestore } from 'angularfire2/firestore';


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

  constructor(public navCtrl: NavController, private authService: AuthService,
  private loadingCtrl: LoadingController, private toastCtrl: ToastController,
  private firebaseNative: Firebase, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
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

    this.authService.login(form.value.email, form.value.password)
    .then(data => {
      //this.getToken();
      loading.dismiss();
      this.navCtrl.setRoot(TabsPage);
    })
    .catch(error => {
      loading.dismiss();
      toast.present();
    })
  }

  // async getToken() {
  //   let token;

  //     token = await this.firebaseNative.getToken();

  //   return this.saveTokenToDatabase(token);
  // }

  // private getUserId() {
  //   let uid;
  //   this.afAuth.authState.subscribe(auth =>{
  //       uid = auth.uid;
  //   });

  //   return uid;
  // }

  // //save token to db
  // private saveTokenToDatabase(token) {
  //   if(!token) return;

  //   const devicesRef = this.afs.collection('devices')

  //   const docData = {
  //     token,
  //     userId: this.getUserId()
  //   }

  //   return devicesRef.doc(token).set(docData);
  // }

  // async getToken() {
  //   let token;
  //   token = this.firebaseNative.getToken();
  //   console.log(token);

  //   this.afAuth.authState.subscribe(auth => {
  //     //const userRef = this.db.object(`user/${auth.uid}`);
  //     console.log(auth.uid);
  //     const userRef = this.afs.collection('devices');

  //     const data = {
  //       token,
  //       userId: auth.uid
  //     };

  //     userRef.doc(token).set(data);
  //   })
  // }

}
