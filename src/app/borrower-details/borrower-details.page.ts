import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-borrower-details',
  templateUrl: './borrower-details.page.html',
  styleUrls: ['./borrower-details.page.scss'],
})
export class BorrowerDetailsPage implements OnInit {

  id: any;
  borrower: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.dataService.getBorrowersById(id)
      .subscribe(res => {
        if (res !== undefined) {
          this.id = id;
          this.borrower = res;
          console.log(this.borrower);
        }
      });
  }

  async returnBook() {
    if (this.borrower.borrowed_books.length <= 0) {
      let alert = await this.alertController.create({
        subHeader: "Message",
        message: "He/She does not borrowed any books",
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

    this.router.navigate(['books/return/' + this.id]);
  }

}
