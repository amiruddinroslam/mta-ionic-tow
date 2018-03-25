import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-nearby-workshop',
  templateUrl: 'nearby-workshop.html',
})
export class NearbyWorkshopPage {

	nearbyItems: any = new Array<any>();
	GooglePlaces: any;
	autocomplete: any;
	GoogleAutocomplete: any;
	autocompleteItems = [];
	geocoder: any;


	constructor(private ngZone: NgZone, private loadingCtrl: LoadingController) {
		
		this.geocoder = new google.maps.Geocoder;
		let elem = document.createElement('div');
		this.GooglePlaces = new google.maps.places.PlacesService(elem);
		this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    	
    	this.autocomplete = {
      		input: ''
    	};

	}

	updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if(predictions){
          this.ngZone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
    });
  }

	selectSearchResult(item){
		//loading
		const loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		loading.present();

		this.autocompleteItems = [];
		this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
			if(status === 'OK' && results[0]){
				this.autocompleteItems = [];
				this.GooglePlaces.nearbySearch({
					location: results[0].geometry.location,
					radius: '500',
          types: ['car_repair'], //check other types here https://developers.google.com/places/web-service/supported_types
          key: 'AIzaSyDf7_QOSGFscNNjgt6ArugYZ2tt891KtO0'
      }, (near_places) => {
      	this.ngZone.run(() => {
      		this.nearbyItems = [];
      		for (var i = 0; i < near_places.length; i++) {
      			this.nearbyItems.push(near_places[i]);
      		}
      		loading.dismiss();
      	});
      })
			}
		})
	}

}
