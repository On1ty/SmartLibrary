import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { DataService } from './../services/data.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.page.html',
  styleUrls: ['./book-details.page.scss'],
})
export class BookDetailsPage implements OnInit {

  elementType: any;
  errorCorrectionLevel: any;
  id: any;
  book: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private base64ToGallery: Base64ToGallery,
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.dataService.getBooksById(id)
      .subscribe(res => {
        if (res !== undefined) {
          this.id = id;
          this.elementType = NgxQrcodeElementTypes.CANVAS;
          this.errorCorrectionLevel = NgxQrcodeElementTypes.CANVAS;
          this.book = res;
        }
      });
  }

  downloadQR() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const imageData = canvas.toDataURL('image/jpeg').toString();

    let data = imageData.split(',')[1];
    this.base64ToGallery.base64ToGallery(data,
      {
        prefix: '',
        mediaScanner: true
      })
      .then(async res => {
        let toast = await this.toastCtrl.create({
          message: 'QR Code save in your gallery',
          duration: 2000,
        });
        toast.present();
      }, err => {
        console.log(err);
      });
  }

  async updateStatus() {
    let alert = await this.alertController.create({
      subHeader: "Confirmation",
      message: "Are you sure you want to change the book status?",
      backdropDismiss: false,
      buttons: [
        { text: 'Cancel' }, {
          text: "Yes",
          handler: async () => {
            const loading = await this.loadingController.create({
              spinner: 'dots',
              message: 'Updating book status',
            });

            loading.present();

            const book = {
              id: this.id,
              status: this.book.status == 'lost' ? 'available' : 'lost',
            }

            this.dataService.updateBook(book)
              .then(async () => {
                let alert = await this.alertController.create({
                  subHeader: "Message",
                  message: "Book status updated",
                  backdropDismiss: false,
                  buttons: [{
                    text: "Ok",
                    handler: () => {
                      alert.dismiss();
                      this.router.navigate(['tabs/books']);
                    }
                  }],
                });

                alert.present();
                loading.dismiss();
              })
              .catch(async (error) => {
                let alert = await this.alertController.create({
                  subHeader: "Message",
                  message: error,
                  backdropDismiss: false,
                  buttons: [{
                    text: "Ok",
                    handler: () => {
                      alert.dismiss();
                    }
                  }],
                });
                alert.present();
                loading.dismiss();
              });
          }
        }],
    });
    alert.present();
  }
}
