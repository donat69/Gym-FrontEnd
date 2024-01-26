import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit, OnDestroy {
  private deleteSubscription: Subscription | undefined;

  loading: boolean | undefined;
  results: any;

  cols: any[] = [];
  exportColumns: any[] = [];
  
  constructor(
    public fun: FunctionsService,
    public auth: AuthService,
    public crud: CrudService
  ) {}

  ngOnInit() {
    this.getList();
    this.subscribeToDeleteEvent();

    this.cols = [
      /* { field: "id", header: "#" }, */
      { field: "name", header: "Name" },
      /* { field: "image", header: "Image" }, */
      { field: "category", header: "Category" },
      { field: "subcategory", header: "Subcategory" },
      { field: "unitType", header: "Unit Type" },
      { field: "purchasePrice", header: "Purchase Price" },
      { field: "salePrice", header: "Sale Price" },
      { field: "quantity", header: "Quantity" },
      { field: "reorderQuantity", header: "Reorder Quantity" },
      { field: "sku", header: "SKU" }
    ];

    // Check if the user has the "SUPERADMIN" role and add the "tenant" column conditionally
    if (this.auth.hasRole(['SUPERADMIN'])) {
      this.cols.splice(2, 0, { field: "tenant", header: "Gym" });
    }

    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  ngOnDestroy() {
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  getList() {
    this.loading = true;

    this.crud.getList('products').subscribe((response: any) => {
      this.results = response;

      this.loading = false;
    });
  }

  confirmDelete(item: any) {
    this.crud.confirmDelete(item, 'products');
  }
  
  delete(item: any) {
    this.crud.delete(item, 'products');
  }

  subscribeToDeleteEvent() {
    this.deleteSubscription = this.crud.getDeleteObservable().subscribe(() => {
      this.getList();
    });
  }

}
