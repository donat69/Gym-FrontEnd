import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.css']
})
export class EmailsComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  post: any = {
    id: '',
  };
  members: any[] = [];
  users: any[] = [];

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    public auth: AuthService,
    private crud: CrudService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      recipientType: ['', Validators.required],
      specificEmail: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const recipientType = this.form.value.recipientType;

    if (recipientType === 'members') {
      await this.loadMembers();
      this.sendMessage(this.members.map(member => member.email));
    } else if (recipientType === 'users') {
      await this.loadUsers();
      this.sendMessage(this.users.map(user => user.email));
    } else if (recipientType === 'specific') {
      const specificEmail = this.form.value.specificEmail;
      this.sendMessage([specificEmail]);
    }
  }

  sendMessage(emails: string[]) {
    this.loading = true;
    
    const emailsData = {
      ...this.form.value,
      emails: emails.join(',').trim(),
    }

    this.crud.save('email', emailsData).subscribe((response: any) => {
      this.loading = false;
      this.fun.presentAlert(response.message);
    });
  }

  async loadMembers() {
    return new Promise<void>((resolve, reject) => {
      this.api.getWithTenantID(`crud/members`, this.auth.user.tenantId).subscribe((data: any) => {
        this.members = Object.keys(data).map(key => data[key]);
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
  
  async loadUsers() {
    return new Promise<void>((resolve, reject) => {
      this.api.get(`crud/users`).subscribe((data: any) => {
        this.users = Object.keys(data).map(key => data[key]);
        resolve();
      }, error => {
        reject(error);
      });
    });
  }

}
