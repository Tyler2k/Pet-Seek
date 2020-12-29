import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';

import { FavoritePetsPage } from '../pages/favorite-pets/favorite-pets';
import { PetSearchPage } from '../pages/pet-search/pet-search';
import { PetListPage } from '../pages/pet-list/pet-list';
import { BreedSearchPage } from '../pages/breed-search/breed-search';
import { PetDetailPage } from '../pages/pet-detail/pet-detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LocationService } from '../services/location.service';
import { PetFinderService } from '../services/pet-finder.service';
import { FilterService } from '../services/filter.service';
import { FavoritesService } from '../services/favorites.service';
import { ServerStateService } from '../services/server-state.service';
import { AuthenticationService } from '../services/authentication.service';

@NgModule({
  declarations: [
    MyApp,
    FavoritePetsPage,
    PetSearchPage,
    BreedSearchPage,
    PetListPage,
    PetDetailPage
  ],
  imports: [
    HttpClientModule,
    BrowserTransferStateModule,
    HttpClientJsonpModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot({name: '__fpdb'}),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FavoritePetsPage,
    PetSearchPage,
    BreedSearchPage,
    PetListPage,
    PetDetailPage
  ],
  providers: [
    AuthenticationService,
    PetFinderService,
    LocationService,
    StatusBar,
    SplashScreen,
    FilterService,
    ServerStateService,
    FavoritesService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
