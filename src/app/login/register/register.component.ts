import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  isPasswordHidden: boolean = true;
  isRepeatPasswordHidden: boolean = true;
  // submit button:
  // [disabled]="!(newPassword?.value === newPasswordRepeat?.value)"
  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(24),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-_]).{8,}$'
      ),
    ]),
    repeatPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-_]).{8,}$'
      ),
    ]),
  });

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get repeatPassword() {
    return this.registerForm.get('repeatPassword');
  }

  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly snackbar: MatSnackBar,
    private readonly http: HttpClient
  ) {
    this.matIconRegistry.addSvgIcon(
      `pawn`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../../assets/pawn.svg`)
    );
  }

  ngOnInit(): void {}

  onRegister(): void {
    if (this.registerForm.valid) {
      this.http
        .post<any>(
          `http://localhost:3000/api/profile/create`,
          {
            username: this.username?.value,
            password: this.password?.value,
            email: this.email?.value,
          },
          {
            withCredentials: true,
            responseType: 'json',
          }
        )
        .subscribe((data) => {
          this.password?.reset();
          this.repeatPassword?.reset();
          if (data.errors.length > 0) {
            this.snackbar.open(data.errors.join('\n'), undefined, {
              duration: 5 * 1000,
              panelClass: ['errors-snackbar'],
            });
          } else {
            this.username?.reset();
            this.email?.reset();
            this.snackbar.open(
              `Account ${data.user} created successfully! Try to log in 😊`,
              undefined,
              {
                duration: 5 * 1000,
                panelClass: ['errors-snackbar'],
              }
            );
          }
        });
    }
  }
}
