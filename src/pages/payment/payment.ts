import { TabsPage } from './../tabs/tabs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  key: string;
  towReqRef: AngularFireObject<any>;
  towReq: Observable<any>;

  totalDistance: number;
  totalPrice: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase,
    private toastCtrl: ToastController, private alertCtrl: AlertController, private afAuth: AngularFireAuth) {
    this.key = this.navParams.get("key");
    this.towReqRef = this.db.object('towRequest/'+this.key);
    this.towReq = this.towReqRef.valueChanges();
    this.getTotalDuration();
  }

  getTotalDuration() {
    this.towReq.subscribe(res => {
      this.totalDistance = (+res.distance/1000);
      this.totalPrice = (+this.totalDistance) * 17;
      this.totalPrice = +this.totalPrice.toFixed(2);
      console.log(this.totalPrice);
    });
  }

  paid() {

    const toast = this.toastCtrl.create({
      message: "The towing process is completed.",
      duration: 2000
    })

    const alert = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Confirm that customer already paid the total amount?',
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            this.towReqRef.update({"totalPayment": this.totalPrice});
            toast.present();
            this.navCtrl.setRoot(TabsPage);
          }
        }
      ]
    });

    alert.present();
  }

}
