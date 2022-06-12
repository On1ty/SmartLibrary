import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.page.html',
  styleUrls: ['./book-details.page.scss'],
})
export class BookDetailsPage implements OnInit {

  @Input() appId: string;

  book: any = [];

  constructor(
    private dataService: DataService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.dataService.getBooksById(this.appId).subscribe(res => {
      this.book = res;
      console.log(res);
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
