/* eslint-disable @typescript-eslint/no-shadow */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { Storage } from '@ionic/storage-angular';

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
    private alertController: AlertController,
    private storage: Storage,
  ) {
    this.storage.create();
  }

  ngOnInit() {

  }

  async loginUser() {
    const loading = await this.loadingController.create({
      spinner: 'dots',
      message: 'Checking librarian credentials',
    });

    loading.present();

    const formData = this.loginForm.value;

    let testConnection = this.dataService.testConnection()
      .subscribe(async res => {
        testConnection.unsubscribe();

        if (res.length <= 0) {
          const alert = await this.alertController.create({
            subHeader: 'Internet Connection',
            message: 'Please check your internet connection',
            backdropDismiss: false,
            buttons: [{
              text: 'Ok',
              handler: () => {
                alert.dismiss();
              }
            }],
          });
          alert.present();
          return;
        }

        let getLibrarian = this.dataService.getLibrarian()
          .subscribe(async res => {
            getLibrarian.unsubscribe();

            const result = res.filter((user) => user.username === formData.user && user.password === formData.password);

            if (!(result.length > 0)) {
              const alert = await this.alertController.create({
                subHeader: 'Authetication Failed',
                message: 'Wrong credentials. Please try again.',
                backdropDismiss: false,
                buttons: [{
                  text: 'Ok',
                  handler: () => {
                    alert.dismiss();
                  }
                }],
              });
              alert.present();
              return;
            }
            this.storage.set('user', result[0]);
            console.log(result);
            this.router.navigate(['home']);
          });
      });

    loading.dismiss();
  }

}
