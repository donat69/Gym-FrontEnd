import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-new-gym',
  templateUrl: './new-gym.component.html',
  styleUrls: ['./new-gym.component.css']
})
export class NewGymComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  
  gym: any = {
    id: '',
  };
  owners: any[] = [];

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private crud: CrudService
  ) {
    this.api.get(`crud/owners`).subscribe((data: any) => {
      this.owners = Object.keys(data).map(key => data[key]);
    });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      ownerId: ['', Validators.required],
    });

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getGym(this.activatedRoute.snapshot.paramMap.get('id'));
    }
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.gym.id) {
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

    const gymData = {
      ...this.form.value,
      createdBy: this.auth.user.id
    }

    this.crud.save('crud/gyms', gymData).subscribe(() => {
      this.loading = false;
      this.fun.presentAlert("Saved");
      this.router.navigateByUrl('gyms/list');
    });
  }

  update() {
    this.loading = true;

    this.crud.update(`gyms/${this.gym.id}`, this.form.value).subscribe(() => {
      this.loading = false;
      this.fun.presentAlert("Updated");
      this.router.navigateByUrl('gyms/list');
    });
  }

  getGym(id: any) {
    this.loading = true;

    this.crud.getListNormal(`crud/gyms/${id}`).subscribe((response: any) => {
      this.gym = response;
      
      this.form.markAsDirty();
      this.form.get('name').setValue(this.gym.name);
      this.form.get('address').setValue(this.gym.address);
      this.form.get('phone').setValue(this.gym.phone);
      this.form.get('email').setValue(this.gym.email);
      this.form.get('ownerId').setValue(this.gym.ownerId);

      this.loading = false;
    });
  }

}
