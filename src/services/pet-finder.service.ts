import { PetQueryResponse, PetQueryRequest, BreedListResponse } from './../models/pet.model';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FavoritesService } from './favorites.service';
import { ServerStateService } from './server-state.service';
import { AuthenticationService } from './authentication.service';
import { config } from '../config';

@Injectable()
export class PetFinderService {

    constructor(
        private http: HttpClient,
        private favoritesService: FavoritesService,
        private serverStateService: ServerStateService,
        private authenticationService: AuthenticationService
    ) { }

    private pet_list_state_key;
    private breed_list_state_key;
    private type_list_state_key;

    getHeaderWithAuth() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authenticationService.getToken()}`,
            }),
        }
        return httpOptions;
    }

    getHeader() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                //'Authorization': `bearer ${this.authenticationService.getUserToken()}`,
            }),
        }
        return httpOptions;
    }

    // test() {
    //     return this.http.get(`https://api.petfinder.com/v2/animals?type=${encodeURIComponent('Small & Furry')}&page=1`, this.getHeaderWithAuth()).pipe(map(r => <any>r))
    // }

    // getRandomPet() {
    //     let data = {
    //         animal: 'dog',
    //         output: 'full'
    //     }
    //     return {};this.http.jsonp(PetFinderService.petFinderUrl + 'pet.getRandom?format=json&key=fa55926ac35934c7a9cba7c6d287c446' + this.toHttpParams(data), 'callback');
    // }

    // getSinglePet() {
    //     return this.http.jsonp(PetFinderService.petFinderUrl + 'pet.get?format=json&key=fa55926ac35934c7a9cba7c6d287c446&id=40861841', 'callback');
    // }
    // 4 options 41357149

    queryPets(request: PetQueryRequest, useState: boolean = false): Observable<PetQueryResponse> {
        let currentState = this.serverStateService.getServerState(this.pet_list_state_key);
        let hashedKey = 'pet-list-' + this.serverStateService.hashString(JSON.stringify(request));

        if (useState && currentState) {
            let petListState = currentState[hashedKey];
            if (petListState) {
                return of<PetQueryResponse>(petListState);
            }
        }

        return this.http.get(`${config.petfinderBaseUrl}/animals?${this.toHttpParams(request)}`, this.getHeaderWithAuth()).pipe(map(pets => {
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
                return of<BreedListResponse>(breedListState);
            }
        }

        return this.http.get(`${config.petfinderBaseUrl}/types/${animal}/breeds`, this.getHeaderWithAuth()).pipe(map(breeds => {
            let breedList = new BreedListResponse(breeds);
            this.serverStateService.setServerState(this.breed_list_state_key, currentState, hashedKey, breedList);
            return breedList;
        }))
    }

    getAnimalTypes(useState = false) {
        let currentState = this.serverStateService.getServerState(this.type_list_state_key);
        let hashedKey = 'animal-types-' + this.serverStateService.hashString('animal-types');

        if (useState && currentState) {
            let animalTypes = currentState[hashedKey];
            if (animalTypes) {
                return of<any>(animalTypes);
            }
        }

        return this.http.get(`${config.petfinderBaseUrl}/types`, this.getHeaderWithAuth()).pipe(map(types => {
            let typeList = types;
            this.serverStateService.setServerState(this.type_list_state_key, currentState, hashedKey, typeList);
            return typeList;
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
