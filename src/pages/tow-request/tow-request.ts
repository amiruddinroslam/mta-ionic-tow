import { Firebase } from '@ionic-native/firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireObject, AngularFireAction, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { IonicPage, AlertController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { TowRequestsService } from './../../services/towRequests';
import { TowRequest } from '../../models/towRequest';
import { TowRequestConfirmationPage } from './tow-request-confirmation/towRequestConfirmation';

declare var google: any;

@Component({
  selector: 'page-tow-request',
  templateUrl: 'tow-request.html',
})


export class TowRequestPage {

  towRequestRef: AngularFireList<any>;
  towRequest: Observable<any[]>;

  TowRequestKeyRef: AngularFireList<any>;
  towRequestKey: Observable<any>;

  userDetalisRef: AngularFireObject<any>;
  userDetails: Observable<any>;

  location: string;
  userId: string;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, 
    private afs: AngularFirestore, private firebaseNative: Firebase,
    private towRequestsService: TowRequestsService, private towRequestModel: TowRequest,
    private modalCtrl: ModalController, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    // this.towRequestRef = this.towRequestsService.getTowRequestPickupFlag();
    // this.towRequest = this.towRequestRef.valueChanges();
    //this.getUserId();
    this.getToken();
    this.TowRequestKeyRef = this.towRequestsService.getTowRequestPickupFlag();
    this.towRequestKey = this.TowRequestKeyRef.snapshotChanges().map(requests => {
      return requests.map(c => ({
        key: c.payload.key, ...c.payload.val()
      }));
    });
  }

  onSelect(userId, towRequestId, originLat, originLng, timeDate) {
    console.log(originLat, originLng);
    let geocoder = new google.maps.Geocoder();
    var latlng = {lat: originLat, lng: originLng};
    geocoder.geocode({'location': latlng}, (res, stats) => {
      if(stats == google.maps.GeocoderStatus.OK) {
        if(res[0]) {
          this.location = res[0].formatted_address;
          console.log(this.location);
        }
      }
    });

    this.userDetalisRef = this.towRequestsService.getUserFromKey(userId);
    this.userDetails = this.userDetalisRef.valueChanges();
    this.userDetails.subscribe(user => {
      this.towRequestModel.userId = userId;
      this.towRequestModel.vehicleRegNo = user.vehicleRegNo;
      this.towRequestModel.vehicleModel = user.vehicleModel;
      this.towRequestModel.vehicleMaker = user.vehicleMaker;
      this.towRequestModel.fullName = user.fullName;
      this.towRequestModel.phoneNo = user.phoneNo;
      this.towRequestModel.timeDate = timeDate;
      this.towRequestModel.towRequestId = towRequestId;

      let modal = this.modalCtrl.create(TowRequestConfirmationPage, this.towRequestModel, {cssClass:"myModal"});
      modal.present();
    })

  }

    async getToken() {
    let token;

    token = await this.firebaseNative.getToken().catch(err => { console.log("error:", err) });
    

    return this.saveTokenToDatabase(token);
  }

  //save token to db
  private saveTokenToDatabase(token) {
    console.log(token);
    if(!token) return;

    this.afAuth.authState.subscribe(auth =>{
    this.userId = auth.uid;
    });

    const devicesRef = this.afs.collection('devices')

    const docData = {
      token,
      //userId: this.userId
    }

    return devicesRef.doc(token).set(docData);
  }
}
