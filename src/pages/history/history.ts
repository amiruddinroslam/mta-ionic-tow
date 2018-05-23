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
  towReq2: Observable<any[]>;

  towReqByKeyRef: AngularFireObject<any>;
  towReqByKey: Observable<any>;

  uid: string;
  totalPayments = [];
  sum = 0;

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
        this.towReq2 = this.towReqRef.valueChanges();
        this.getTotalCollectedPayments();
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
        buttons: ['OK']
      }).present();
    });
  }

  getTotalCollectedPayments() {
    this.towReq2.subscribe(reqs => {
      reqs.forEach(req => {
        this.totalPayments.push(req.totalPayment);
      });
      this.totalPayments = this.filter_array(this.totalPayments);
      this.sum = this.totalPayments.reduce((acc, val) => { return acc + val });
    });
  }

  filter_array(test_array) {
    let index = -1;
    const arr_length = test_array ? test_array.length : 0;
    let resIndex = -1;
    const result = [];

    while (++index < arr_length) {
        const value = test_array[index];

        if (value) {
            result[++resIndex] = +value;
        }
    }
    return result;
  }


}
