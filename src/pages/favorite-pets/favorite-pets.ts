import { Component, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription, ReplaySubject } from 'rxjs';
import { PetModel } from '../../models/pet.model';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'favorite-pets',
    templateUrl: 'favorite-pets.html'
})
export class FavoritePetsPage implements OnDestroy {

    destroy$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

    constructor(
        public navCtrl: NavController,
        private favoritesService: FavoritesService,
    ) {
        this.onUpdateFavoritePetsSubscription = this.favoritesService.onUpdateFavoritePets()
            .pipe(takeUntil(this.destroy$))
            .subscribe(pet => { this.favoritePets = pet; });
    }

    onUpdateFavoritePetsSubscription: Subscription;
    favoritePets: any[];

    deleteFavoritePet(pet: PetModel) {
        pet.isFavorite = false;
        this.favoritesService.removePetFromFavorites(pet);
    }

    goToRootPage() {
        this.navCtrl.popToRoot();
    }

    trackByFn(index: any, item: any) {
        return item.id;
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

}
