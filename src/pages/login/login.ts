import { TabsPage } from './../tabs/tabs';
import { AuthService } from './../../services/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Tabs } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Firebase } from '@ionic-native/firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, private authService: AuthService,
  private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
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
  //   token = this.firebaseNative.getToken();
  //   console.log(token);

  //   this.afAuth.authState.subscribe(auth => {
  //     const userRef = this.db.object(`user/${auth.uid}`);

  //     const data = {
  //       token,
  //       userId: auth.uid
  //     };

  //     userRef.set(data);
  //   })
  // }

}
