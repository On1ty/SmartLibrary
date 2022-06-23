import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  async scan() {
    // const modal = await this.modalCtrl.create({
    //   component: ScanSheetPage,
    //   initialBreakpoint: 0.3,
    //   handle: false,
    // });

    // await modal.present();
  }
}
