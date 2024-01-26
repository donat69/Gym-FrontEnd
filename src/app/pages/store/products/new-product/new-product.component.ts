import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { FunctionsService } from '../../../../services/functions.service';
import { AuthService } from '../../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  
  product: any = {
    id: ''
  };

  gyms: any[] = [];
  categories: any[] = [];
  subcategories: any[] = [];

  // Propiedades para filtrar las categorías y subcategorías por tenantId
  filteredCategories: any[] = [];
  filteredSubcategories: any[] = [];

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

    this.api.get(`crud/subcategories`).subscribe((data: any) => {
      if (this.auth.hasRole(['SUPERADMIN'])) {
        this.subcategories = Object.keys(data).map(key => data[key]);
      } else {
        const subcategoriesData = Object.keys(data).map(key => data[key]);
        this.subcategories = subcategoriesData.filter(subcategory => subcategory.tenantId === this.auth.user.tenantId);

        this.filteredSubcategories = this.subcategories;
      }
    });
  }

  ngOnInit() {
    if (this.auth.hasRole(['SUPERADMIN'])) {
      this.form = this.formBuilder.group({
        tenantId: ['', Validators.required],
        name: ['', Validators.required],
        categoryId: ['', Validators.required],
        subcategoryId: ['', Validators.required],
        unitType: ['', Validators.required],
        purchasePrice: ['', Validators.required],
        salePrice: ['', Validators.required],
        quantity: ['', Validators.required],
        reorderQuantity: ['', Validators.required],
        sku: ['', Validators.required]
      });
    } else {
      this.form = this.formBuilder.group({
        name: ['', Validators.required],
        categoryId: ['', Validators.required],
        subcategoryId: ['', Validators.required],
        unitType: ['', Validators.required],
        purchasePrice: ['', Validators.required],
        salePrice: ['', Validators.required],
        quantity: ['', Validators.required],
        reorderQuantity: ['', Validators.required],
        sku: ['', Validators.required]
      });
    }

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getProduct(this.activatedRoute.snapshot.paramMap.get('id'));
    }
  }

  onGymSelectionChange() {
    this.filteredCategories = this.categories.filter(category => category.tenantId === parseInt(this.form.value.tenantId));
    this.filteredSubcategories = this.subcategories.filter(subcategory => subcategory.tenantId === parseInt(this.form.value.tenantId));
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.product.id) {
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

    const productData = {
      ...this.form.value
    };

    if (this.auth.hasRole(['SUPERADMIN'])) {
      productData.tenantId = this.form.value.tenantId;
    } else {
      productData.tenantId = this.auth.user.tenantId;
    }

    this.crud.save('crud/products', productData).subscribe(() => {
      this.loading = false;

      this.fun.presentAlert("Saved");
      this.router.navigateByUrl('store/products/list');
    });
  }

  update() {
    this.loading = true;

    this.crud.update(`products/${this.product.id}`, this.form.value).subscribe(() => {
      this.loading = false;

      this.fun.presentAlert("Updated");
      this.router.navigateByUrl('store/products/list');
    });
  }
  
  getProduct(id: any) {
    this.loading = true;

    this.crud.getListNormal(`crud/products/${id}`).subscribe((response: any) => {
      this.product = response;
      
      this.form.markAsDirty();

      if (this.auth.hasRole(['SUPERADMIN'])) {
        this.form.get('tenantId').setValue(this.product.tenantId);
      }
      
      this.form.get('name').setValue(this.product.name);
      this.form.get('categoryId').setValue(this.product.categoryId);
      this.form.get('subcategoryId').setValue(this.product.subcategoryId);
      this.form.get('unitType').setValue(this.product.unitType);
      this.form.get('purchasePrice').setValue(this.product.purchasePrice);
      this.form.get('salePrice').setValue(this.product.salePrice);
      this.form.get('quantity').setValue(this.product.quantity);
      this.form.get('reorderQuantity').setValue(this.product.reorderQuantity);
      this.form.get('sku').setValue(this.product.sku);

      this.loading = false;
    });
  }

}
