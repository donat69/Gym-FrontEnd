import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-new-membership',
  templateUrl: './new-membership.component.html',
  styleUrls: ['./new-membership.component.css']
})
export class NewMembershipComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  membership: any = {
    id: '',
  };

  gyms: any[] = [];
  
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private crud: CrudService
  ) {
    this.api.get(`crud/gyms`).subscribe((data: any) => {
      this.gyms = Object.keys(data).map(key => data[key]);
    });
  }

  ngOnInit() {
    if (this.auth.hasRole(['SUPERADMIN'])) {
      this.form = this.formBuilder.group({
        tenantId: ['', Validators.required],
        name: ['', Validators.required],
        price: ['', Validators.required],
        type: ['', Validators.required],
        months: [{ value: '', disabled: true }, [Validators.pattern(/^[0-9]*$/)]],
        weeks: [{ value: '', disabled: true }, [Validators.pattern(/^[0-9]*$/)]],
        days: [{ value: '', disabled: true }, [Validators.pattern(/^[0-9]*$/)]],
      });
    } else {
      this.form = this.formBuilder.group({
        name: ['', Validators.required],
        price: ['', Validators.required],
        type: ['', Validators.required],
        months: [{ value: '', disabled: true }, [Validators.pattern(/^[0-9]*$/)]],
        weeks: [{ value: '', disabled: true }, [Validators.pattern(/^[0-9]*$/)]],
        days: [{ value: '', disabled: true }, [Validators.pattern(/^[0-9]*$/)]],
      });
    }

    // Listener al evento change del select
    this.form.get('type').valueChanges.subscribe((type: string) => {
      // Habilita/deshabilita los inputs correspondientes según el tipo seleccionado
      if (type === 'MONTHLY') {
        this.form.get('months').enable();
        this.form.get('weeks').disable();
        this.form.get('days').disable();

        // Establece validadores requeridos para el control "months" y elimina los validadores de los otros controles
        this.form.get('months').setValidators([Validators.required]);
        this.form.get('weeks').clearValidators();
        this.form.get('days').clearValidators();
      } else if (type === 'WEEKLY') {
        this.form.get('months').disable();
        this.form.get('weeks').enable();
        this.form.get('days').disable();

        this.form.get('months').clearValidators();
        this.form.get('weeks').setValidators([Validators.required]);
        this.form.get('days').clearValidators();
      } else if (type === 'DAILY') {
        this.form.get('months').disable();
        this.form.get('weeks').disable();
        this.form.get('days').enable();

        this.form.get('months').clearValidators();
        this.form.get('weeks').clearValidators();
        this.form.get('days').setValidators([Validators.required]);
      }

      // Actualiza la validación de los controles
      this.form.get('months').updateValueAndValidity();
      this.form.get('weeks').updateValueAndValidity();
      this.form.get('days').updateValueAndValidity();
    });

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getMembership(this.activatedRoute.snapshot.paramMap.get('id'));
    }
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.membership.id) {
        this.update();
      } else {
        this.save();
      }
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  save() {
    this.loading = true;

    const membershipData = {
      ...this.form.value,
      createdBy: this.auth.user.id
    }

    if (this.auth.hasRole(['SUPERADMIN'])) {
      membershipData.tenantId = this.form.value.tenantId;
    } else {
      membershipData.tenantId = this.auth.user.tenantId;
    }

    this.crud.save('crud/memberships', membershipData).subscribe(() => {
      this.loading = false;
      this.fun.presentAlert("Saved");
      this.router.navigateByUrl('memberships/list');
    });
  }

  update() {
    this.loading = true;

    this.crud.update(`memberships/${this.membership.id}`, this.form.value).subscribe(() => {
      this.loading = false;
      this.fun.presentAlert("Updated");
      this.router.navigateByUrl('memberships/list');
    });
  }

  getMembership(id: any) {
    this.loading = true;

    this.crud.getListNormal(`crud/memberships/${id}`).subscribe((response: any) => {
      this.membership = response;

      this.form.markAsDirty();
      if (this.form.controls['name']) {
        this.form.get('name').setValue(this.membership.name);
      }
      if (this.form.controls['price']) {
        this.form.get('price').setValue(this.membership.price);
      }
      if (this.form.controls['type']) {
        this.form.get('type').setValue(this.membership.type);
      }
      if (this.form.controls['months']) {
        this.form.get('months').setValue(this.membership.months);
      }
      if (this.form.controls['weeks']) {
        this.form.get('weeks').setValue(this.membership.weeks);
      }
      if (this.form.controls['days']) {
        this.form.get('days').setValue(this.membership.days);
      }

      this.loading = false;
    });
  }

}
