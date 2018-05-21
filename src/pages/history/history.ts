import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  towReqRef: AngularFireList<any>;
  towReq: Observable<any[]>;

  towReqByKeyRef: AngularFireObject<any>;
  towReqByKey: Observable<any>;

  uid: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private db: AngularFireDatabase, private afAuth: AngularFireAuth, private alertCtrl: AlertController) {
      this.afAuth.authState.subscribe(auth => {
        console.log(auth.uid);
        this.uid = auth.uid;
        this.towReqRef = this.db.list('towRequest', ref => ref.orderByChild('driverId').equalTo(this.uid));
        this.towReq = this.towReqRef.snapshotChanges().pipe(
          map(changes => 
            changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
          )
        );
      });
  }

  detail(key) {
    this.towReqByKeyRef = this.db.object('towRequest/'+key);
    this.towReqByKey = this.towReqByKeyRef.valueChanges();
    this.towReqByKey.subscribe(res => {
      this.alertCtrl.create({
        title: 'Details',
        message: 'Request by: '+res.userId
                +'<br>Problem: '+res.problem
                +'<br>Status: '+res.status
                +'<br>Total Payment: '+res.totalPayment,
        buttons: ["OK"]
      }).present();
    })

  }




}
