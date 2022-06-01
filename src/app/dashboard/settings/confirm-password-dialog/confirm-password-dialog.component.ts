import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { refresh } from 'src/app/state/actions/auth-data.action';
import { AuthData } from 'src/app/state/models/auth-data.model';

@Component({
  selector: 'app-confirm-password-dialog',
  templateUrl: './confirm-password-dialog.component.html',
  styleUrls: ['./confirm-password-dialog.component.scss'],
})
export class ConfirmPasswordDialogComponent implements OnInit {
  message: string = 'An error occured.';
  errorMessage: string = '';

  isPassword: boolean = false;
  isEmail: boolean = false;
  isUsername: boolean = false;
  isError: boolean = false;
  isLoading: boolean = false;

  isHiddenNewPass: boolean = true;
  isHiddenNewPassRepeat: boolean = true;
  isHiddenOldPass: boolean = true;
  isHiddenConfirmPass: boolean = true;

  // TODO: finish password submission - regex for new passwords
  confirmPassword: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required]),
  });

  changePassword: FormGroup = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-_]).{8,}$'
      ),
    ]),
    newPasswordRepeat: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-_]).{8,}$'
      ),
    ]),
    oldPassword: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly http: HttpClient,
    private readonly store: Store<{ auth: AuthData }>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  get newPassword() {
    return this.changePassword.get('newPassword');
  }

  get newPasswordRepeat() {
    return this.changePassword.get('newPasswordRepeat');
  }

  ngOnInit(): void {
    switch (this.data.type) {
      case 'password':
        this.message = 'Set your new password:';
        this.isPassword = true;
        break;
      case 'email':
        this.message = 'To change your email confirm your password:';
        this.isEmail = true;
        break;
      case 'username':
        this.message = 'To change your username confirm your password: ';
        this.isUsername = true;
        break;
      default:
        this.errorMessage = 'Something went wrong.';
        this.isError = true;
        break;
    }
  }

  onSubmitPasswordChange() {
    console.log(this.changePassword.invalid);
    if (this.changePassword.valid) {
      this.isPassword = false;
      this.isLoading = true;
      this.message = '';

      const data = {
        newPassword: this.changePassword.value.newPassword,
        pass: this.changePassword.value.oldPassword,
      };

      this.http
        .post<any>(
          `http://localhost:3000/api/profile/password`,
          { ...data },
          {
            withCredentials: true,
            responseType: 'json',
          }
        )
        .subscribe((data) => {
          this.isLoading = false;
          this.message = data.message;
        });
    }
  }

  onPasswordConfirmation() {
    if (this.confirmPassword.valid) {
      let data: any;
      switch (this.data.type) {
        case 'email':
          data = {
            email: this.data.email,
            pass: this.confirmPassword.value.password,
          };
          this.isLoading = true;
          this.isEmail = false;
          break;
        case 'username':
          data = {
            username: this.data.username,
            pass: this.confirmPassword.value.password,
          };
          this.isUsername = false;
          this.isLoading = true;
          break;
      }
      this.message = '';
      this.http
        .post<any>(
          `http://localhost:3000/api/profile/${this.data.type}`,
          { ...data },
          { withCredentials: true, responseType: 'json' }
        )
        .subscribe((data) => {
          this.authService
            .refreshToken({ loginAttempt: false })
            .pipe(take(1))
            .subscribe({
              next: (auth) => {
                this.store.dispatch(refresh(auth));
              },
              error: (error) => {
                console.error(error.message);
              },
            });

          setTimeout(() => {
            this.isLoading = false;
            this.message = data.message;
          }, 4000);
        });
    }
  }
}
