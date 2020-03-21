import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PetSearchPage } from '../pages/pet-search/pet-search';
import { AuthenticationService } from '../services/authentication.service';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = PetSearchPage;

    constructor(
        platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        private authenticationService: AuthenticationService,
    ) {
        platform.ready().then(() => {
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
}
