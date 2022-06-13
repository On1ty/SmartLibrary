import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { ToastController } from '@ionic/angular';
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
        alert('success');
        let toast = await this.toastCtrl.create({
          header: 'QR Code save in your gallery'
        });
        toast.present();
      }, err => {
        alert(err);
        console.log(err);
      });
  }
}
