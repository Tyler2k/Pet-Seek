import { UserLocation } from './../models/location.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LocationService {

	constructor(
		private http: HttpClient
	) { }

	getUserLocation(): Observable<UserLocation> {
		return this.http.get<UserLocation>('http://ip-api.com/json?callback').pipe(map(r => {
			return new UserLocation(r);
		}));
	}
}