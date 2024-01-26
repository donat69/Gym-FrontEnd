import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { Member } from 'src/app/models/member.model'
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ImageService } from 'src/app/services/image.service';
import { InteractDatabaseService } from 'src/app/services/interact-database.service';
import { Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-list-members',
  templateUrl: './list-members.component.html',
  styleUrls: ['./list-members.component.css']
})
export class ListMembersComponent implements OnInit, OnDestroy {
  private deleteSubscription: Subscription | undefined;
  
  loading: boolean | undefined;
  results: any;
  
  cols: any[] = [];
  exportColumns: any[] = [];
  
  // ************ //
  members: Member[] = [];
  url: SafeUrl = '';
  urlMember: any;
  viewMember: boolean = false;

  // Variables for the modal
  displayModal = false;

  constructor(
    public fun: FunctionsService,
    public auth: AuthService,
    public upload: FileUploadService,
    public image: ImageService,
    public interact: InteractDatabaseService,
    public crud: CrudService
  ) {}

  ngOnInit() {
    this.getList();
    this.subscribeToDeleteEvent();
    
    this.cols = [
      { field: "id", header: "#" },
      { field: "name", header: "Name" },
      { field: "email", header: "Email" },
      { field: "phone", header: "Phone" },
      { field: "address", header: "Address" },
      { field: "birthDate", header: "Birth Date" },
      { field: "gender", header: "Gender" },
      { field: "observations", header: "Observations" },
      { field: "createdBy", header: "Created By" },
      { field: "gymName", header: "Gym" },
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

    this.crud.getList('members').subscribe((response: any) => {
      this.results = response;
      
      this.results.forEach((result: any) => {
        result.createdAt = this.fun.transformDate(result.createdAt);
        result.updatedAt = this.fun.transformDate(result.updatedAt);
        result.birthDate = this.fun.transformDate(result.birthDate);
      });

      this.loading = false;
    });
  }
  
  confirmDelete(item: any) {
    this.crud.confirmDelete(item, 'members');
  }
  
  delete(item: any) {
    this.crud.delete(item, 'members');
  }

  subscribeToDeleteEvent() {
    this.deleteSubscription = this.crud.getDeleteObservable().subscribe(() => {
      this.getList();
    });
  }

  /** ////////////////////////////////////////////// */

  onCodeChange(url: SafeUrl) {
    this.url = url;
    console.log(this.url);
  }


  getMember(member: any) {
    this.loading = true;

    this.crud.getList(`crud/members/${member}`).subscribe((response: any) => {
      this.members = [{
        name: response.name,
        email: response.email,
        phone: response.phone,
        address: response.address,
        birthDate: response.birthDate,
        gender: response.gender,
        observations: response.observations,
        key: response.key,
        profilePicture: response.profilePicture,
        createdBy: response.createdBy,
        tenantId: response.tenantId,
      }];

      this.members.forEach((member: any) => {
        member.birthDate = this.fun.transformDate(member.birthDate);
      });

      this.viewMember = true;

      this.loading = false;
    });
  }
  
  getImage(profilePicture: any) {
    try {
      this.upload.getImage(profilePicture).subscribe(
        (response) => {
          this.image.convertBlobToSafeUrl(response)
            .subscribe(
              (safeUrl) => {
                this.urlMember = safeUrl;
              },
              (error) => {
                throw error;
              }
            );
        },
        (error) => {
          throw error;
        }
      );
    } catch (error) {
      alert(error);
    }
  }

  /** ////////////////////////////////////////////// */

  switchModal(member: any) {
    this.displayModal = true;
    
    this.getMember(member.id);
    this.getImage(member.profilePicture);
  }
}
