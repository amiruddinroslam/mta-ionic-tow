import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { IonicPage, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/filter';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-workshop-map',
  templateUrl: 'workshop-map.html',
})

export class WorkshopMapPage implements OnInit{

  @ViewChild('map') mapElement: ElementRef;

  towRequestRef: AngularFireObject<any>;
  towRequest: Observable<any>;
  
  towObjRef: AngularFireObject<any>;
	towObj: Observable<any>;

  towRequestId: string;
  destLat: any;
  destLng: any;
  map: any;
  mapOpt : {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 3000
  }
  markers = [];

  constructor(private navParams: NavParams, private db: AngularFireDatabase, private afAuth: AngularFireAuth, private zone: NgZone,
              private loadingCtrl: LoadingController, private geolocation: Geolocation, private device: Device,
              ) {
    this.towRequestId = this.navParams.data;

    this.towRequestRef = this.db.object(`towRequest/${this.towRequestId}`);
    this.towRequest = this.towRequestRef.valueChanges();
    this.towRequest.subscribe(response => {
      console.log(response);
      this.zone.run(() => {
        this.destLat = response.destLat;
        this.destLng = response.destLng;
      });
    });

    //get tow user
		let userTow = firebase.auth().currentUser;
		if(userTow) {
			console.log(userTow.uid);
			this.towObjRef = this.db.object('geolocations/'+userTow.uid);
			this.towObj = this.towObjRef.valueChanges();
			this.getTowLocation();
		} else {
			console.log('error no uid');
		}
  }

  getTowLocation() {
		this.towObj.subscribe(response => {
			console.log(response);
			this.deleteMarkers();
			let image = 'assets/imgs/truck-icon.png';
			let updatelocation = new google.maps.LatLng(response.latitude, response.longitude);
			this.addMarker(updatelocation,image);
			this.setMapOnAll(this.map);
		});
	}

  ngOnInit() {
    this.initMap();
  }

  initMap() {

    const loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		loading.present();

    let workshopLocation = new google.maps.LatLng(this.destLat, this.destLng);
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: workshopLocation,
      disableDefaultUI: true
    });

    let marker = new google.maps.Marker({
      position: workshopLocation,
      map: this.map
    });
    marker.setMap(this.map);

    navigator.geolocation.getCurrentPosition(response => {
			loading.dismiss();
			let towLocation = new google.maps.LatLng(response.coords.latitude, response.coords.longitude);
			// this.map = new google.maps.Map(this.mapElement.nativeElement, {
			// 	zoom: 15,
			// 	center: towLocation,
			// 	disableDefaultUI: true
			// });

			this.deleteMarkers();
			this.updateGeolocation(this.device.uuid, response.coords.latitude,response.coords.longitude);
			let image = 'assets/img/truck-icon.png';
			this.addMarker(towLocation, image);
			this.setMapOnAll(this.map);
		}, error => {
			loading.dismiss();
			this.initMapError(error);
		},
			this.mapOpt);

		let options = {
			frequency: 3000,
			enableHighAccuracy: true
		};

		let watch = this.geolocation.watchPosition(options);
		watch.filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
			console.log(position);
			this.deleteMarkers();
			this.updateGeolocation(this.device.uuid, position.coords.latitude,position.coords.longitude);
			let updateTowLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			let image = 'assets/img/truck-icon.png';
			this.addMarker(updateTowLocation, image);
			this.setMapOnAll(this.map);
		});
	}

	initMapError(error) {
		console.log(error);
		this.initMap();
	}
  
  private addMarker(location, image) {
		let marker = new google.maps.Marker({
			position: location,
			map: this.map,
			icon: image
		});
		this.markers.push(marker);
		console.log(this.markers);
	}

	private setMapOnAll(map) {
		this.markers.forEach(marker => {
			marker.setMap(map);
		})
	}

	private clearMarkers() {
		console.log('clear markers');
		this.setMapOnAll(null);
	}

	private deleteMarkers() {
		this.clearMarkers();
		this.markers = [];
	}

	updateGeolocation(uuid, lat, lng) {
		if(localStorage.getItem('mykey')) {
			this.afAuth.authState.subscribe(auth => {
				firebase.database().ref(`geolocations/${auth.uid}`).set({
					uuid: uuid,
					latitude: lat,
					longitude: lng
				});
			});
		} else {
			this.afAuth.authState.subscribe(auth => {
				let newData = firebase.database().ref(`geolocations/${auth.uid}`);
				newData.set({
					uuid: uuid,
					latitude: lat,
					longitude: lng
				});
				localStorage.setItem('mykey', auth.uid);
			});
			
		}
	}



}
