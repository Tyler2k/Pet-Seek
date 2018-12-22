import { Component, OnInit } from "@angular/core";
import { NavParams, NavController, ViewController } from "ionic-angular";
import { FavoritePetsPage } from "../favorite-pets/favorite-pets";
import { PetModel } from "../../models/pet.model";

@Component({
    selector: 'pet-detail',
    templateUrl: 'pet-detail.html'
})

export class PetDetailPage implements OnInit {
    constructor(
        public params: NavParams,
        public navCtrl: NavController,
        public viewCtrl: ViewController,
    ) {
        this.favoritesPage = FavoritePetsPage;
    }

    favoritesPage;
    pet: PetModel;

    ngOnInit() {
        console.log(this.params.get('pet'))
        this.pet = this.params.get('pet');
    }

    goToRootPage() {
        this.navCtrl.popToRoot();
    }

}
