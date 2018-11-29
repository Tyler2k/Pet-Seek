import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription } from 'rxjs';

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

  ngOnDestroy() {
    if (this.onUpdateFavoritePetsSubscription) {
      this.onUpdateFavoritePetsSubscription.unsubscribe();
    }
  }

  goToRootPage() {
    this.navCtrl.popToRoot();
  }

}
