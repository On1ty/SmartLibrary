import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from "@ionic/storage-angular";

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})
export class BooksPage implements OnInit {

  books: any = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.dataService.getBooks().subscribe(res => {
      this.books = res;
      console.log(res);
    });
  }

  deleteBook() {

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
}
