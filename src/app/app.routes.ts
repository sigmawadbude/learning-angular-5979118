import { Routes } from '@angular/router';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { PageNotFoundComponent } from './home/page-not-found/page-not-found.component';
import { ProductListComponent } from './products/product-list/product-list.component';

export const routes: Routes = [
    { path: 'products', component: ProductListComponent},
    { path: 'welcome', component: WelcomeComponent },
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }

];
