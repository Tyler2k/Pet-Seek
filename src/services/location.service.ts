import { UserLocation } from './../models/location.model';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Geolocation } from '@ionic-native/geolocation';


declare var google;

@Injectable()
export class LocationService {

	constructor(
		private http: HttpClient,
		private zone: NgZone,
		private geolocation: Geolocation
	) {
		this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
		this.autocomplete = { input: '' };
		this.autocompleteItems = [];
	}

	GoogleAutocomplete;
	autocomplete;
	autocompleteItems;

	getCurrentLocation() { // returns city and state based on user's lat/long
		return new Promise((resolve) => {
			this.geolocation.getCurrentPosition().then(r => {
				this.reverseGeocode(`${r.coords.latitude},${r.coords.longitude}`).then(location => {
					resolve(location);
				})
			})
		});
	}

	reverseGeocode(latlng: any) { 
		return new Promise((resolve) => {
			this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&result_type=locality&key=AIzaSyBbVCyIrFSyM0BumsIAl0jZb-pHf-59Gmk`).toPromise().then(location => {
				resolve(location.results[0]['formatted_address'].replace(', USA', ''));
			});
		});
	}

	getPlacePredictions(search: string): any { // returns city and state auto complete predictions based on user search input
		return new Promise((resolve) => {
			this.GoogleAutocomplete.getPlacePredictions({ types: ['(cities)'], componentRestrictions: { country: 'us' }, input: search },
				(predictions, status) => {
					this.autocompleteItems = [];
					if (predictions) {
						this.zone.run(() => {
							predictions.forEach((prediction) => {
								this.autocompleteItems.push(prediction.description.replace(', USA', ''));
							});
							resolve(this.autocompleteItems.slice());
						});
					} else {
						resolve([]);
					}
				});
		});
	}

	getGeneralLocationFromIp(): Observable<UserLocation> {
		return this.http.get<any>('http://ip-api.com/json?callback').pipe(map(r => {
			return `${r.city}, ${r.region}`;
		}));
	}

}


