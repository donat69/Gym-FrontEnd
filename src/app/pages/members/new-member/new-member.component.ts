import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';
import { WebcamImage } from 'ngx-webcam';
import { EMPTY, Observable, Subject, catchError, map, mergeMap, of, take } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ImageService } from 'src/app/services/image.service';
import { CrudService } from 'src/app/services/crud.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-new-member',
  templateUrl: './new-member.component.html',
  styleUrls: ['./new-member.component.css']
})
export class NewMemberComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  member: any = {
    id: '',
  };

  previsualizacion: string = '';
  archivo: any = [];
  status: any = null;
  stream: any = null; 
  fileSelected = false;
  imageSelected = false;
  trigger: Subject<void> = new Subject();
  previewImage: string = '';
  showInput = false;

  counter: number = 0;
  
  selectedFiles?: FileList;
  currentFile?: File;
  generatedFileName: string = '';
  
  editMember: boolean = false;
  urlMember: any;

  messages: Message[];

  gyms: any[] = [];

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private upload: FileUploadService,
    private image: ImageService,
    private crud: CrudService
    ) {
      this.messages = [];

      this.api.get(`crud/gyms`).subscribe((data: any) => {
        this.gyms = Object.keys(data).map(key => data[key]);
      });
    }
    
    ngOnInit() {
      if (this.auth.hasRole(['SUPERADMIN'])) {
        this.form = this.formBuilder.group({
          name: ['', Validators.required],
          key: [''],
          email: ['', [Validators.required, ValidationService.emailValidator]],
          phone: ['', Validators.required],
          address: ['', Validators.required],
          birthDate: ['', Validators.required],
          gender: ['', Validators.required],
          observations: [''],
          profilePicture: [''],
          tenantId: ['', Validators.required],
        });
      } else {
        this.form = this.formBuilder.group({
          name: ['', Validators.required],
          key: [''],
          email: ['', [Validators.required, ValidationService.emailValidator]],
          phone: ['', Validators.required],
          address: ['', Validators.required],
          birthDate: ['', Validators.required],
          gender: ['', Validators.required],
          observations: [''],
          profilePicture: ['']
        });
      }
    
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getMember(this.activatedRoute.snapshot.paramMap.get('id'));
      this.editMember = true;
    }

    this.messages = [
      { severity: 'info', summary: '', 
      detail: 'If you choose to use an RFID card, you should enable the "Key" field and scan the cards code. However, if you choose not to use an RFID card, you should not enable the "Key" field as the member will be automatically assigned a Key upon saving.' }
      /**
       * detail: 'Si se opta por utilizar tarjeta RFID, se debe habilitar el campo "Key" y escanear el código de la tarjeta. Pero si se opta por no utilizar tarjeta RFID, no se debe habilitar el campo "Key" ya que al guardar el miembro se le asignará una Key automáticamente.' }
       */
    ];
  }
  
  toggleInput() {
    this.showInput = !this.showInput;
  }
  
  updateKey(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    if (value.length > 10) {
      value = value.substr(0, 10); // Limitar a 10 caracteres
    }
    this.form.controls['key'].setValue(value);
    this.calculateCounter(value);
  }  
  
  calculateCounter(value: string) {
    this.counter = value.length;
  }

  get $trigger(): Observable<void>{
    return this.trigger.asObservable();
  }

  snapshot(event: WebcamImage) {
    this.previewImage = event.imageAsDataUrl;
  }

  checkPermissions(){
    this.imageSelected = true;
    navigator.mediaDevices.getUserMedia({
      video: {
        width: 500,
        height: 500
      }
    }).then((res) => {
      this.stream = res;
      this.status = 'Connected...';
      /* this.status = 'Conectado...'; */
    }).catch(err => {
      if(err?.message === 'Permission denied'){
        this.status = 'Permission denied, please approve the camera permission.'
        /* this.status = 'Permiso denegado, por favor aprueba el permiso de la cámara.' */
      } else{
        this.status = 'Your camera is not available!'
        /* this.status = '¡Tú cámara no está disponible!' */
      }
    })
  }

  captureImage(){
    this.trigger.next();
  }

  download() {
    const link = document.createElement('a');
    link.download = 'image.png'; 
    link.href = this.previewImage; 

    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }, 0);
  }

  selectFile(event: any): void {
    this.fileSelected = true;
    this.selectedFiles = event.target.files;
    
    const archivoCapturado = event.target.files[0];
    
    this.image.extractBase64(archivoCapturado).then((Imagen: any) => {
      this.previsualizacion = Imagen.base;
    });
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.member.id) {
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
  
    const memberData = {
      ...this.form.value,
      createdBy: this.auth.user.id,
      profilePicture: this.form.value.profilePicture ? this.form.value.profilePicture.split('\\').pop() : '',
    }

    if (this.auth.hasRole(['SUPERADMIN'])) {
      memberData.tenantId = this.form.value.tenantId;
    } else {
      memberData.tenantId = this.auth.user.tenantId;
    }
  
    let uploadObservable: Observable<any> = of(null);
  
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
  
      if (file) {
        this.currentFile = file;
        uploadObservable = this.upload.upload(this.currentFile);
      }
    } else if (this.previewImage) {
      try {
        const blob = this.image.dataURItoBlob(this.previewImage, 'image/jpeg') as Blob;
        const file = new File([blob], 'file.jpg', {type: 'image/jpeg'});
  
        const newFile = new File([file], file.name, {
          type: file.type,
          lastModified: new Date().getTime()
        });
  
        if (newFile) {
          this.currentFile = newFile;
          uploadObservable = this.upload.upload(this.currentFile);
        }
      } catch (error) {
        throw error;
      }
    }
  
    uploadObservable.pipe(
      map((response: any) => {
        if (response) {
          memberData.profilePicture = response;
        }
        return memberData;
      }),
      mergeMap((data) => {
        return this.api.post('crud/members', data);
      }),
      catchError((error) => {
        this.loading = false;
        let errorMessage = 'Something went wrong. Try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error && error.error.sqlMessage) {
          errorMessage = error.error.sqlMessage;
        }
        this.fun.presentAlertError(errorMessage);
        return EMPTY;
      }), take(1) // Se usa para que no se suscriba más de una vez
    ).subscribe(() => {
      this.loading = false;
      this.fun.presentAlert("Saved");
      this.router.navigateByUrl('members/list');
    });
  }

  update() {
    this.loading = true;
  
    const updateData = {
      ...this.form.value,
      profilePicture: this.form.value.profilePicture ? this.form.value.profilePicture.split('\\').pop() : this.member.profilePicture,
    }
  
    let uploadObservable: Observable<any> = of(null);
  
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
  
      if (file) {
        this.currentFile = file;
        uploadObservable = this.upload.uploadID(this.currentFile, this.member.id);
      }
    } else if (this.previewImage) {
      try {
        const blob = this.image.dataURItoBlob(this.previewImage, 'image/jpeg') as Blob;
        const file = new File([blob], 'file.jpg', {type: 'image/jpeg'});
  
        const newFile = new File([file], file.name, {
          type: file.type,
          lastModified: new Date().getTime()
        });
  
        if (newFile) {
          this.currentFile = newFile;
          uploadObservable = this.upload.uploadID(this.currentFile, this.member.id);
        }
      } catch (error) {
        throw error;
      }
    }
  
    uploadObservable.pipe(
      map((response: any) => {
        if (response) {
          updateData.profilePicture = response;
        }
        return updateData;
      }),
      mergeMap((data) => {
        return this.api.put(`crud/members/${this.member.id}`, data);
      }),
      catchError((error) => {
        this.loading = false;
        let errorMessage = 'Something went wrong. Try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error && error.error.sqlMessage) {
          errorMessage = error.error.sqlMessage;
        }
        this.fun.presentAlertError(errorMessage);
        return EMPTY;
      }), take(1) // Se usa para que no se suscriba más de una vez
    ).subscribe(() => {
      this.loading = false;
      this.fun.presentAlert("Updated");
      this.router.navigateByUrl('members/list');
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

  deleteImage() {
    this.urlMember = null;
    this.form.get('profilePicture').setValue('');
    this.editMember = false;
  }

  getMember(id: any) {
    this.loading = true;

    this.crud.getListNormal(`crud/members/${id}`).subscribe((response: any) => {
      this.member = response;
      
      this.form.markAsDirty();
      this.form.get('name').setValue(this.member.name);
      this.form.get('key').setValue(this.member.key);
      this.form.get('email').setValue(this.member.email);
      this.form.get('phone').setValue(this.member.phone);
      this.form.get('address').setValue(this.member.address);
      this.form.get('birthDate').setValue(this.member.birthDate);
      this.form.get('gender').setValue(this.member.gender);
      this.form.get('observations').setValue(this.member.observations);

      if (this.activatedRoute.snapshot.paramMap.get('id')) {
        this.getImage(this.member.profilePicture);
      }

      this.loading = false;
    });
  }

}
