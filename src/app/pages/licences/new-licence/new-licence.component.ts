import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-new-licence',
  templateUrl: './new-licence.component.html',
  styleUrls: ['./new-licence.component.css']
})
export class NewLicenceComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  licence: any = {
    id: '',
  };
  gyms: any[] = [];
  typeLicences: any[] = [];
  dateNow = new Date();
  showAmount: boolean = false;
  showAmountInput: boolean = true;
  
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

    this.api.get(`crud/typeLicences`).subscribe((data: any) => {
      this.typeLicences = Object.keys(data).map(key => data[key]);
    });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      gymId: ['', Validators.required],
      licenceId: ['', Validators.required],
      amount: ['', Validators.required],
      //startDate: ['', Validators.required],
    });

    //this.form.get('startDate').setValue(this.fun.transformDate(this.dateNow, 'yyyy-MM-dd'));

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getTypeLicence(this.activatedRoute.snapshot.paramMap.get('id'));
    }
  }

  onTypeLicenceChange() {
    const licenceId = this.form.get('licenceId').value;
    this.showAmount = licenceId !== null && licenceId !== '';
  }

  getSelectedTypeLicencePrice() {
    const licenceId = this.form.value.licenceId;
    const licence = this.typeLicences.find(licence => licence.id === Number(licenceId));

    if (licence) {
      this.showAmount = true;
      this.form.get('amount').setValue(licence.price);
    }
  } 
  
  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.licence.id) {
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

    const licenceData = {
      ...this.form.value,
      createdBy: this.auth.user.id,
    }

    this.crud.save('typeLicences/licences', licenceData).subscribe(() => {
      this.loading = false;
      this.fun.presentAlert("Saved");
      this.router.navigateByUrl('licences/list');
    });
  }

  update() {
    this.loading = true;

    this.crud.update(`licences/${this.licence.id}`, this.form.value).subscribe(() => {
      this.loading = false;
      this.fun.presentAlert("Updated");
      this.router.navigateByUrl('licences/list');
    });
  }

  getTypeLicence(id: any) {
    this.loading = true;

    this.crud.getListNormal(`crud/licences/${id}`).subscribe((response: any) => {
      this.licence = response;
      
      this.form.markAsDirty();
      this.form.get('gymId').setValue(this.licence.gymId);
      this.form.get('licenceId').setValue(this.licence.licenceId);
      this.form.get('amount').setValue(this.licence.amount);
      //this.form.get('startDate').setValue(this.licence.startDate);

      this.loading = false;
    });
  }

}
