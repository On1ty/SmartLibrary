import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule, provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    ReactiveFormsModule,
    FormsModule,
    IonicStorageModule.forRoot(),
    NgxQRCodeModule,
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    BarcodeScanner,
    AndroidPermissions,
    WebView,
    Base64ToGallery,
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
