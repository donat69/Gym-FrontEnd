import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { FunctionsService } from '../../../../services/functions.service';
import { AuthService } from '../../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  
  category: any = {
    id: ''
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
        name: ['', Validators.required],
        tenantId: ['', Validators.required]
      });
    } else {
      this.form = this.formBuilder.group({
        name: ['', Validators.required]
      });
    }

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getCategory(this.activatedRoute.snapshot.paramMap.get('id'));
    }
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.category.id) {
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

    const categoryData = {
      ...this.form.value
    };

    if (this.auth.hasRole(['SUPERADMIN'])) {
      categoryData.tenantId = this.form.value.tenantId;
    } else {
      categoryData.tenantId = this.auth.user.tenantId;
    }

    this.crud.save('crud/categories', categoryData).subscribe(() => {
      this.loading = false;
      
      this.fun.presentAlert("Saved");
      this.router.navigateByUrl('store/categories/list');
    });
  }

  update() {
    this.loading = true;

    this.crud.update(`categories/${this.category.id}`, this.form.value).subscribe(() => {
      this.loading = false;
      
      this.fun.presentAlert("Updated");
      this.router.navigateByUrl('store/categories/list');
    });
  }
  
  getCategory(id: any) {
    this.loading = true;

    this.crud.getListNormal(`crud/categories/${id}`).subscribe((response: any) => {
      this.category = response;
      
      this.form.markAsDirty();
      this.form.get('name').setValue(this.category.name);

      this.loading = false;
    });
  }

}
