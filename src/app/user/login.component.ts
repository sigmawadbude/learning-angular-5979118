import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChildren,
} from '@angular/core';
import {
  FormControl,
  FormControlName,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { GenericValidator } from '../shared/generic-validator';
import { Observable, fromEvent, merge, debounceTime, Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class LoginComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  errorMessage = signal('');
  pageTitle = signal('Log In');
  authService = inject(AuthService);
  router = inject(Router);
  loginForm!: FormGroup;

  private validationSub!: Subscription;
  displayMessage = signal<{ [key: string]: string }>({});

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  readonly vm = computed(() => ({
    pageTitle: this.pageTitle(),
    errorMessage: this.errorMessage(),
    displayMessage: this.displayMessage(),
  }));

  constructor() {
    this.validationMessages = {
      username: {
        required: 'Username is required.',
        minlength: 'Username must be at least 3 characters long.',
        maxlength: 'Username cannot be longer than 20 characters.',
      },
      password: {
        required: 'Password is required.',
        minlength: 'Password must be at least 6 characters long.',
        maxlength: 'Password cannot be longer than 20 characters.',
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    this.validationSub = merge(this.loginForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(800))
      .subscribe(() => {
        this.displayMessage.set(
          this.genericValidator.processMessages(this.loginForm)
        );
      });
  }

  login(): void {
    if (this.loginForm.valid) {
      const userName = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      this.authService.login(userName, password);

      // Navigate to the Product List page after log in.
      this.router.navigate(['/products']);
    } else {
      this.errorMessage.set('Please enter a user name and password.');
    }
  }
}
