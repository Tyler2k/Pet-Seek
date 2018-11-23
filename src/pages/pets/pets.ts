import { Component, OnInit } from "@angular/core";
import { Platform, NavParams, ViewController } from "ionic-angular";
import { PetQueryRequest } from "../../models/pets.model";
import { PetFinderService } from "../../services/pet-finder.service";

@Component({
    selector: 'pets',
    templateUrl: 'pets.html'
})

export class PetPage implements OnInit {
    constructor(
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController,
        private petFinderService: PetFinderService,
    ) {

    }

    pets = [];
    loading: boolean = false;
    petRequest: PetQueryRequest = new PetQueryRequest();

    ngOnInit() {
        this.petRequest = this.params.get('petRequest');
        this.queryPets(this.petRequest);
    }

    doInfinite(event) {
        console.log('hit');
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
            },
            e => {
                console.log(e);
                if (infiniteScroll) { infiniteScroll.complete(); }
                this.loading = false;
            }
        )
    }

    favoritePet() {
        
    }
}