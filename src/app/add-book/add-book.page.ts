import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
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
    file_pic: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    genre: new FormControl('', Validators.required),
    shelf_no: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    book_count: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
  });

  @ViewChild('file', { static: false }) file;

  private user: any;
  src: any;

  constructor(
    private storage: Storage,
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.storage.create();
  }

  async ngOnInit() {
    // this.storage.get('user')
    //   .then(res => this.user = res)

    this.user = await this.storage.get('user');
    console.log(this.user);
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

    const loading = await this.loadingController.create({
      spinner: 'dots',
      message: 'Adding book',
    });

    loading.present();

    const formData = this.addBookForm.value;

    const addBookObj = [formData].map(obj => ({
      added_by: `${this.user.first} ${this.user.last}`,
      author: obj.author,
      borrower: [],
      date_added: this.dataService.getCurrentDate(),
      description: obj.description,
      genre: obj.genre,
      id: '',
      img_64: this.src,
      shelf_no: obj.shelf_no,
      status: 'available',
      title: obj.title,
      count: obj.book_count,
    }));

    console.log(addBookObj[0]);
    this.dataService.addBook(addBookObj[0])
      .then(async () => {
        let alert = await this.alertController.create({
          subHeader: "Message",
          message: "Successfully added book",
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
        this.addBookForm.reset();
        this.src = null;
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
}
