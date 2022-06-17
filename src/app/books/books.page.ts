import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})

export class BooksPage implements OnInit {

  books: any = [];
  action: any;

  constructor(
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.dataService.getBooks().subscribe(res => {
      this.books = res;
      console.log(res);
    });
  }

  async deleteBook(id) {
    const confirm = await this.alertController.create({
      subHeader: 'Delete Confirmation',
      message: 'Are you sure you want to delete the book?',
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

            this.dataService.deleteBook(id)
              .then(async () => {
                const alert = await this.alertController.create({
                  subHeader: 'Message',
                  message: 'Successfully deleted book',
                  backdropDismiss: false,
                  buttons: [{
                    text: 'Ok',
                    handler: () => {
                      alert.dismiss();
                    }
                  }],
                });
                alert.present();
                loading.dismiss();
              })
              .catch(async error => {
                const alert = await this.alertController.create({
                  subHeader: 'Message',
                  message: error,
                  backdropDismiss: false,
                  buttons: [{
                    text: 'Ok',
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
    confirm.present();
  }

  searchBook(event) {
    const query = event.target.value.toLowerCase();
    const items = Array.from(document.querySelector('#bookList').children);

    requestAnimationFrame(() => {
      items.forEach((item) => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item['style'].display = shouldShow ? 'block' : 'none';
      });
    });
  }

  navToAddBook() {
    this.router.navigate(['add-book']);
  }

  async bookDetails(id) {
    this.router.navigate(['book-details/' + id]);
  }
}
