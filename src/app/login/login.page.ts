import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm = new FormGroup({
    user: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private dataService: DataService,
  ) { }

  ngOnInit() {

  }

  async loginUser() {
    const loading = await this.loadingController.create({
      spinner: 'dots',
      message: 'Checking librarian credentials',
    });

    loading.present();

    const formData = this.loginForm.value;

    this.dataService.getUsers().subscribe(res => {
      const result = res.filter((user) => user.user === formData.user && user.password === formData.password);
      if (result.length > 0) {
        this.router.navigate(['home']);
      } else {
        console.log('wrong');
      }
    });

    loading.dismiss();
  }

}
