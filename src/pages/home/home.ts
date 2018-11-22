import { Component, OnInit, trigger, state, style, animate, transition, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, ModalController, NavParams, Platform, ViewController } from 'ionic-angular';
import { LocationService } from '../../services/location.service';
import { PetFinderService } from '../../services/pet-finder.service';
import { PetModel, PetQueryRequest } from '../../models/pets.model';
import { BreedSearchPage } from '../partials/breed-search/breed-search';
import { FilterService } from '../../services/filter.service';
import { PetPage } from '../pets/pets';

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
  ) {
    this.filters = this.filterService.getFilters();
    this.breedFilter = this.filters.find(obj => obj.id == 'breed');

    this.autocomplete = { input: '' };
    this.locationPredictions = [];
  }

  pets: PetModel[];
  breedFilter;
  petRequest: PetQueryRequest = new PetQueryRequest();
  loading: boolean = true;
  loadingText = 'Finding Pets Near You';
  breeds;
  filters;
  autocomplete;
  locationPredictions;

  ngOnInit() {
    this.locationService.getGeneralLocationFromIp().subscribe(r => {
      console.log(r)
    })
  }

  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.locationPredictions = [];
    } else {
      this.locationService.getPlacePredictions(this.autocomplete.input).then(r => {
        this.locationPredictions = r;
      });
    }
  }

  onClearLocation() {
    this.petRequest.location = null;
  }

  getCurrentLocation() {
    this.locationService.getCurrentLocation().then(location => {
      this.selectLocation(<string>location);
    })
  }

  selectLocation(location: string) {
    this.locationPredictions = [];
    this.autocomplete.input = location;
    this.petRequest.location = location;
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

  toggleGroup(filter) {
    if (filter.id == 'breed') {
      this.presentBreedSearchModal();
    }
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
      selectedItem ? this.breedFilter.currentItem = selectedItem : this.breedFilter.currentItem = 'Any';
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
        this.loading = false;
        this.navCtrl.push(PetPage, {pets: petList.pets});
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