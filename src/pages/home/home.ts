import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit{

@ViewChild('map') mapElement: ElementRef;
	
	map: any;
	autocompleteItems: any;
	autocomplete: any;
	GoogleAutocomplete: any;
	geocoder: any;
	markers = [];

	isHelpRequested = false;

	constructor(private ngZone: NgZone, private geolocation: Geolocation, private loadingCtrl: LoadingController) {
		//google autocomplete
		this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
		this.autocomplete = { input: '' };
		this.autocompleteItems = [];

		//geocoder
		this.geocoder = new google.maps.Geocoder;
	}

	ngOnInit() {
		this.initMap();
		this.initGeolocation();
	}

	initMap() {
		this.map = new google.maps.Map(this.mapElement.nativeElement, {
			center: {lat: 41.85, lng: -87.65},
      		zoom: 15,
      		disableDefaultUI: true
		});
	}

	initGeolocation(){
		//loading
		const loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		loading.present();

		this.clearMarkers();
		this.geolocation.getCurrentPosition().then((resp) => {
			loading.dismiss();
			let pos = {
				lat: resp.coords.latitude,
				lng: resp.coords.longitude
			};
			let marker = new google.maps.Marker({
				position: pos,
				map: this.map,
				title: 'I am here!'
			});
			this.markers.push(marker);
			this.map.setCenter(pos);
		}).catch((error) => {
			loading.dismiss();
			console.log('Error getting location', error);
		});
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
		        // let position = {
		        //     lat: results[0].geometry.location.lat,
		        //     lng: results[0].geometry.location.lng
		        // };
		        let marker = new google.maps.Marker({
		        	position: results[0].geometry.location,
		        	map: this.map
		        });
		        this.markers.push(marker);
		        this.map.setCenter(results[0].geometry.location);
	    	}
		})
	}

	clearMarkers(){
	for (var i = 0; i < this.markers.length; i++) {
	  console.log(this.markers[i])
	  this.markers[i].setMap(null);
	}
	this.markers = [];
	}

	onRequest() {
		console.log('requested');
		this.isHelpRequested = true;
	}

	onCancel() {
		this.isHelpRequested = false;
	}
  	
}

