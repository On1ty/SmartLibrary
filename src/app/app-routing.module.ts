import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    redirectTo: 'tabs/home',
  },
  // {
  //   path: 'books',
  //   loadChildren: () => import('./books/books.module').then( m => m.BooksPageModule)
  // },
  {
    path: 'add-book',
    loadChildren: () => import('./add-book/add-book.module').then( m => m.AddBookPageModule)
  },
  {
    path: 'book-details/:id',
    loadChildren: () => import('./book-details/book-details.module').then( m => m.BookDetailsPageModule)
  },  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then( m => m.ReportsPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
