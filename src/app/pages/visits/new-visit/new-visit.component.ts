import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/models/member.model';
import { debounceTime } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-new-visit',
  templateUrl: './new-visit.component.html',
  styleUrls: ['./new-visit.component.css']
})
export class NewVisitComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  visit: any = {
    id: '',
  };
  searchResults: Member[] = [];
  members: any[] = [];
  dateNow = new Date();
  
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private crud: CrudService
  ) {
    this.api.getWithTenantID(`crud/members`, this.auth.user.tenantId).subscribe((data: any) => {
      this.members = Object.keys(data).map(key => data[key]);
    });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      memberId: ['', Validators.required],
    });

    this.form.controls['memberId'].valueChanges
    .pipe(debounceTime(300))
    .subscribe((value: string) => {
      this.searchMembers();
    });
    
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getVisit(this.activatedRoute.snapshot.paramMap.get('id'));
    }
  }
  
  searchMembers() {
    const searchTerm = this.form.controls.memberId.value;

    if (typeof searchTerm === 'string') {
      const searchTermLowerCase = searchTerm.toLowerCase();
      this.searchResults = this.members.filter((member: Member) =>
        member.name.toLowerCase().includes(searchTermLowerCase) || member.key.toLowerCase().includes(searchTermLowerCase)
      );
    } else {
      this.resetSearchResults();
    }
  }  

  selectMember(member: any) {
    this.selectMember = member;
    this.form.controls['memberId'].setValue(member.id);
    this.searchResults = [];
  }

  resetSearchResults() {
    this.searchResults = [];
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.visit.id) {
        this.update();
      } else {
        const selectedMemberName = this.form.controls['memberId'].value;
        const selectedMember = this.members.find(member => member.key === selectedMemberName);

        if (selectedMember) {
          this.form.controls['memberId'].setValue(selectedMember.id);
          this.save();
        } else {
          this.fun.presentAlertError('Member not found!');
        }
      }
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  save() {
    this.loading = true;

    const visitData = {
      ...this.form.value,
      tenantId: this.auth.user.tenantId,
      visitDate: this.dateNow,
    };

    this.crud.save('visits/visits', visitData).subscribe(() => {
      this.loading = false;
      this.fun.presentAlert("Saved");
      this.router.navigateByUrl('visits/list');
    });
  }

  update() {
    this.loading = true;

    this.crud.update(`visits/${this.visit.id}`, this.form.value).subscribe(() => {
      this.loading = false;
      this.fun.presentAlert("Updated");
      this.router.navigateByUrl('visits/list');
    });
  }

  getVisit(id: any) {
    this.loading = true;

    this.crud.getListNormal(`crud/visits/${id}`).subscribe((response: any) => {
      this.visit = response;

      this.form.markAsDirty();
      this.form.get('memberId').setValue(this.visit.memberId);

      this.loading = false;
    });
  }

}
