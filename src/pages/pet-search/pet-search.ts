import { Component, trigger, state, style, animate, transition, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { LocationService } from '../../services/location.service';
import { PetFinderService } from '../../services/pet-finder.service';
import { PetModel, PetQueryRequest } from '../../models/pet.model';
import { BreedSearchPage } from '../breed-search/breed-search';
import { FilterService } from '../../services/filter.service';
import { PetListPage } from '../pet-list/pet-list';
import { FavoritePetsPage } from '../favorite-pets/favorite-pets';

declare var google;

@Component({
  selector: 'pet-search',
  templateUrl: 'pet-search.html',
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

export class PetSearchPage {

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

    this.favoritesPage = FavoritePetsPage;
  }

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  pets: PetModel[];
  breedFilter;
  petRequest: PetQueryRequest = new PetQueryRequest();
  loading: boolean = true;
  loadingText = 'Finding Pets Near You';
  breeds;
  filters;
  autocomplete;
  locationPredictions;
  favoritesPage: any;
  geocoder;

  ionViewDidLoad() {
    this.petFinderService.getSinglePet().subscribe(r => {
      console.log(r)
    })
    this.locationService.getGeneralLocationFromIp().subscribe(r => {
      this.petRequest.location = r.cityState;
      this.autocomplete.input = r.cityState;
      this.geocoder = new google.maps.Geocoder();
      this.geocodeAddress(this.geocoder, r.cityState);
      this.loadMap();
    })
  }

  loadMap() {

    let mapOptions = {
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggable: false,
      disableDefaultUI: true,
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  trackByFn(index: any, item: any) {
    return item;
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
    this.geocodeAddress(this.geocoder, location);
  }

  geocodeAddress(geocoder, location) {
    geocoder.geocode({ 'address': location }, ((results, status) => {
      this.map.panTo(results[0].geometry.location);
      if (status === 'OK') {
        this.map.panTo(results[0].geometry.location);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    }));
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
    this.petFinderService.getBreedList(animal, true).subscribe(
      response => {
        this.breeds = response.breeds;
      }
    )
  }

  validateBreedList(filter) {
    return filter.id == 'breed' && !this.petRequest.animal;
  }

  searchPets(petRequest: PetQueryRequest) {
    this.navCtrl.push(PetListPage, { petRequest: petRequest });
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