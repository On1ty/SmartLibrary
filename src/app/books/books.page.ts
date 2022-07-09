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
  borrowerid: any;

  constructor(
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
    this.borrowerid = this.activatedRoute.snapshot.paramMap.get('borrowerid');

    console.log(this.action);
    console.log(this.borrowerid);

    if (this.action == null || this.action == '') {
      this.dataService.getBooks().subscribe(res => {
        this.books = res;
        console.log(res);
      });
    } else {
      let getBorrowersById = this.dataService.getBorrowersById(this.borrowerid)
        .subscribe(async res => {
          getBorrowersById.unsubscribe();

          //get the borrowers borrowed book only
          let borrowed_books = res.borrowed_books;

          console.log(borrowed_books);

          const books_arr = [];
          for (const book of borrowed_books) {
            let getBooksById = this.dataService.getBooksById(book.id)
              .subscribe(book => {
                getBooksById.unsubscribe();
                books_arr.push(book);
              });
            console.log(books_arr);
          }

          this.books = books_arr;
          console.log(this.books);
        });
    }
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

  async returnBook(book) {
    let getBorrowersById = this.dataService.getBorrowersById(this.borrowerid)
      .subscribe(async (res) => {
        getBorrowersById.unsubscribe();

        let alert = await this.alertController.create({
          subHeader: "Message",
          message: `Are you sure you want to return [${book.title}]?`,
          backdropDismiss: false,
          buttons: [{ text: "Cancel" }, {
            text: "Yes",
            handler: () => {
              console.log(book);
              let getDueDate = this.dataService.getDueDate()
                .subscribe((due) => {
                  getDueDate.unsubscribe();

                  let status;
                  let borrowed_map = [];
                  let borrower_map = [];

                  for (const borrower of book.borrower) {
                    const dueDate = this.dataService.computeDueDate(borrower.date_borrowed, due[0].days);

                    if (this.borrowerid == borrower.id) {
                      if (this.dataService.checkDueDate(dueDate)) {
                        status = 'Due';
                      } else {
                        status = 'On Date';
                      }
                    } else {
                      borrower_map.push(borrower);
                    }
                  }

                  for (const borrowed_books of res.borrowed_books) {
                    if (book.id != borrowed_books.id) {
                      borrowed_map.push(borrowed_books);
                    }
                  }

                  const report = {
                    action: 'return',
                    book: book.title,
                    borrower: `${res.first} ${res.last}`,
                    date_report: this.dataService.getCurrentDate(),
                    status,
                  }

                  const borrowed_update = {
                    id: res.id,
                    borrowed_books: borrowed_map,
                  }

                  const borrower_update = {
                    id: book.id,
                    borrower: borrower_map,
                  }

                  console.log(report);
                  this.dataService.addReport(report)
                    .then(() => {
                      console.log('level 1 - success');
                      this.dataService.updateBorrowersBorrowedBooks(borrowed_update)
                        .then(() => {
                          console.log('level 2 - success');
                          this.dataService.updateBookBorrower(borrower_update)
                            .then(async () => {
                              console.log('level 3 - success');
                              const alert = await this.alertController.create({
                                subHeader: 'Message',
                                message: 'Successfully return book',
                                backdropDismiss: false,
                                buttons: [{
                                  text: 'Ok',
                                  handler: () => {
                                    alert.dismiss();
                                    this.router.navigate(['tabs/borrowers']);
                                  }
                                }],
                              });
                              alert.present();
                            })
                            .catch(async (error) => {
                              console.log('level 3 - failed');
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
                        })
                        .catch(async (error) => {
                          console.log('level 2 - failed');
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
                      console.log('level 1 - failed');
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
                });
            }
          }],
        });
        alert.present();
      });
  }
}
