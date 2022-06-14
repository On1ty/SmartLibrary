import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DataService } from './../services/data.service';

@Component({
  selector: 'app-borrowers',
  templateUrl: './borrowers.page.html',
  styleUrls: ['./borrowers.page.scss'],
})
export class BorrowersPage implements OnInit {

  data: any = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.dataService.getBorrowers().subscribe(res => {
      this.data = res;
      console.log(res);
    });
  }

  searchBorrowers(event) {
    const query = event.target.value.toLowerCase();
    const items = Array.from(document.querySelector('#borrowersList').children);

    requestAnimationFrame(() => {
      items.forEach((item) => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item['style'].display = shouldShow ? 'block' : 'none';
      });
    });
  }

  navToReg() {
    this.router.navigate(['register']);
  }

  async details(id) {
    console.log(id);
    // this.router.navigate(['book-details/' + id]);
  }

  async delete(id) {
    const confirm = await this.alertController.create({
      subHeader: 'Delete Confirmation',
      message: 'Are you sure you want to delete?',
      backdropDismiss: false,
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Ok',
          handler: async () => {

            const loading = await this.loadingController.create({
              spinner: 'dots',
              message: 'Deleting book',
            });

            loading.present();

            const result = this.dataService.deleteBorrower(id);

            let message = '';

            loading.dismiss();

            if (result) {
              message = 'Successfully deleted book';
            } else {
              message = 'There was a problem while deleting book. Please try again.';
            }

            const alert = await this.alertController.create({
              subHeader: 'Message',
              message,
              backdropDismiss: false,
              buttons: [{
                text: 'Ok',
                handler: () => {
                  alert.dismiss();
                }
              }],
            });
            alert.present();
          }
        }],
    });
    confirm.present();
  }
}
