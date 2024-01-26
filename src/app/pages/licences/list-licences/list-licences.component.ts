import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-list-licences',
  templateUrl: './list-licences.component.html',
  styleUrls: ['./list-licences.component.css']
})
export class ListLicencesComponent implements OnInit, OnDestroy {
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
      { field: "gym", header: "Gym" },
      { field: "typeLicence", header: "Type Licence" },
      { field: "amount", header: "Amount" },
      { field: "startDate", header: "Start" },
      { field: "endDate", header: "End" },
      { field: "isActive", header: "Active" }
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

    this.crud.getList('licences').subscribe((response: any) => {
      this.results = response;

      this.results.forEach((result: any) => {
        result.startDate = this.fun.transformDateTime(result.startDate);
        result.endDate = this.fun.transformDateTime(result.endDate);
        
        if (result.startDate === 'null - null' && result.endDate === 'null - null') {
          result.startDate = 'NOT ACTIVATED';
          result.endDate = 'NOT ACTIVATED';
        }
      });

      this.loading = false;
    });
  }

  showKey(item: any) {
    alert(item.keyLicence);
  }

  confirmDelete(item: any) {
    this.crud.confirmDelete(item, 'licences');
  }
  
  delete(item: any) {
    this.crud.delete(item, 'licences');
  }

  subscribeToDeleteEvent() {
    this.deleteSubscription = this.crud.getDeleteObservable().subscribe(() => {
      this.getList();
    });
  }

}
