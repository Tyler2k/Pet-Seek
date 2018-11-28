import { PetQueryResponse, PetQueryRequest, BreedListResponse } from './../models/pets.model';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FavoritesService } from './favorites.service';

@Injectable()
export class PetFinderService {

	constructor(
		private http: HttpClient,
		private favoritesService: FavoritesService,
	) { }

	private petFinderUrl: string = "http://api.petfinder.com/";
	private key = 'fa55926ac35934c7a9cba7c6d287c446';

	getRandomPet() {
		let data = {
			animal: 'dog',
			output: 'full'
		}
		return this.http.jsonp(this.petFinderUrl + 'pet.getRandom?format=json&key=fa55926ac35934c7a9cba7c6d287c446' + this.toHttpParams(data), 'callback');
	}

	getSinglePet() {
		return this.http.jsonp(this.petFinderUrl + 'pet.get?format=json&key=fa55926ac35934c7a9cba7c6d287c446&id=40861841', 'callback');
	}

	queryPets(data: PetQueryRequest): Observable<PetQueryResponse> {
		return this.http.jsonp(`${this.petFinderUrl}pet.find?format=json&key=${this.key}&${this.toHttpParams(data)}`, 'callback').pipe(map(pets => {
			return new PetQueryResponse(pets, this.favoritesService.getFavoritePets());
		}));
	}

	getBreedList(animal: string): Observable<BreedListResponse> {
		return this.http.jsonp(`${this.petFinderUrl}breed.list?format=json&key=${this.key}&animal=${animal}`, 'callback').pipe(map(breeds => {
			return new BreedListResponse(breeds);
		}))
	}

	toHttpParams(data: Object): HttpParams {
		let params = new HttpParams();
		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				const val = data[key];
				if (val !== null && val !== undefined) {
					params = params.append(key, val.toString());
				}
			}
		}
		return params;
	}

}
