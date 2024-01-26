import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-new-owner',
  templateUrl: './new-owner.component.html',
  styleUrls: ['./new-owner.component.css']
})
export class NewOwnerComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  
  owner: any = {
    id: '',
  };

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private crud: CrudService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      rfc: [''],
      type: ['', Validators.required],
    });

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getOwner(this.activatedRoute.snapshot.paramMap.get('id'));
    }
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.owner.id) {
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

    const ownerData = {
      ...this.form.value,
      createdBy: this.auth.user.id
    };

    this.crud.save('crud/owners', ownerData).subscribe(() => {
      this.loading = false;
      this.fun.presentAlert("Saved");
      this.router.navigateByUrl('owners/list');
    });
  }

  update() {
    this.loading = true;

    this.crud.update(`owners/${this.owner.id}`, this.form.value).subscribe(() => {
      this.loading = false;
      this.fun.presentAlert("Updated");
      this.router.navigateByUrl('owners/list');
    });
  }
  
  getOwner(id: any) {
    this.loading = true;

    this.crud.getListNormal(`crud/owners/${id}`).subscribe((response: any) => {
      this.owner = response;
      
      this.form.markAsDirty();
      this.form.get('name').setValue(this.owner.name);
      this.form.get('email').setValue(this.owner.email);
      this.form.get('phone').setValue(this.owner.phone);
      this.form.get('address').setValue(this.owner.address);
      this.form.get('birthDate').setValue(this.owner.birthDate);
      this.form.get('gender').setValue(this.owner.gender);
      this.form.get('rfc').setValue(this.owner.rfc);
      this.form.get('type').setValue(this.owner.type);

      this.loading = false;
    });
  }

}
