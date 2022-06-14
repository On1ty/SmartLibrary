import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  total_books: any = 0;
  total_borrowers: any = 0;
  total_borrowed: any = 0;
  total_lost: any = 0;

  image = null;
  cameraActive = false;

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.getBooks().subscribe((res) => {
      this.total_books = res.length;
    });

    this.dataService.getBorrowers().subscribe((res) => {
      this.total_borrowers = res.length;
    });

    this.dataService.getBooks().subscribe((res) => {

      let borrowed = res.filter((obj) => {
        return obj.status == 'borrowed' && obj.borrower != '';
      });

      this.total_borrowed = borrowed.length;
    });

    this.dataService.getBooks().subscribe((res) => {

      let lost = res.filter((obj) => {
        return obj.status == 'lost';
      });

      this.total_lost = lost.length;
    });
  }

  openCamera() {
  }
}
