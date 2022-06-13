import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
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
    middle: new FormControl('', Validators.required),
    last: new FormControl('', Validators.required),
  });

  regLibrarianForm = new FormGroup({
    first: new FormControl('', Validators.required),
    middle: new FormControl('', Validators.required),
    last: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  selectedSegment: string = 'borrower';
  user: any;

  constructor(
    private alertController: AlertController,
    private dataService: DataService,
    private storage: Storage,
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

    const formData = this.regBorrowerForm.value;
    const borrowerObj = [formData].map(obj => ({
      first: obj.first,
      middle: obj.middle,
      last: obj.last,
      reg_by: this.user.name,
      reg_date: this.dataService.getCurrentDate(),
    }));

    console.log(borrowerObj[0]);
    const result = this.dataService.addBorrower(borrowerObj[0]);
    let message = "";

    if (result) {
      message = "Successfully added borrower"
      this.regBorrowerForm.reset();
      // this.router.navigate(['tabs/books']);
    } else {
      message = "There was a problem while adding borrower. Please try again."
    }

    let alert = await this.alertController.create({
      subHeader: "Message",
      message: message,
      backdropDismiss: false,
      buttons: [{
        text: "Ok",
        handler: () => {
          alert.dismiss();
        }
      }],
    });
    alert.present();
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

    const formData = this.regLibrarianForm.value;
    const librarianObj = [formData].map(obj => ({
      name: `${obj.first} ${obj.middle} ${obj.last}`,
      user: obj.username,
      password: obj.password,
    }));

    console.log(librarianObj[0]);
    const resultLibrarian = this.dataService.addLibrarian(librarianObj[0]);

    let message = "";

    if (resultLibrarian) {
      message = "Successfully added librarian"
      this.regLibrarianForm.reset();
      // this.router.navigate(['tabs/books']);
    } else {
      message = "There was a problem while adding librarian. Please try again."
    }

    let alert = await this.alertController.create({
      subHeader: "Message",
      message: message,
      backdropDismiss: false,
      buttons: [{
        text: "Ok",
        handler: () => {
          alert.dismiss();
        }
      }],
    });
    alert.present();
  }
}
