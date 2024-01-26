import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  environment = environment;

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    if (this.auth.is_login) {
      this.navigate();
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      this.login();
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  login() {
    this.loading = true;
    this.api.post_('auth/users', this.form.value).subscribe({
      complete: () => { },
      error: (error) => {
        this.loading = false;
        this.fun.presentAlertError(
          error.error.message ||
          error.error.sqlMessage ||
          'Something went wrong. Try again.'
        );
      },
      next: (response) => {
        this.loading = false;
        this.auth.setLogin(response);
        this.navigate();
      },
    });
  }

  signInWithGoogle() {
    this.loading = false;
    window.open(`${environment.url}login/google`, "mywindow", "location=1,status=1,scrollbars=1, width=800,height=800");
    let listener = window.addEventListener('message', (message) => {
      this.loading = false;
      this.auth.setLogin(message.data);
      this.navigate();
    });
  }

  navigate() {
    this.router.navigateByUrl('/dashboard');
  }
}