import { Component, OnInit, OnDestroy } from "@angular/core";
import { Platform, NavParams, ViewController } from "ionic-angular";
import { PetQueryRequest, PetModel } from "../../models/pets.model";
import { PetFinderService } from "../../services/pet-finder.service";
import { FavoritesService } from "../../services/favorites.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'pet-list',
    templateUrl: 'pet-list.html'
})

export class PetListPage implements OnInit, OnDestroy {
    constructor(
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController,
        private petFinderService: PetFinderService,
        private favoritesService: FavoritesService,
    ) {
        this.onUpdateFavoritePetsSubscription = this.favoritesService.onUpdateFavoritePets().subscribe(pet => { this.favoritePets = pet; });
    }

    onUpdateFavoritePetsSubscription: Subscription;
    pets = [];
    favoritePets = [];
    loading: boolean = false;
    petRequest: PetQueryRequest = new PetQueryRequest();

    ngOnInit() {
        this.petRequest = this.params.get('petRequest');
        this.queryPets(this.petRequest);
    }

    doInfinite(event) {
        this.queryPets(this.petRequest, event);
    }

    queryPets(petRequest: PetQueryRequest, infiniteScroll?) {
        this.loading = true;
        this.petFinderService.queryPets(petRequest).subscribe(
            petList => {
                this.pets = this.pets.concat(petList.pets);
                this.petRequest.offset = petList.lastOffset;
                if (infiniteScroll) { infiniteScroll.complete(); }
                this.loading = false;
                console.log(this.pets)
            },
            e => {
                console.log(e);
                if (infiniteScroll) { infiniteScroll.complete(); }
                this.loading = false;
            }
        )
    }

    checkIfPetIsFavorited(id: string) {
        this.favoritePets.find(pet => {
            return pet.id == id;
        })
    }

    favoritePet(pet: PetModel) {
        pet.isFavorite = true;
        this.favoritesService.addPetToFavorites(pet);        
    }

    unFavoritePet(pet: PetModel) {
        pet.isFavorite = false;
        this.favoritesService.removePetFromFavorites(pet);        
    }

    ngOnDestroy() {
        if (this.onUpdateFavoritePetsSubscription) {
          this.onUpdateFavoritePetsSubscription.unsubscribe();
        }
      }
}