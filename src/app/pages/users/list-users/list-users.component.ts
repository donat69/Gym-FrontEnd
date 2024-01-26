import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, OnDestroy {
  private deleteSubscription: Subscription | undefined;

  loading: boolean | undefined;
  results: any;

  cols: any[] = [];
  exportColumns: any[] = [];

  environment = environment;

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
      { field: "name", header: "Name" },
      { field: "email", header: "Email" },
      { field: "role", header: "Role" },
      { field: "gymName", header: "Gym" },
      { field: "isActive", header: "Active" },
      { field: "createdAt", header: "Created At" },
      { field: "updatedAt", header: "Updated At" },
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

    this.crud.getList('users').subscribe((response: any) => {
      this.results = response;

      this.results.forEach((result: any) => {
        result.createdAt = this.fun.transformDate(result.createdAt);
        result.updatedAt = this.fun.transformDate(result.updatedAt);
      });

      this.loading = false;
    });
  }
  
  confirmDelete(item: any) {
    if (item.id == this.auth.user.id) {
      this.fun.presentAlertError('You cannot delete yourself!');
      return;
    } else if (item.id == 1) {
      this.fun.presentAlertError('You cannot delete the SUPERADMIN!');
      return;
    }

    this.crud.confirmDelete(item, 'users');
  }
  
  delete(item: any) {
    this.crud.delete(item, 'users');
  }

  subscribeToDeleteEvent() {
    this.deleteSubscription = this.crud.getDeleteObservable().subscribe(() => {
      this.getList();
    });
  }

}
