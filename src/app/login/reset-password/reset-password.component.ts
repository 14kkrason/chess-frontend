import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(24),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly snackbar: MatSnackBar,
    private readonly http: HttpClient,
  ) {
    this.matIconRegistry.addSvgIcon(
      `pawn`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../../assets/pawn.svg`)
    );
  }

  get username() {
    return this.resetPasswordForm.get('username');
  }

  get email() {
    return this.resetPasswordForm.get('email');
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.http.post<any>(
        'http://localhost:3000/api/auth/reset-password',
        {
          username: this.username?.value,
          email: this.email?.value
        },
        {
          withCredentials: true,
          responseType: 'json'
        }
      ).subscribe((data) => {
        this.snackbar.openFromComponent(ResetSnackbarComponent, {
          duration: 1000 * 5,
        });
      })


    }
  }
}

@Component({
  selector: 'reset-snackbar',
  templateUrl: './reset-password-snackbar.html',
})
export class ResetSnackbarComponent {}
