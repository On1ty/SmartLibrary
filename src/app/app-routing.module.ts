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
  {
    path: 'add-book',
    loadChildren: () => import('./add-book/add-book.module').then( m => m.AddBookPageModule)
  },
  {
    path: 'book-details/:id',
    loadChildren: () => import('./book-details/book-details.module').then( m => m.BookDetailsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'borrower-details/:id',
    loadChildren: () => import('./borrower-details/borrower-details.module').then( m => m.BorrowerDetailsPageModule)
  },
  {
    path: 'borrowers/:action/:bookid',
    loadChildren: () => import('./borrowers/borrowers.module').then( m => m.BorrowersPageModule)
  },
  {
    path: 'books/:action/:borrowerid',
    loadChildren: () => import('./books/books.module').then( m => m.BooksPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
