import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { ReplaySubject, Observable } from "rxjs";
import { PetModel } from "../models/pets.model";

@Injectable()

export class FavoritesService {

    constructor(
        private storage: Storage,
    ) {
        this.storage.get('favoritePets').then(pets => {
            if (pets) {
                FavoritesService.favoritePets = pets;
                this.onUpdateFavoritePetsSubject.next(FavoritesService.favoritePets);
            }
        });
    }

    private onUpdateFavoritePetsSubject = new ReplaySubject<any>();
    private static favoritePets: any[] = [];

    onUpdateFavoritePets(): Observable<any> {
        return this.onUpdateFavoritePetsSubject.asObservable();
    }

    getFavoritePets() {
        return FavoritesService.favoritePets.slice();
    }

    addPetToFavorites(pet: any) {
        FavoritesService.favoritePets.push(pet);
        this.onUpdateFavoritePetsSubject.next(FavoritesService.favoritePets);
        this.storage.set('favoritePets', FavoritesService.favoritePets);
    }

    removePetFromFavorites(pet: PetModel, index: number = null) {

        if (index) {
            FavoritesService.favoritePets.splice(index, 1);
        } else {
            FavoritesService.favoritePets.splice(findPetIndex(), 1);
        }

        this.onUpdateFavoritePetsSubject.next(FavoritesService.favoritePets);
        this.storage.set('favoritePets', FavoritesService.favoritePets);

        function findPetIndex() {
            return FavoritesService.favoritePets.findIndex(p => {
                return pet.id == p.id;
            })
        }
    }

}