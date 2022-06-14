import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { Storage } from "@ionic/storage-angular";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  regBorrowerForm = new FormGroup({
    first: new FormControl('', Validators.required),
    middle: new FormControl(''),
    last: new FormControl('', Validators.required),
    file_pic: new FormControl('', Validators.required),
  });

  regLibrarianForm = new FormGroup({
    first: new FormControl('', Validators.required),
    middle: new FormControl(''),
    last: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  selectedSegment: string = 'borrower';
  user: any;
  src: any;

  @ViewChild('file', { static: false }) file;

  constructor(
    private alertController: AlertController,
    private dataService: DataService,
    private storage: Storage,
    private loadingController: LoadingController,
  ) {
    this.storage.create();
  }

  ngOnInit() {
    this.storage.get('user').then(res => this.user = res)
  }

  ionViewWillEnter() {

  }

  segmentChange(event) {
    this.selectedSegment = event.target.value;
  }

  openGallery() {
    this.file.nativeElement.click();
  }

  loadImg(event) {
    const files = event.target.files;

    if (files.length == 0) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.src = reader.result;
    }
  }

  async regBorrower() {
    if (!this.regBorrowerForm.valid) {
      let alert = await this.alertController.create({
        subHeader: "Register Borrower",
        message: "Invalid Fields. Please fill it correctly",
        backdropDismiss: false,
        buttons: [{
          text: "Ok",
          handler: () => {
            alert.dismiss();
          }
        }],
      });
      alert.present();
      return;
    }

    const loading = await this.loadingController.create({
      spinner: 'dots',
      message: 'Adding borrower',
    });

    loading.present();

    const formData = this.regBorrowerForm.value;
    const borrowerObj = [formData].map(obj => ({
      first: obj.first,
      middle: obj.middle,
      last: obj.last,
      img_64: this.src,
      reg_by: this.user.name,
      reg_date: this.dataService.getCurrentDate(),
    }));

    console.log(borrowerObj[0]);
    this.dataService.addBorrower(borrowerObj[0])
      .then(async () => {
        let alert = await this.alertController.create({
          subHeader: "Message",
          message: "Successfully added borrower",
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

        this.regBorrowerForm.reset();
        this.src = null;
      }).catch(async (error) => {
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

  async regLibrarian() {
    if (!this.regLibrarianForm.valid) {
      let alert = await this.alertController.create({
        subHeader: "Register Librarian",
        message: "Invalid Fields. Please fill it correctly",
        backdropDismiss: false,
        buttons: [{
          text: "Ok",
          handler: () => {
            alert.dismiss();
          }
        }],
      });
      alert.present();
      return;
    }

    const loading = await this.loadingController.create({
      spinner: 'dots',
      message: 'Adding librarian',
    });

    loading.present();

    const formData = this.regLibrarianForm.value;
    const librarianObj = [formData].map(obj => ({
      name: `${obj.first} ${obj.middle} ${obj.last}`,
      user: obj.username,
      password: obj.password,
    }));

    console.log(librarianObj[0]);
    this.dataService.addLibrarian(librarianObj[0])
      .then(async () => {
        let alert = await this.alertController.create({
          subHeader: "Message",
          message: 'Successfully added librarian',
          backdropDismiss: false,
          buttons: [{
            text: "Ok",
            handler: () => {
              alert.dismiss();
            }
          }],
        });

        loading.dismiss();
        alert.present();
        this.regLibrarianForm.reset();
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

        loading.dismiss();
        alert.present();
      });
  }
}
