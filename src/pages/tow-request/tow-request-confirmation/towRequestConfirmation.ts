import { HomePage } from './../../home/home';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { TowRequest } from './../../../models/towRequest';
import { Component } from '@angular/core';
import { NavParams, ViewController, NavController } from 'ionic-angular';
import { TowRequestsService } from '../../../services/towRequests';
import { AngularFireAuth } from 'angularfire2/auth';

declare var google: any;

@Component({
    selector: 'page-tow-request-confirmation',
    template: `<ion-content padding>
                    <ion-list>
                        <ion-item text-wrap>
                            <ion-icon name="person" item-start></ion-icon>{{ towRequestModel.fullName }}
                        </ion-item>
                        <ion-item text-wrap>
                            <ion-icon name="car" item-start></ion-icon><div class="plateNo">{{ towRequestModel.vehicleRegNo }}</div>
                            <br>{{ towRequestModel.vehicleMaker }} {{ towRequestModel.vehicleModel }}
                        </ion-item>
                        <ion-item text-wrap>
                            <ion-icon name="phone-portrait" item-start></ion-icon>{{ towRequestModel.phoneNo }}
                        </ion-item>
                        <ion-item text-wrap>
                            <ion-icon name="pin" item-start></ion-icon>{{ userLocation }}
                        </ion-item>
                        <ion-item text-wrap>
                            <ion-icon name="construct" item-start></ion-icon>{{ workshopLocation }}
                        </ion-item>
                        <ion-item text-wrap>
                            <ion-icon name="time" item-start></ion-icon>{{ towRequestModel.timeDate }}
                        </ion-item>
                    </ion-list>
                    <ion-grid>
                        <ion-row>
                            <ion-col>
                                <button ion-button block color="danger" (click)="onCancel()">Cancel</button>
                            </ion-col>
                            <ion-col>
                                <button ion-button block color="secondary" (click)="onAccept(towRequestModel.userId)">Accept</button>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-content>
               `,
})

export class TowRequestConfirmationPage {
    
    towRequestId: string;
    workshopLocation: string;
    userLocation: string;

    towRequestRef: AngularFireObject<any>;
    towRequest: Observable<any>;

    constructor(private navParams: NavParams, private towRequestModel: TowRequest, 
        private db: AngularFireDatabase, private towRequestService: TowRequestsService, 
        private viewCtrl: ViewController, private afAuth: AngularFireAuth, 
        private navCtrl: NavController) {
        this.towRequestModel = this.navParams.data;
        this.towRequestId = this.towRequestModel.towRequestId;
        
            this.towRequestRef = this.towRequestService.getTowRequestObjectFromKey(this.towRequestId);
            this.towRequest = this.towRequestRef.valueChanges();
            this.getTowRequest();
        
    }

    getTowRequest() {
        this.towRequest.subscribe(request => {
            //console.log(request);
            //get workshop address
            let geocoder = new google.maps.Geocoder();
            var destLatLng = {lat: request.destLat, lng: request.destLng};
            geocoder.geocode({'location': destLatLng}, (res, stats) => {
                if(stats == google.maps.GeocoderStatus.OK) {
                    if(res[0]) {
                        this.workshopLocation = res[0].formatted_address;
                    }
                }
            });

            var originLatLng = {lat: request.originLat, lng: request.originLng};
            geocoder.geocode({'location': originLatLng}, (res, stats) => {
                if(stats == google.maps.GeocoderStatus.OK) {
                    if(res[0]) {
                        this.userLocation = res[0].formatted_address;
                    }
                }
            });
        });
    }

    onCancel() {
        this.viewCtrl.dismiss();
    }

    onAccept(userId) {
        this.afAuth.authState.subscribe(auth => {
            this.towRequestService.updatePickupFlag(this.towRequestId, auth.uid);
        })
        this.navCtrl.push(HomePage, {"userId": userId, "towRequestId": this.towRequestId});
        
    }
}