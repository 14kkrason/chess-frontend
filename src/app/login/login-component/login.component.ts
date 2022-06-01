import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription, take } from 'rxjs';
import { AuthData } from 'src/app/state/models/auth-data.model';
import { AuthService } from '../../shared/auth.service';
import { logIn, refresh } from '../../state/actions/auth-data.action';
import { LoginErrorComponent } from '../login-error/login-error.component';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  authData$!: Subscription;
  loginForm: FormGroup = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
    ]),
  });
  isHidden = true;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
    private store: Store<{ auth: AuthData }>,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.matIconRegistry.addSvgIcon(
      `pawn`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../../assets/pawn.svg`)
    );
  }

  get login() {
    return this.loginForm.get('login');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit(): void {
    this.authData$ = this.store.select('auth').subscribe((auth: AuthData) => {
      if (auth.isLoggedIn) {
        console.log('Logged in');
        this.router.navigate(['/dashboard']);
      } else {
        console.log('User not logged in.');
      }
    });

    this.authService
      .refreshToken({ loginAttempt: true })
      .pipe(take(1))
      .subscribe({
        next: (auth) => {
          this.store.dispatch(refresh(auth));
        },
        error: (error) => {
          console.error(error.message);
        },
      });
  }

  ngOnDestroy(): void {
    this.authData$.unsubscribe();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (auth) => {
          this.store.dispatch(logIn(auth));
        },
        error: (error) => {
          console.error(error);
          this.onWrongCredentials();
        },
      });
    }
  }

  onWrongCredentials() {
    this.loginForm.reset();
    this.login!.setErrors(null);
    this.password!.setErrors(null);
    this.dialog.open(LoginErrorComponent);
  }

  getLoginErrorMessage() {
    if (this.login!.hasError('required')) {
      return 'Login is required';
    } else if (this.login!.hasError('maxlength')) {
      return 'Login is too long';
    } else {
      return 'Error occured';
    }
  }

  getPasswordErrorMessage() {
    if (this.password!.hasError('required')) {
      return 'Password is required';
    } else if (this.password!.hasError('maxlength')) {
      return 'Password is too long';
    } else {
      return 'Error occured';
    }
  }
}
