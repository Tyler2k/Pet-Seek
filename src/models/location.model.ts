import { AfterViewChecked } from '@angular/core';

export class UserLocation {
	city: string;
	country: string;
	countryCode: string;
	region: string;
	regionName: string;
	zip: string;

	constructor(locationObj: UserLocation) {
		this.city = locationObj.city;
		this.country = locationObj.country;
		this.countryCode = locationObj.countryCode;
		this.region = locationObj.region;
		this.regionName = locationObj.regionName;
		this.zip = locationObj.zip;
	}
}