import { PetQueryResponse, PetQueryRequest, BreedListResponse } from './../models/pets.model';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FavoritesService } from './favorites.service';
import { ServerStateService } from './server-state.service';

@Injectable()
export class PetFinderService {

	constructor(
		private http: HttpClient,
		private favoritesService: FavoritesService,
		private serverStateService: ServerStateService,
	) { }

	private static petFinderUrl: string = "http://api.petfinder.com/";
	private static key = 'fa55926ac35934c7a9cba7c6d287c446';
	private pet_list_state_key;
	private breed_list_state_key;

	getRandomPet() {
		let data = {
			animal: 'dog',
			output: 'full'
		}
		return this.http.jsonp(PetFinderService.petFinderUrl + 'pet.getRandom?format=json&key=fa55926ac35934c7a9cba7c6d287c446' + this.toHttpParams(data), 'callback');
	}

	getSinglePet() {
		return this.http.jsonp(PetFinderService.petFinderUrl + 'pet.get?format=json&key=fa55926ac35934c7a9cba7c6d287c446&id=40861841', 'callback');
	}

	queryPets(request: PetQueryRequest, useState: boolean = false): Observable<PetQueryResponse> {
		let currentState = this.serverStateService.getServerState(this.pet_list_state_key);
		let hashedKey = 'pet-list-' + this.serverStateService.hashString(JSON.stringify(request));

		if (useState && currentState) {
			let petListState = currentState[hashedKey];
			if (petListState) {
				return Observable.of<PetQueryResponse>(petListState);
			}
		}

		return this.http.jsonp(`${PetFinderService.petFinderUrl}pet.find?format=json&key=${PetFinderService.key}&${this.toHttpParams(request)}`, 'callback').pipe(map(pets => {
			let petList = new PetQueryResponse(pets, this.favoritesService.getFavoritePets());
			this.serverStateService.setServerState(this.pet_list_state_key, currentState, hashedKey, petList);
			return petList;
		}));
	}

	getBreedList(animal: string, useState: boolean = false): Observable<BreedListResponse> {
		let currentState = this.serverStateService.getServerState(this.breed_list_state_key);
		let hashedKey = 'breed-list-' + this.serverStateService.hashString(JSON.stringify(animal));

		if (useState && currentState) {
			let breedListState = currentState[hashedKey];
			if (breedListState) {
				return Observable.of<BreedListResponse>(breedListState);
			}
		}

		return this.http.jsonp(`${PetFinderService.petFinderUrl}breed.list?format=json&key=${PetFinderService.key}&animal=${animal}`, 'callback').pipe(map(breeds => {
			let breedList = new BreedListResponse(breeds);
			this.serverStateService.setServerState(this.breed_list_state_key, currentState, hashedKey, breedList);
			return breedList;
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
