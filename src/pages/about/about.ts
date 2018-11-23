import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
  ) {

  }

  ngOnInit() {
    this.storage.get('favoritePets').then((val) => {
      console.log(val);
    });
  }

}
