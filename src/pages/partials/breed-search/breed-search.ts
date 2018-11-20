import { Component, OnInit } from "@angular/core";
import { Platform, NavParams, ViewController } from "ionic-angular";

@Component({
    selector: 'breed-search',
    templateUrl: 'breed-search.html'
})

export class BreedSearchPage implements OnInit {
    constructor(
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController,
    ) {

    }

    animal;
    items;
    originalItems;

    ngOnInit() {
        this.items = this.params.get('breedList');
        this.originalItems = this.items.slice();
    }

    dismiss(data = null) {
        this.viewCtrl.dismiss(data);
    }

    initializeItems() {
        this.items = this.originalItems.slice();
    }

    getItems(ev: any) {
        // Reset items back to all of the items
        this.initializeItems();

        // set val to the value of the searchbar
        const val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.items = this.items.filter((item) => {
                return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }
}