import { Component, OnInit, OnDestroy, ApplicationRef, ViewChild, ElementRef } from "@angular/core";
import { Platform, NavParams, ViewController, NavController } from "ionic-angular";
import { PetQueryRequest, PetModel } from "../../models/pet.model";
import { PetFinderService } from "../../services/pet-finder.service";
import { FavoritesService } from "../../services/favorites.service";
import { Subscription, ReplaySubject } from "rxjs";
import { takeUntil} from 'rxjs/operators';
import { FavoritePetsPage } from "../favorite-pets/favorite-pets";
import { PetDetailPage } from "../pet-detail/pet-detail";

@Component({
    selector: 'pet-list',
    templateUrl: 'pet-list.html'
})

export class PetListPage implements OnInit, OnDestroy {

    destroy$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

    constructor(
        public navCtrl: NavController,
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController,
        private petFinderService: PetFinderService,
        private favoritesService: FavoritesService,
        private applicationRef: ApplicationRef,
    ) {
        this.onUpdateFavoritePetsSubscription = this.favoritesService.onUpdateFavoritePets()
        .pipe(takeUntil(this.destroy$))
        .subscribe(pet => { this.favoritePets = pet; });
        this.favoritesPage = FavoritePetsPage;
    }

    @ViewChild('pulseElem', {static: false}) pulseElem: ElementRef;

    onUpdateFavoritePetsSubscription: Subscription;
    pets = [];
    favoritePets = [];
    loading: boolean = false;
    petRequest: PetQueryRequest = new PetQueryRequest();
    favoritesPage: any;

    ngOnInit() {
        console.log(this.params.get('petRequest'))
        this.petRequest = { ...this.params.get('petRequest') };
        this.queryPets(this.petRequest);
    }

    getMoreInfiniteScrollElements(event) {
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

    showPetDetailPage(pet: PetModel) {
        this.navCtrl.push(PetDetailPage, { pet: pet });
    }

    checkIfPetIsFavorited(id: string) {
        this.favoritePets.find(pet => {
            return pet.id == id;
        })
    }

    favoritePet(pet: PetModel) {
        if (this.pulseElem) {
            this.pulseElem.nativeElement.classList.add('pulse');
            setTimeout(() => {
                this.pulseElem.nativeElement.classList.remove('pulse');
            }, 2600);
        }
        pet.isFavorite = true;
        this.favoritesService.addPetToFavorites(pet);
        this.applicationRef.tick();
    }

    unFavoritePet(pet: PetModel) {
        pet.isFavorite = false;
        this.favoritesService.removePetFromFavorites(pet);
        this.applicationRef.tick();
        //event.stopPropagation();   
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}