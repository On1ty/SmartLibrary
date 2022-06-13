import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from "@ionic/storage-angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private router: Router,
    private alertController: AlertController,
    private storage: Storage,
    private loadingController: LoadingController,
  ) {
    this.storage.create();
  }

  ngOnInit() {
  }

  async logout() {
    let alert = await this.alertController.create({
      subHeader: "Confirmation",
      message: "Are you sure you want to logout?",
      backdropDismiss: false,
      buttons: [
        {
          text: "Cancel"
        },
        {
          text: "Yes",
          handler: async () => {
            alert.dismiss();

            const loading = await this.loadingController.create({
              spinner: 'dots',
              message: 'Logging out',
            });

            loading.present();

            this.storage.remove('user').then(res => {
              loading.dismiss();
              this.router.navigate(['login']);
            });
          }
        }]
    });
    alert.present();
  }
}
