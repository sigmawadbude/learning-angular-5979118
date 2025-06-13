import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './user/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  template: `
    <nav class="navbar navbar-expand navbar-light bg-light">
      <a class="navbar-brand">Hello, {{ pageTitle }}</a>
      <ul class="navbar-nav">
        <li class="nav-item">
          <a
            class="nav-link"
            routerLinkActive="active"
            [routerLink]="['/welcome']"
            >Home</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            [routerLink]="['/products']"
            >Product List</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            [routerLink]="['/products/0/edit']"
            >Add Product</a
          >
        </li>
      </ul>
      <ul class="navbar-nav ms-auto">
        @if(isLoggedIn()){
        <li class="nav-item">
          <a class="nav-link">Welcome {{ userName() }}</a>
        </li>
        }
        <li class="nav-item">
          <a class="nav-link">Show Messages</a>
        </li>
        @if(!isLoggedIn()){
        <li class="nav-item">
          <a class="nav-link" routerLink="/login">Log In</a>
        </li>
        } @if(isLoggedIn()){
        <li class="nav-item">
          <a class="nav-link" (click)="logOut()">Log Out</a>
        </li>
        }
      </ul>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  pageTitle = 'Taksh';

  // Use computed signals for reactive values
  readonly isLoggedIn = computed(() => this.authService.isLoggedIn());
  readonly userName = computed(
    () => this.authService.currentUser()?.userName ?? ''
  );
  router = inject(Router);
  authService = inject(AuthService);

  logOut(): void {
    this.authService.logout();
    console.log('Log out');
    this.router.navigateByUrl('/welcome');
  }
}
