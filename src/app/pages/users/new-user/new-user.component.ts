import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';
import { hash } from 'bcryptjs';
import { CrudService } from 'src/app/services/crud.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  user: any = {
    id: ''
  };
  tenants: any[] = [];

  messages: Message[];

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private crud: CrudService
  ) {
    this.api.get(`crud/tenants`).subscribe((data: any) => {
      this.tenants = Object.keys(data).map(key => data[key]);
    });

    this.messages = [];
  }

  ngOnInit() {
    let passwordValidators = [];

    if (!this.activatedRoute.snapshot.paramMap.get('id')) {
      // Si no hay un parámetro "id" en la URL, significa que se está creando un nuevo usuario
      passwordValidators.push(Validators.required, Validators.minLength(6));
    }

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', passwordValidators],
      phone: [''],
      role: ['', Validators.required],
      tenantId: [''],
    });
  
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getUser(this.activatedRoute.snapshot.paramMap.get('id'));
    }

    this.messages = [
      { severity: 'info', summary: '', 
      detail: 'If you are creating a user with the role of ADMIN or STAFF, make sure to select the corresponding gym. However, if it is a SUPERADMIN user, do not select any gym as they will have unrestricted access to the entire system.' },
      /**
       * detail: 'Si crearás un usuario con el rol de ADMIN o STAFF, asegúrate de seleccionar el gimnasio al que pertenece. O si es un usuario SUPERADMIN, no selecciones ningún gimnasio ya que este tendrá acceso a todo el sistema sin restricciones.' },
       */
    ];
  }  

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.user.id) {
        this.update();
      } else {
        this.save();
      }
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  save() {
    this.loading = true;
    const formValue = this.form.value;

    // Eliminar el campo tenantId si no tiene valor
    if (formValue.tenantId === '') {
      delete formValue.tenantId;
    }
  
    // Encriptar la contraseña antes de guardarla
    if (formValue.password) {
      hash(formValue.password, 10, (error, hashedPassword) => {
        if (error) {
          this.loading = false;
          this.fun.presentAlertError('Failed to hash password');
          return;
        }
  
        formValue.password = hashedPassword;
  
        this.api.post('crud/users', formValue).subscribe({
          complete: () => {},
          error: (error) => {
            this.loading = false;
            this.fun.presentAlertError(
              error.error.message ||
                error.error.sqlMessage ||
                'Something went wrong. Try again.'
            );
          },
          next: (response) => {
            this.loading = false;
            this.fun.presentAlert("Saved");
            this.router.navigateByUrl('users/list');
          },
        });
      });
    } else {
      this.api.post('crud/users', formValue).subscribe({
        complete: () => {},
        error: (error) => {
          this.loading = false;
          this.fun.presentAlertError(
            error.error.message ||
              error.error.sqlMessage ||
              'Something went wrong. Try again.'
          );
        },
        next: (response) => {
          this.loading = false;
          this.fun.presentAlert("Saved");
          this.router.navigateByUrl('users/list');
        },
      });
    }
  }

  update() {
    this.loading = true;
    const formValue = this.form.value;
  
    // Encriptar la contraseña antes de actualizarla
    if (formValue.password) {
      hash(formValue.password, 10, (error, hashedPassword) => {
        if (error) {
          this.loading = false;
          this.fun.presentAlertError('Failed to hash password');
          return;
        }
  
        formValue.password = hashedPassword;
        
        // Actualizar el usuario
        this.api.put(`crud/users/${this.user.id}`, formValue).subscribe({
          complete: () => {},
          error: (error) => {
            this.loading = false;
            this.fun.presentAlertError(
              error.error.message ||
                error.error.sqlMessage ||
                'Something went wrong. Try again.'
            );
          },
          next: (response) => {
            this.loading = false;
            this.fun.presentAlert("Updated");
            this.router.navigateByUrl('users/list');
          },
        });
      });
    } else {
      // Eliminar el campo password si no tiene valor
      delete formValue.password;
      
      // Actualizar el usuario sin encriptar la contraseña
      this.api.put(`crud/users/${this.user.id}`, formValue).subscribe({
        complete: () => {},
        error: (error) => {
          this.loading = false;
          this.fun.presentAlertError(
            error.error.message ||
              error.error.sqlMessage ||
              'Something went wrong. Try again.'
          );
        },
        next: (response) => {
          this.loading = false;
          this.fun.presentAlert("Updated");
          this.router.navigateByUrl('users/list');
        },
      });
    }
  }  

  getUser(id: any) {
    this.loading = true;

    this.crud.getListNormal(`crud/users/${id}`).subscribe((response: any) => {
      this.user = response;
      
      this.form.markAsDirty();
      this.form.get('name').setValue(this.user.name);
      this.form.get('email').setValue(this.user.email);
      this.form.get('phone').setValue(this.user.phone);
      this.form.get('role').setValue(this.user.role);
      this.form.get('tenantId').setValue(this.user.tenantId);

      this.loading = false;
    });
  }

}
