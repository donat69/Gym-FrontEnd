import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-list-type-licences',
  templateUrl: './list-type-licences.component.html',
  styleUrls: ['./list-type-licences.component.css']
})
export class ListTypeLicencesComponent implements OnInit, OnDestroy {
  private deleteSubscription: Subscription | undefined;
  
  loading: boolean | undefined;
  results: any;

  cols: any[] = [];
  exportColumns: any[] = [];
  
  constructor(
    public fun: FunctionsService,
    public auth: AuthService,
    private crud: CrudService
  ) {}

  ngOnInit() {
    this.getList();
    this.subscribeToDeleteEvent();

    this.cols = [
      { field: "id", header: "#" },
      { field: "name", header: "Name" },
      { field: "price", header: "Price" },
      { field: "type", header: "Type" },
      { field: "months", header: "Months" },
      { field: "weeks", header: "Weeks" },
      { field: "days", header: "Days" },
      { field: "createdBy", header: "Created By" },
      { field: "createdAt", header: "Created At" },
      { field: "updatedAt", header: "Updated At" }
    ];

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

    this.crud.getList('typeLicences').subscribe((response: any) => {
      this.results = response;

      this.results.forEach((result: any) => {
        result.createdAt = this.fun.transformDate(result.createdAt);
        result.updatedAt = this.fun.transformDate(result.updatedAt);
        result.months = result.months !== null && result.months !== undefined ? result.months : 'N/A';
        result.weeks = result.weeks !== null && result.weeks !== undefined ? result.weeks : 'N/A';
        result.days = result.days !== null && result.days !== undefined ? result.days : 'N/A';
      });
     
      this.loading = false;
    });
  }

  confirmDelete(item: any) {
    this.crud.confirmDelete(item, 'typeLicences');
  }
  
  delete(item: any) {
    this.crud.delete(item, 'typeLicences');
  }

  subscribeToDeleteEvent() {
    this.deleteSubscription = this.crud.getDeleteObservable().subscribe(() => {
      this.getList();
    });
  }

}
