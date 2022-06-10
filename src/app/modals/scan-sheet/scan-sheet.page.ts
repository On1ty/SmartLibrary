import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@Component({
  selector: 'app-scan-sheet',
  templateUrl: './scan-sheet.page.html',
  styleUrls: ['./scan-sheet.page.scss'],
})
export class ScanSheetPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  scanQr() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
    }).catch(async err => {

      let alert = await this.alertCtrl.create({
        subHeader: "Error",
        message: err,
        backdropDismiss: false,
        buttons: [{
          text: 'Ok',
          handler: () => {
            alert.dismiss();
          }
        }]
      })

      alert.present();
    });
  }

}
