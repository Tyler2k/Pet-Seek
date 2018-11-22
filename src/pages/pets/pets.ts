import { Component, OnInit } from "@angular/core";
import { Platform, NavParams, ViewController } from "ionic-angular";

@Component({
    selector: 'pets',
    templateUrl: 'pets.html'
})

export class PetPage implements OnInit {
    constructor(
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController,
    ) {

    }

    pets;

    ngOnInit() {
        this.pets = this.params.get('pets');
        console.log(this.pets);
    }
}