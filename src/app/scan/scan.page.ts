/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import * as faceapi from '@vladmandic/face-api/dist/face-api.esm.js';
// import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {

  @ViewChild('fileButton', { static: false }) fileButton;

  private labeledFaceDescriptors;
  private faceMatcher;
  private image;
  private canvas;

  constructor(
    private modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    private alertCtrl: AlertController,
    private androidPermissions: AndroidPermissions,
    private alertController: AlertController,
    private webview: WebView,
    private router: Router,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private dataService: DataService,
  ) { }

  async ngOnInit() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/face-api/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/face-api/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/face-api/models');

    this.labeledFaceDescriptors = await this.loadLabeledImages();
    this.faceMatcher = new faceapi.FaceMatcher(this.labeledFaceDescriptors, 0.6);
  }


  scanQr() {
    this.barcodeScanner.scan({
      formats: 'QR_CODE',
      prompt: 'Scan book QR code',
      resultDisplayDuration: 0,
      showTorchButton: true
    }).then(async barcodeData => {

      const id = barcodeData.text;

      if (id != "") {

        let getBooksById = this.dataService.getBooksById(id).
          subscribe(async book => {
            getBooksById.unsubscribe();

            if (book === undefined) {
              const alert = await this.alertCtrl.create({
                subHeader: 'Book QR Scan',
                message: "Book QR Code not found in the database",
                backdropDismiss: false,
                buttons: [{
                  text: 'Ok',
                  handler: () => {
                    alert.dismiss();
                  }
                }]
              });

              alert.present();
              return;
            }

            this.router.navigate(['book-details/' + id]);
          });
      }
    }).catch(async err => {
      const alert = await this.alertCtrl.create({
        subHeader: 'Error',
        message: err,
        backdropDismiss: false,
        buttons: [{
          text: 'Ok',
          handler: () => {
            alert.dismiss();
          }
        }]
      });
      alert.present();
    });
  }

  openGallery() {
    this.fileButton.nativeElement.click();
    console.log('open gallery');
  }

  async openCamera() {
    const loading = await this.loadingController.create({
      spinner: 'dots',
      message: 'Opening Camera',
    });

    loading.present();

    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });

      // const savedImageFile = await this.savePicture(capturedPhoto);

      // Add new photo to Photos array
      // this.photos.unshift(savedImageFile);

      // // Cache all photo data for future retrieval
      // Storage.set({
      //   key: this.PHOTO_STORAGE,
      //   value: JSON.stringify(this.photos),
      // });
    } catch (error) {
      console.log(error);
      loading.dismiss();
    }
  }

  async scanFace(event) {
    console.log('scanning');
    const loading = await this.loadingController.create({
      spinner: 'dots',
      message: 'Scanning Image',
    });

    loading.present();

    try {

      if (this.image) { this.image.remove(); }
      if (this.canvas) { this.canvas.remove(); }

      this.image = await faceapi.bufferToImage(event.target.files[0]);
      this.canvas = faceapi.createCanvasFromMedia(this.image);
      const displaySize = { width: this.image.width, height: this.image.height };

      faceapi.matchDimensions(this.canvas, displaySize);

      const detections = await faceapi
        .detectAllFaces(this.image)
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const results = resizedDetections.map((d) =>
        this.faceMatcher.findBestMatch(d.descriptor)
      );

      let known = true;
      let label = '';

      if (results.length > 0) {

        results.forEach(async res => {
          label = res['_label'];

          if (res['_label'] === 'unknown') {
            known = false;
          }
        });

        if (known) {

          const alert = await this.alertCtrl.create({
            subHeader: '',
            message: label,
            backdropDismiss: false,
            buttons: [{
              text: 'Ok',
              handler: () => {
                alert.dismiss();
              }
            }]
          });

          alert.present();
          return true;

        } else {

          const alert = await this.alertCtrl.create({
            subHeader: '',
            message: 'No person found on database.',
            backdropDismiss: false,
            buttons: [{
              text: 'Ok',
              handler: () => {
                alert.dismiss();
              }
            }]
          });

          alert.present();
          return true;
        }
      }

    } catch (error) {
      const alert = await this.alertCtrl.create({
        subHeader: 'Error',
        message: error,
        backdropDismiss: false,
        buttons: [{
          text: 'Ok',
          handler: () => {
            alert.dismiss();
          }
        }]
      });

      alert.present();
    } finally {
      loading.dismiss();
    }
  }

  loadLabeledImages() {
    const labels = ['Ying Pallo Andoy', 'Hany Liza Azures'];

    return Promise.all(
      labels.map(async (label) => {

        const descriptions = [];
        const img = await faceapi.fetchImage(`/assets/face-api/persons/${label}.jpg`);

        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();

        descriptions.push(detections.descriptor);

        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  }
}
