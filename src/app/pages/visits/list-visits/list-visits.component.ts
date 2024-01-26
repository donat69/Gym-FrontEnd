import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { InteractDatabaseService } from 'src/app/services/interact-database.service';

@Component({
  selector: 'app-list-visits',
  templateUrl: './list-visits.component.html',
  styleUrls: ['./list-visits.component.css']
})
export class ListVisitsComponent implements OnInit, OnDestroy {
  private deleteSubscription: Subscription | undefined;

  loading: boolean | undefined;
  results: any;
  
  cols: any[] = [];
  exportColumns: any[] = [];

  constructor(
    public fun: FunctionsService,
    public auth: AuthService,
    public interact: InteractDatabaseService,
    public crud: CrudService
  ) {}

  ngOnInit() {
    this.getList();
    this.subscribeToDeleteEvent();

    this.cols = [
      { field: "id", header: "#" },
      { field: "memberName", header: "Member Name" },
      { field: "visitDate", header: "Visit Date" },
      { field: "gymName", header: "Gym" },
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

    this.crud.getList('visits').subscribe((response: any) => {
      this.results = response;

      this.results.forEach((result: any) => {
        result.visitDate = this.fun.transformDateTime(result.visitDate);
      });

      this.loading = false;
    });
  }

  confirmDelete(item: any) {
    this.crud.confirmDelete(item, 'visits');
  }
  
  delete(item: any) {
    this.crud.delete(item, 'visits');
  }

  subscribeToDeleteEvent() {
    this.deleteSubscription = this.crud.getDeleteObservable().subscribe(() => {
      this.getList();
    });
  }

}
