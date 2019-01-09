import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription, Subject } from 'rxjs';
import { PetModel } from '../../models/pet.model';

@Component({
  selector: 'favorite-pets',
  templateUrl: 'favorite-pets.html'
})
export class FavoritePetsPage implements OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public navCtrl: NavController,
    private favoritesService: FavoritesService,
  ) {
    this.onUpdateFavoritePetsSubscription = this.favoritesService.onUpdateFavoritePets()
      .takeUntil(this.destroy$)
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
