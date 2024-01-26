import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { FunctionsService } from '../../../../services/functions.service';
import { AuthService } from '../../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-new-subcategory',
  templateUrl: './new-subcategory.component.html',
  styleUrls: ['./new-subcategory.component.css']
})
export class NewSubcategoryComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  
  subcategory: any = {
    id: ''
  };

  gyms: any[] = [];
  categories: any[] = [];

  // Propiedad para almacenar las categorías filtradas por tenantId
  filteredCategories: any[] = [];

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
    
    this.api.get(`crud/categories`).subscribe((data: any) => {
      if (this.auth.hasRole(['SUPERADMIN'])) {
        this.categories = Object.keys(data).map(key => data[key]);
      } else {
        const categoriesData = Object.keys(data).map(key => data[key]);
        this.categories = categoriesData.filter(category => category.tenantId === this.auth.user.tenantId);

        this.filteredCategories = this.categories;
      }
    });
  }

  ngOnInit() {
    if (this.auth.hasRole(['SUPERADMIN'])) {
      this.form = this.formBuilder.group({
        name: ['', Validators.required],
        categoryId: ['', Validators.required],
        tenantId: ['', Validators.required]
      });
    } else {
      this.form = this.formBuilder.group({
        name: ['', Validators.required],
        categoryId: ['', Validators.required]
      });
    }

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getSubcategory(this.activatedRoute.snapshot.paramMap.get('id'));
    }
  }

  onGymSelectionChange() {
    this.filteredCategories = this.categories.filter(category => category.tenantId === parseInt(this.form.value.tenantId));
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.subcategory.id) {
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

    const subcategoryData = {
      ...this.form.value
    };

    if (this.auth.hasRole(['SUPERADMIN'])) {
      subcategoryData.tenantId = this.form.value.tenantId;
    } else {
      subcategoryData.tenantId = this.auth.user.tenantId;
    }

    this.crud.save('crud/subcategories', subcategoryData).subscribe(() => {
      this.loading = false;

      this.fun.presentAlert("Saved");
      this.router.navigateByUrl('store/subcategories/list');
    });
  }

  update() {
    this.loading = true;

    this.crud.update(`subcategories/${this.subcategory.id}`, this.form.value).subscribe(() => {
      this.loading = false;

      this.fun.presentAlert("Updated");
      this.router.navigateByUrl('store/subcategories/list');
    });
  }
  
  getSubcategory(id: any) {
    this.loading = true;

    this.crud.getListNormal(`crud/subcategories/${id}`).subscribe((response: any) => {
      this.subcategory = response;
      
      this.form.markAsDirty();

      if (this.auth.hasRole(['SUPERADMIN'])) {
        this.form.get('tenantId').setValue(this.subcategory.tenantId);
      }
      
      this.form.get('name').setValue(this.subcategory.name);
      this.form.get('categoryId').setValue(this.subcategory.categoryId);

      this.loading = false;
    });
  }

}
