import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Reports', url: '/folder/Outbox', icon: 'receipt-outline' },
  ];

  constructor(
    private router: Router,
  ) {}

  logout() {
    this.router.navigate(['login']);
  }
}
