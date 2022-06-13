import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './../services/data.service';

@Component({
  selector: 'app-borrowers',
  templateUrl: './borrowers.page.html',
  styleUrls: ['./borrowers.page.scss'],
})
export class BorrowersPage implements OnInit {

  borrowers: any = [];

  constructor(
    private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.dataService.getBorrowers().subscribe(res => {
      this.borrowers = res;
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

}
