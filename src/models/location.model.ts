import { AfterViewChecked } from '@angular/core';

export class GeneralUserLocation {

	latLng: LatLng;
	cityState: string;

	constructor(location: any) {
		this.latLng = new LatLng(location.lat, location.lon)
		this.cityState = `${location.city}, ${location.region}`;
	}
}

export class LatLng {
	lat: number;
	lng: number;

	constructor(lat: number, lng: number) {
		this.lat = lat;
		this.lng = lng;
	}
}