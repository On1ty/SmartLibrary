import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  reports: any = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.dataService.getDueDate()
      .subscribe(due => {
        this.dataService.getReports()
          .subscribe(res => {
            this.reports = res.map((obj) => ({
              action: obj.action,
              book: obj.book,
              borrower: obj.borrower,
              date_report: obj.date_report,
              status: obj.status,
              due_date: this.dataService.computeDueDate(obj.date_report, due[0].days),
            }));
            console.log(this.reports);
          });
      });
  }

  searchReports(event) {
    const query = event.target.value.toLowerCase();
    const items = Array.from(document.querySelector('#reportsList').children);

    requestAnimationFrame(() => {
      items.forEach((item) => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item['style'].display = shouldShow ? 'block' : 'none';
      });
    });
  }
}
