import { Component, OnInit, OnDestroy, ApplicationRef, ViewChild, ElementRef } from "@angular/core";
import { Platform, NavParams, ViewController, NavController } from "ionic-angular";
import { PetQueryRequest, PetModel } from "../../models/pets.model";
import { PetFinderService } from "../../services/pet-finder.service";
import { FavoritesService } from "../../services/favorites.service";
import { Subscription } from "rxjs";
import { FavoritePetsPage } from "../favorite-pets/favorite-pets";

@Component({
    selector: 'pet-list',
    templateUrl: 'pet-list.html'
})

export class PetListPage implements OnInit, OnDestroy {
    constructor(
        public navCtrl: NavController,
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController,
        private petFinderService: PetFinderService,
        private favoritesService: FavoritesService,
        private applicationRef: ApplicationRef,
    ) {
        this.onUpdateFavoritePetsSubscription = this.favoritesService.onUpdateFavoritePets().subscribe(pet => { this.favoritePets = pet; });
        this.favoritesPage = FavoritePetsPage;
    }

    @ViewChild('pulseElem') pulseElem: ElementRef;

    onUpdateFavoritePetsSubscription: Subscription;
    pets = [];
    favoritePets = [];
    loading: boolean = false;
    petRequest: PetQueryRequest = new PetQueryRequest();
    favoritesPage: any;

    ngOnInit() {
        console.log(this.params.get('petRequest'))
        this.petRequest = Object.assign({},this.params.get('petRequest'));
        this.queryPets(this.petRequest);
    }

    doInfinite(event) {
        this.queryPets(this.petRequest, event);
    }

    queryPets(petRequest: PetQueryRequest, infiniteScroll?) {
        this.loading = true;
        this.petFinderService.queryPets(petRequest, true).subscribe(
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
        this.pulseElem.nativeElement.classList.add('pulse');
        setTimeout(() => {
            this.pulseElem.nativeElement.classList.remove('pulse');
        }, 2600);
        pet.isFavorite = true;
        this.favoritesService.addPetToFavorites(pet);
        this.applicationRef.tick();
    }

    unFavoritePet(pet: PetModel) {
        pet.isFavorite = false;
        this.favoritesService.removePetFromFavorites(pet);
        this.applicationRef.tick();
    }

    ngOnDestroy() {
        if (this.onUpdateFavoritePetsSubscription) {
            this.onUpdateFavoritePetsSubscription.unsubscribe();
        }
    }
}