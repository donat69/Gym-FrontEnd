import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  stateOptions: any[] = [
    { label: 'YES', value: 'true' },
    { label: 'NO', value: 'false' }
  ];
  
  constructor(
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    private crud: CrudService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      appName: ['', Validators.required],
      email: ['', ValidationService.emailValidator],
      phone: [''],
      address: [''],
      showLogo: ['', Validators.required],
      showFooter: ['', Validators.required],
      colorTheme: ['', Validators.required]
    });

    this.crud.callSettings().subscribe((res: any) => {
      this.form.get('appName').setValue(res.appName);
      this.form.get('email').setValue(res.email);
      this.form.get('phone').setValue(res.phone);
      this.form.get('address').setValue(res.address);
      this.form.get('showLogo').setValue(res.showLogo.toString());
      this.form.get('showFooter').setValue(res.showFooter.toString());
      this.form.get('colorTheme').setValue(res.colorTheme);

      this.form.markAsDirty();
    });
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      this.update();
    } else {
      for (let i in this.form.controls)
        this.form.controls[i].markAsTouched();
    }
  }

  update() {
    this.loading = true;

    this.crud.update('settings/1', this.form.value).subscribe(() => {
      this.loading = false;
      this.fun.presentAlert("Settings updated successfully!");
      
      window.location.reload();
    });
  }  

}
