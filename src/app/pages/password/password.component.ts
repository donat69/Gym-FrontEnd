import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      old_password: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      this.updatePassword();
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  updatePassword() {
    this.loading = true;

    this.api.put('authenticated/users/password', this.form.value).subscribe({
      complete: () => {
        this.loading = false;

        this.form.reset();

        this.fun.presentAlert('Password has been updated.');
      },
      error: (error) => {
        this.loading = false;

        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      },
      next: () => {},
    });
  }

}
