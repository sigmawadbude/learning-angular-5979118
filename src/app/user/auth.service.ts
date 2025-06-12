import { inject, Injectable, computed, signal } from '@angular/core';
import { User } from './user';
import { MessageService } from '../shared/message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser = signal<User | undefined>(undefined);

  // Expose currentUser signal publicly (optional)
  readonly currentUser = this._currentUser.asReadonly();

  // Computed signal for login status
  readonly isLoggedIn = computed(() => !!this._currentUser());

  private messageService = inject(MessageService);

  login(userName: string, password: string): void {
    if (!userName || !password) {
      this.messageService.addMessage('Please enter your userName and password');
      return;
    }

    if (userName === 'admin') {
      this._currentUser.set({
        id: 1,
        userName,
        isAdmin: true,
      });
      this.messageService.addMessage('Admin login');
      return;
    }

    this._currentUser.set({
      id: 2,
      userName,
      isAdmin: false,
    });

    this.messageService.addMessage(`User: ${userName} logged in`);
  }

  logout(): void {
    this._currentUser.set(undefined);
  }
}
