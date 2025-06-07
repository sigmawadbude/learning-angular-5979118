import { Routes } from '@angular/router';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { PageNotFoundComponent } from './home/page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: 'welcome', component: WelcomeComponent },
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }

];
