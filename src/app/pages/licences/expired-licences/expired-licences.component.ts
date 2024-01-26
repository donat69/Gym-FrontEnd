import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-expired-licences',
  templateUrl: './expired-licences.component.html',
  styleUrls: ['./expired-licences.component.css']
})
export class ExpiredLicencesComponent implements OnInit, OnDestroy {
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
      { field: "gymName", header: "Gym" },
      { field: "endDate", header: "End Date" },
      { field: "licenceName", header: "Licence" },
      { field: "licenceAmount", header: "Amount" }
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

    this.crud.getList('expiredLicences').subscribe((response: any) => {
      this.results = response;

      this.results.forEach((result: any) => {
        result.endDate = this.fun.transformDateTime(result.endDate);
      });

      this.loading = false;
    });
  }

  confirmDeleteAll() {
    this.crud.confirmDeleteAll('expiredLicences');
  }

  deleteAll() {
    this.crud.deleteAll('expiredLicences');
  }

  subscribeToDeleteEvent() {
    this.deleteSubscription = this.crud.getDeleteObservable().subscribe(() => {
      this.getList();
    });
  }

}
