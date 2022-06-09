import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanSheetPage } from './scan-sheet.page';

const routes: Routes = [
  {
    path: '',
    component: ScanSheetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanSheetPageRoutingModule {}
