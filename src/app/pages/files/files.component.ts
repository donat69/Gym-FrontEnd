import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FileUploadService } from '../../services/file-upload.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
})
export class FilesComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  result : any;

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    public auth: AuthService,
    private uploadService: FileUploadService
  ) {}

  ngOnInit() {}

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.uploadPhoto(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.fun.presentAlert(event.body.message);
              this.result = event.body.name;
            }
          },
          (error: any) => {
            this.progress = 0;

            if (error.error && error.error.message) {
              this.fun.presentAlertError(error.error.message);
            } else {
              this.fun.presentAlertError('Could not upload the file!');
            }
            
            this.currentFile = undefined;
          }
        );
      }

      this.selectedFiles = undefined;
    }
  }

  download(e: any) {
    window.open(`${environment.url}file/download/${e}`);
  }

}
