import { ConfigurableFocusTrap } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthData } from 'src/app/state/models/auth-data.model';
import { ConfirmPasswordDialogComponent } from './confirm-password-dialog/confirm-password-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  authData$: Subscription;
  authData: AuthData;

  placeholderUsername: string = 'Username';
  placeholderEmail: string = '';

  usernameForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
    ]),
  });
  emailForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    repeatEmail: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private readonly store: Store<{ auth: AuthData }>,
    private readonly dialog: MatDialog,
    private readonly http: HttpClient
  ) {}

  get username() {
    return this.usernameForm.get('username');
  }

  get email() {
    return this.emailForm.get('email');
  }

  get repeatEmail() {
    return this.emailForm.get('repeatEmail');
  }

  ngOnInit(): void {
    this.authData$ = this.store.select('auth').subscribe((auth: AuthData) => {
      if (auth.username) {
        this.placeholderUsername = auth.username;
        this.authData = auth;
      }
    });
  }

  ngOnDestroy(): void {
    this.authData$.unsubscribe();
  }

  onChangeUsername() {
    if (this.usernameForm.valid) {
      this.dialog.open(ConfirmPasswordDialogComponent, {
        data: {
          ...this.usernameForm.value,
          type: 'username',
        },
      });
    }
  }

  onChangeEmail() {
    if (
      this.emailForm.valid &&
      this.emailForm.value &&
      this.email?.value === this.repeatEmail?.value
    ) {
      this.dialog.open(ConfirmPasswordDialogComponent, {
        data: {
          ...this.emailForm.value,
          type: 'email',
        },
      });
    }
  }

  onChangePassword() {
    this.dialog.open(ConfirmPasswordDialogComponent, {
      data: {
        type: 'password',
      },
    });
  }

  onOpenedEmail() {
    console.log('opened');
    if (this.placeholderEmail === '') {
      this.http
        .get<any>(
          `http://localhost:3000/api/profile/email?username=${this.authData.username}`,
          {
            withCredentials: true,
            responseType: 'json',
          }
        )
        .subscribe((data) => {
          if (data.result) {
            console.debug(data.message);
            this.placeholderEmail = data.result;
          }
        });
    }
  }
}
