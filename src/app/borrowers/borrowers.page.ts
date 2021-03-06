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

    console.log(this.action);
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
    if (borrower.borrowed_books.length == 3) {
      let alert = await this.alertController.create({
        subHeader: "Message",
        message: "He/She will exceed to maximum book borrowed",
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

    let getBooksById = this.dataService.getBooksById(this.bookid)
      .subscribe(async (res) => {
        getBooksById.unsubscribe();

        const already = res.borrower.find(elem => elem.id === borrower.id)

        if (already !== undefined) {
          let alert = await this.alertController.create({
            subHeader: "Message",
            message: `He/She already borrowed this book [${res.title}]`,
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

        const alert = await this.alertController.create({
          subHeader: 'Confirmation',
          message: `Are you sure you to borrow "${res.title}"?`,
          backdropDismiss: false,
          buttons: [{
            text: 'Cancel',
          }, {
            text: 'Yes',
            handler: async () => {
              const full = Math.abs(res.borrower.length - res.count) == 1;

              //for Books Collection
              const borrower_map = {
                id: borrower.id,
                name: `${borrower.first} ${borrower.last}`,
                date_borrowed: this.dataService.getCurrentDate(),
                status: '',
              };

              //for Borrowers Collection
              const borrowed_map = {
                id: res.id,
                title: res.title,
                date_borrowed: this.dataService.getCurrentDate(),
                status: '',
              };

              res.borrower.push(borrower_map);
              borrower.borrowed_books.push(borrowed_map);

              const borrow_book = {
                id: res.id,
                borrower: res.borrower,
                // status: full ? 'unavailable' : 'available',
              }

              const borrower_update = {
                id: borrower.id,
                borrowed_books: borrower.borrowed_books,
              }

              const report = {
                action: 'borrow',
                book: res.title,
                borrower: `${borrower.first} ${borrower.last}`,
                date_report: this.dataService.getCurrentDate(),
                status: 'success',
              }

              this.dataService.addReport(report)
                .then(() => {
                  this.dataService.updateBorrowersBorrowedBooks(borrower_update)
                    .then(() => {
                      this.dataService.updateBookBorrower(borrow_book)
                        .then(async () => {
                          const alert = await this.alertController.create({
                            subHeader: 'Message',
                            message: 'Successfully borrow book',
                            backdropDismiss: false,
                            buttons: [{
                              text: 'Ok',
                              handler: () => {
                                alert.dismiss();
                                this.router.navigate(['tabs/books']);
                              }
                            }],
                          });
                          alert.present();
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
                        });
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
                    });
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
                })
            }
          }],
        });
        alert.present();
      })
  }
}
