import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { concat } from 'rxjs';
import { DataService } from './../services/data.service';

@Component({
  selector: 'app-borrowers',
  templateUrl: './borrowers.page.html',
  styleUrls: ['./borrowers.page.scss'],
})
export class BorrowersPage implements OnInit {

  data: any = [];
  action: any;
  bookid: any;
  book: any = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
    this.bookid = this.activatedRoute.snapshot.paramMap.get('bookid');

    console.log(this.action + "zzz");
    this.dataService.getBorrowers().subscribe(res => {
      this.data = res;
      console.log(res);
    });
  }

  searchBorrowers(event) {
    const query = event.target.value.toLowerCase();
    const items = Array.from(document.querySelector('#borrowersList').children);

    requestAnimationFrame(() => {
      items.forEach((item) => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item['style'].display = shouldShow ? 'block' : 'none';
      });
    });
  }

  navToReg() {
    this.router.navigate(['register']);
  }

  async details(id) {
    this.router.navigate(['borrower-details/' + id]);
  }

  async delete(id) {
    const confirm = await this.alertController.create({
      subHeader: 'Delete Confirmation',
      message: 'Are you sure you want to delete?',
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

            this.dataService.deleteBorrower(id)
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
              .catch(async (error) => {
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

  async borrow(borrower) {
    const snap = this.dataService.getBooksById(this.bookid)
    console.log(snap);
    const alert = await this.alertController.create({
      subHeader: 'Confirmation',
      message: `Are you sure you to borrow "${this.book.title}"?`,
      backdropDismiss: false,
      buttons: [{
        text: 'Cancel',
      }, {
        text: 'Yes',
        handler: async () => {
          const full = this.book.borrower.length == this.book.count;

          // const borrow_book = {
          //   id: this.book.id,
          //   borrower:  ,
          //   status: full ? 'unavailable' : 'available',
          // }

          console.log([`${borrower.first} ${borrower.last}`].push(this.book));

          // this.dataService.updateBookBorrower(borrow_book)
          //   .then(() => {
          //     console.log(this.bookid);
          //     console.log(borrower);

          //     // const alert = await this.alertController.create({
          //     //   subHeader: 'Message',
          //     //   message: 'Successfully Borrowed',
          //     //   backdropDismiss: false,
          //     //   buttons: [{
          //     //     text: 'Ok',
          //     //     handler: () => {
          //     //     }
          //     //   }],
          //     // });
          //     // alert.present();

          //     // this.router.navigate(['tabs/books']);
          //   })
          //   .catch(async (error) => {
          //     let alert = await this.alertController.create({
          //       subHeader: "Message",
          //       message: error,
          //       backdropDismiss: false,
          //       buttons: [{
          //         text: "Ok",
          //         handler: () => {
          //           alert.dismiss();
          //         }
          //       }],
          //     });
          //     alert.present();
          //   });
        }
      }],
    });
    alert.present();
  }
}
