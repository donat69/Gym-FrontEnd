import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { LanguageService } from 'src/app/services/language.service';

declare var bootstrap: any;

@Component({
  selector: 'app-licence-key-modal',
  templateUrl: './licence-key-modal.component.html',
  styleUrls: ['./licence-key-modal.component.css']
})
export class LicenceKeyModalComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  attemptCount: number = 0;
  maxAttempts: number = 2;

  selectedCountry: any;

  modal: any;

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    public auth: AuthService,
    private router: Router,
    private language: LanguageService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      keyLicence: ['', Validators.required],
    });
  }

  selectCountry(country: string, lang: string): void {
    this.selectedCountry = country;
    this.language.setActiveLanguage(lang);
    localStorage.setItem('selectedCountry', this.selectedCountry);
  }

  changeLang(lang: string): void {
    const currentLang = this.language.getActiveLanguage();

    if (currentLang === 'es') {
      this.selectCountry('English', 'en');
    } else if (currentLang === 'en') {
      this.selectCountry('Spanish', 'es');
    }

    this.language.setActiveLanguage(lang);
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.attemptCount >= this.maxAttempts) {
        this.logout();
        this.fun.presentAlertError('The maximum number of attempts has been exceeded.');
        return;
      }

      this.save();
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  save() {
    this.loading = true;

    const dataVerify = {
      ...this.form.value,
      tenantId: this.auth.user.tenantId,
    }

    const data = {
      isActive: true,
    }

    this.api.post('verifyLicence/licences', dataVerify).subscribe((response: any) => {
      this.loading = false;

      this.fun.presentAlert("Licence activated!");
      this.router.navigateByUrl('/dashboard');

      this.api.put(`crud/users/${this.auth.user.id}`, data).subscribe({
        complete: () => {},
        error: () => {},
        next: () => {
          window.location.reload();
        },
      });

      this.closeModal();
    }, error => {
      this.loading = false;

      this.fun.presentAlertError(
        error.error.message ||
          error.error.sqlMessage ||
          'Something went wrong. Try again.'
      );

      this.form.reset();
      this.attemptCount++;
    });
  }

  openModal() {
    const modalElement = document.getElementById('licenceKeyModal');
    this.modal = new bootstrap.Modal(modalElement);
    this.modal.show();
  }

  closeModal() {
    if (this.modal) {
      this.modal.hide();
      const modalElement = document.getElementById('licenceKeyModal');
      if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', () => {
          modalElement.style.display = 'none';
          document.body.classList.remove('modal-open');
          const modalBackdrop = document.querySelector('.modal-backdrop');
          if (modalBackdrop) {
            modalBackdrop.parentNode?.removeChild(modalBackdrop);
          }
        });
      }
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
    this.closeModal();
  }

}
