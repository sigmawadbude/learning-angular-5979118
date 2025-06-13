import { Routes } from '@angular/router';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { PageNotFoundComponent } from './home/page-not-found/page-not-found.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { LoginComponent } from './user/login.component';
import { ProductShellComponent } from './products/product-shell.component';
import { ProductResolver } from './services/product-resolver.service';

export const routes: Routes = [
  { path: 'products', component: ProductShellComponent },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    resolve: {
     resolvedData: ProductResolver,
    },
  },
  {
    path: 'products/:id/edit',
    //canDeactivate: [ProductEditGuard],
    component: ProductEditComponent,
  },
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
