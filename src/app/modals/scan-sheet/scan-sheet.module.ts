import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanSheetPageRoutingModule } from './scan-sheet-routing.module';

import { ScanSheetPage } from './scan-sheet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanSheetPageRoutingModule
  ],
  declarations: [ScanSheetPage]
})
export class ScanSheetPageModule {}
