import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { Storage } from "@ionic/storage-angular";
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.page.html',
  styleUrls: ['./add-book.page.scss'],
})
export class AddBookPage implements OnInit {

  addBookForm = new FormGroup({
    title: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    genre: new FormControl('', Validators.required),
    shelf_no: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
  });

  private user: any;

  constructor(
    private alertController: AlertController,
    private storage: Storage,
    private dataService: DataService,
    private router: Router,
  ) {
    this.storage.create();
  }

  ngOnInit() {
    this.storage.get('user').then(res => this.user = res)
  }

  async addBook() {
    if (!this.addBookForm.valid) {
      let alert = await this.alertController.create({
        subHeader: "Add Book Form",
        message: "Please fill up all required fields",
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

    const formData = this.addBookForm.value;
    const addBookObj = [formData].map(obj => ({
      added_by: this.user.name,
      author: obj.author,
      borrower: '',
      date_added: this.dataService.getCurrentDate(),
      description: obj.description,
      genre: obj.genre,
      id: '',
      img_64: this.dataService.getAltBookImage(),
      shelf_no: obj.shelf_no,
      status: 'available',
      title: obj.title,
    }));

    console.log(addBookObj[0]);
    const result = this.dataService.addBook(addBookObj[0]);
    let message = "";

    if (result) {
      message = "Successfully added book"
      this.router.navigate(['tabs/books']);
    } else {
      message = "There was a problem while adding book. Please try again."
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
