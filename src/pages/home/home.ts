import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { LoadingController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';

declare var google: any;

export const snapshotToArray = snapshot => {
    let returnArr = [];

    snapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
};

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit{

@ViewChild('map') mapElement: ElementRef;
	
	towRequestId: string;
	userId: string;

	map: any;
	autocompleteItems: any;
	autocomplete: any;
	GoogleAutocomplete: any;
	geocoder: any;
	markers = [];

	mapOpt : {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 3000
	}

	ref = firebase.database().ref('geolocations/');
	
	towObjRef: AngularFireObject<any>;
	towObj: Observable<any>;

	userObjRef: AngularFireObject<any>;
	userObj: Observable<any>;

	isHelpRequested = false;

	constructor(private ngZone: NgZone, private geolocation: Geolocation, private loadingCtrl: LoadingController,
				private device: Device, private afAuth: AngularFireAuth, private navParams: NavParams, private db: AngularFireDatabase) {
		this.towRequestId = this.navParams.get('towRequestId');
		this.userId = this.navParams.get('userId');
		console.log(this.towRequestId, this.userId);
		//google autocomplete
		this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
		this.autocomplete = { input: '' };
		this.autocompleteItems = [];

		//geocoder
		this.geocoder = new google.maps.Geocoder;

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

		//get user
		this.userObjRef = this.db.object('geolocations/'+this.userId);
		this.userObj = this.userObjRef.valueChanges();
		this.getUserLocation();

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

	getUserLocation() {
		this.userObj.subscribe(response => {
			console.log(response);
			this.deleteMarkers();
			let image = 'assets/imgs/person-icon.png';
			let updatelocation = new google.maps.LatLng(response.latitude, response.longitude);

			let marker = new google.maps.Marker({
				position: updatelocation,
				map: this.map,
				icon: image
			});
			marker.setMap(this.map);
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

		navigator.geolocation.getCurrentPosition(response => {
			loading.dismiss();
			let towLocation = new google.maps.LatLng(response.coords.latitude, response.coords.longitude);
			this.map = new google.maps.Map(this.mapElement.nativeElement, {
				zoom: 15,
				center: towLocation,
				disableDefaultUI: true
			});
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
		watch.subscribe(data => {
			this.deleteMarkers();
			this.updateGeolocation(this.device.uuid, data.coords.latitude,data.coords.longitude);
			let updateTowLocation = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
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
	}

	private setMapOnAll(map) {
		this.markers.forEach(marker => {
			marker.setMap(map);
		})
	}

	private clearMarkers() {
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

	updateSearchResults() {
		if (this.autocomplete.input == '') {
			this.autocompleteItems = [];
			return;
		}
		this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
			(predictions, status) => {
				this.autocompleteItems = [];
				this.ngZone.run(() => {
					predictions.forEach((prediction) => {
						this.autocompleteItems.push(prediction);
					});
				});
  		});
	}

	selectSearchResult(item){
		this.clearMarkers();
		this.autocompleteItems = [];

		this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
			if(status === 'OK' && results[0]){
		        let marker = new google.maps.Marker({
		        	position: results[0].geometry.location,
		        	map: this.map
		        });
		        this.markers.push(marker);
		        this.map.setCenter(results[0].geometry.location);
	    	}
		});
	}

	onRequest() {
		console.log('requested');
		this.isHelpRequested = true;
	}

	onCancel() {
		this.isHelpRequested = false;
	}
  	
}

