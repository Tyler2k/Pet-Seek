import { Component, OnInit, trigger, state, style, animate, transition, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, ModalController, NavParams, Platform, ViewController } from 'ionic-angular';
import { LocationService } from '../../services/location.service';
import { PetFinderService } from '../../services/pet-finder.service';
import { PetModel, PetQueryRequest } from '../../models/pets.model';
import { BreedSearchPage } from '../partials/breed-search/breed-search';
import { FilterService } from '../../services/filter.service';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styles: [
    `
    .item-block{
      min-height: 0;
      transition: 0.09s all linear;
    }
    `
  ],
  animations: [
    trigger('expand', [
      state('true', style({ height: '45px' })),
      state('false', style({ height: '0' })),
      transition('void => *', animate('0s')),
      transition('* <=> *', animate('250ms ease-in-out'))
    ])
  ]
})

export class HomePage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;

  constructor(
    public navCtrl: NavController,
    private locationService: LocationService,
    private petFinderService: PetFinderService,
    public modalCtrl: ModalController,
    private filterService: FilterService,
    private zone: NgZone,
  ) {
    this.filters = this.filterService.getFilters();
    this.breedFilter = this.filters.find(obj => obj.id == 'breed');

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  pets: PetModel[];
  breedFilter;
  petRequest: PetQueryRequest = new PetQueryRequest();
  loading: boolean = true;
  loadingText = 'Finding Pets Near You';
  breeds;
  filters;
  map;
  GoogleAutocomplete;
  autocomplete;
  autocompleteItems;
  // options = {
  //   types: ['(cities)'],
  //   input: { input: '' },
  // };

  ngOnInit() { }

  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({types: ['(cities)'], componentRestrictions: {country: 'us'}, input: this.autocomplete.input },
      (predictions, status) => {
        console.log(predictions)
        this.autocompleteItems = [];
        if (predictions) {
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction.description.replace(', USA',''));
            });
          });
        }
      });
  }

  selectSearchResult(item) {
    this.autocompleteItems = [];
    this.petRequest.location = item;
    this.queryPets(this.petRequest);
  }

  updateFilter(filter, selectedItem) {
    if (filter.id == 'animal' && selectedItem.id && filter.currentItem !== selectedItem.name) {
      this.breedFilter.currentItem = 'Any';
      this.petRequest.breed = null;
      this.getBreedList(selectedItem.id);
    }
    filter.currentItem = selectedItem.name;
    this.petRequest[filter.id] = selectedItem.id;
    this.toggleGroup(filter);
  }

  validateFilters(filter) {
    if (filter.id == 'breed') {
      if (this.petRequest.animal) {
        this.presentBreedSearchModal();
      } else {
        console.log('BAD')
      }
    } else {
      this.toggleGroup(filter);
    }
  }

  toggleGroup(filter) {
    for (var i = 0; i < this.filters.length; i++) {
      //close all other active groups
      if (this.filters[i].id != filter.id) this.filters[i].active = false;
    }
    //expand only the clicked group
    filter.active = !filter.active;
  }

  presentBreedSearchModal() {
    const searchModal = this.modalCtrl.create(BreedSearchPage, { breedList: this.breeds });
    searchModal.onDidDismiss(selectedItem => {
      this.breedFilter.active = false;
      selectedItem ? this.breedFilter.currentItem = selectedItem : this.breedFilter.currentItem = null;
      this.petRequest[this.breedFilter.id] = selectedItem;
    });
    searchModal.present();
  }

  getBreedList(animal: string) {
    this.petFinderService.getBreedList(animal).subscribe(
      response => {
        response.breeds.unshift('Any');
        this.breeds = response.breeds;
      }
    )
  }

  validateBreedList(filter) {
    return filter.id == 'breed' && !this.petRequest.animal;
  }

  queryPets(query: PetQueryRequest) {
    this.loading = true;
    this.petFinderService.queryPets(query).subscribe(
      petList => {
        this.pets = petList.pets;
        setTimeout(() => {
          this.loading = false;
        }, 1000);
        console.log(this.pets);
      },
      e => {
        console.log(e);
        this.loading = false;
      }
    )
  }

}




// getUserLocation() {
//   this.locationService.getUserLocation().subscribe(
//     location => {
//       this.petRequest.location = location.city + ", " + location.region;
//       this.queryPets(this.petRequest);
//     }, e => { console.log(e) }
//   )
// }