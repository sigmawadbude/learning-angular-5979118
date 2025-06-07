import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  template: `
  <nav class='navbar navbar-expand navbar-light bg-light'>
      <a class='navbar-brand'>Hello, {{pageTitle}}</a>
      <ul class='navbar-nav'>
        <li class='nav-item'><a class='nav-link' routerLinkActive='active'
              [routerLink]="['/welcome']">Home</a>
        </li>
        <li class='nav-item'><a class='nav-link' routerLinkActive='active' [routerLinkActiveOptions]="{exact: true}"
              [routerLink]="['/products']">Product List</a>
        </li>
        <li class='nav-item'><a class='nav-link' routerLinkActive='active' [routerLinkActiveOptions]="{exact: true}"
              [routerLink]="['/products/0/edit']">Add Product</a>
        </li>
      </ul>
    </nav>
    <div class='container'>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  pageTitle = 'Taksh';
}
