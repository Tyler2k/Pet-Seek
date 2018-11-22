import { AfterViewChecked } from '@angular/core';

export class UserLocation {
	constructor(locationObj) {
		return locationObj['formatted_address'].replace(', USA','');
	}
}