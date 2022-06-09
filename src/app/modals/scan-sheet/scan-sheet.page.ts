import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-scan-sheet',
  templateUrl: './scan-sheet.page.html',
  styleUrls: ['./scan-sheet.page.scss'],
})
export class ScanSheetPage implements OnInit {

  items = [
    {
      text: 'Scan QR Code',
      icon: 'qr-code-outline',
    },
    {
      text: 'Facial Recognition',
      icon: 'scan-outline',
    },
  ];

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
