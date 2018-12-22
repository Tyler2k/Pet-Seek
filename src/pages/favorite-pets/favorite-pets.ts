import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription } from 'rxjs';
import { PetModel } from '../../models/pet.model';

@Component({
  selector: 'favorite-pets',
  templateUrl: 'favorite-pets.html'
})
export class FavoritePetsPage implements OnDestroy {

  constructor(
    public navCtrl: NavController,
    private favoritesService: FavoritesService,
  ) {
    this.onUpdateFavoritePetsSubscription = this.favoritesService.onUpdateFavoritePets().subscribe(pet => { this.favoritePets = pet; });
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

  ngOnDestroy() {
    if (this.onUpdateFavoritePetsSubscription) {
      this.onUpdateFavoritePetsSubscription.unsubscribe();
    }
  }

}
