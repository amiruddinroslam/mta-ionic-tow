import { AngularFireDatabase, AngularFireObject, AngularFireAction, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { IonicPage, AlertController, ModalController, LoadingController } from 'ionic-angular';
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


export class TowRequestPage implements OnInit{

  towRequestRef: AngularFireList<any>;
  towRequest: Observable<any[]>;

  TowRequestKeyRef: AngularFireList<any>;
  towRequestKey: Observable<any>;

  userDetalisRef: AngularFireObject<any>;
  userDetails: Observable<any>;

  location: string;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, 
    private towRequestsService: TowRequestsService, private towRequestModel: TowRequest,
    private modalCtrl: ModalController, private loadingCtrl: LoadingController) {
    // this.towRequestRef = this.towRequestsService.getTowRequestPickupFlag();
    // this.towRequest = this.towRequestRef.valueChanges();

    this.TowRequestKeyRef = this.towRequestsService.getTowRequestPickupFlag();
    this.towRequestKey = this.TowRequestKeyRef.snapshotChanges().map(requests => {
      return requests.map(c => ({
        key: c.payload.key, ...c.payload.val()
      }));
    });
  }

  ngOnInit() {
    // var loading = this.loadingCtrl.create();
    // loading.present();
    // this.towRequestKey.subscribe(results => {
    //   loading.dismiss();
    //   results.forEach(result => {
    //     console.log(result);
    //     let geocoder = new google.maps.Geocoder();
    //     var latlng = {lat: result.originLat, lng: result.originLng};
    //     geocoder.geocode({'location': latlng}, (res, stats) => {
    //       if(stats == google.maps.GeocoderStatus.OK) {
    //         if(res[0]) {
    //           this.locationUserid.push({"location": res[0].formatted_address, "timeDate": result.timeDate, "userid": result.userId, "towid": result.key});
    //         }
    //       }
    //     });
    //   })
    // })
  }

  // private mergeArr(arr1, arr2) {
  //   for(var i=0; i<arr1.length; i++)
  //   {
  //     this.locationUserid.push({towRequestId: arr1[i], location: arr2[i]});
  //   }
    
     
  // }

  // private getUserDetails() {
  //   return this.userDetails.subscribe(user => {
  //   })
  // }

  // onSelectRequest(userId, towRequestId, location, timeDate) {
  //   this.userDetalisRef = this.towRequestsService.getUserFromKey(userId);
  //   this.userDetails = this.userDetalisRef.valueChanges();
  //   this.userDetails.subscribe(user => {
  //     this.towRequestModel.userId = userId;
  //     this.towRequestModel.vehicleRegNo = user.vehicleRegNo;
  //     this.towRequestModel.vehicleModel = user.vehicleModel;
  //     this.towRequestModel.vehicleMaker = user.vehicleMaker;
  //     this.towRequestModel.fullName = user.fullName;
  //     this.towRequestModel.phoneNo = user.phoneNo;
  //     this.towRequestModel.location = location;
  //     this.towRequestModel.timeDate = timeDate;
  //     this.towRequestModel.towRequestId = towRequestId;

  //     let modal = this.modalCtrl.create(TowRequestConfirmationPage, this.towRequestModel, {cssClass:"myModal"});
  //     modal.present();
  //   })
    
  // }

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
}
