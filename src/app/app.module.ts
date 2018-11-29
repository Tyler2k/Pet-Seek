import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';

import { AboutPage } from '../pages/about/about';
import { FavoritePetsPage } from '../pages/favorite-pets/favorite-pets';
import { SearchFiltersPage } from '../pages/search-filters/search-filters';
import { PetListPage } from '../pages/pet-list/pet-list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LocationService } from '../services/location.service';
import { PetFinderService } from '../services/pet-finder.service';
import { BreedSearchPage } from '../pages/partials/breed-search/breed-search';
import { FilterService } from '../services/filter.service';
import { FavoritesService } from '../services/favorites.service';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    FavoritePetsPage,
    SearchFiltersPage,
    BreedSearchPage,
    PetListPage,
  ],
  imports: [
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot({name: '__fpdb'}),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    FavoritePetsPage,
    SearchFiltersPage,
    BreedSearchPage,
    PetListPage
  ],
  providers: [
    PetFinderService,
    LocationService,
    StatusBar,
    SplashScreen,
    FilterService,
    Geolocation,
    FavoritesService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
