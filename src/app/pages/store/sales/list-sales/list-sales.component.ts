import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: ['./list-sales.component.css']
})
export class ListSalesComponent implements OnInit, OnDestroy {
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
      { field: "id", header: "#" },
      { field: "saleDate", header: "Sale Date" },
      { field: "totalAmount", header: "Total Amount" },
      { field: "paymentMethod", header: "Payment Method" },
      { field: "status", header: "Status" },
      { field: "reference", header: "Reference" },
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

    this.crud.getList('sales').subscribe((response: any) => {
      this.results = response;

      this.results.forEach((result: any) => {
        result.saleDate = this.fun.transformDateTime(result.saleDate); // Transform the date
      });

      this.loading = false;
    });
  }

  confirmDelete(item: any) {
    this.crud.confirmDelete(item, 'sales');
  }
  
  delete(item: any) {
    this.crud.delete(item, 'sales');
  }

  subscribeToDeleteEvent() {
    this.deleteSubscription = this.crud.getDeleteObservable().subscribe(() => {
      this.getList();
    });
  }

}
