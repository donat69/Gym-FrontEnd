import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, catchError, from, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {

  constructor(
    private http: HttpClient,
  ) {}

  // Original method default
  uploadPhoto(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest(
      'POST',
      `${environment.url}file/photo`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: sessionStorage.getItem('access_token') as string,
        }),
      }
    );

    return this.http.request(req);
  }

  // This method receives the id of the member to whom the file belongs
  uploadID(file: File, id: number) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const headers = {
      'Authorization': sessionStorage.getItem('access_token') as string,
      'Content-Type': 'multipart/form-data'
    }

    const params = { 'id': id.toString() };

    return from(
      axios.post(`${environment.url}file/photo`, formData, { headers, params })
    ).pipe(
      map((response) => {
        const data = response.data;

        if (data && data.message && data.name) {
          return data.name;
        } else {
          throw new Error('Failed to upload file.');
        }
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  // This method creates a new file and returns the name of the file
  upload(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const headers = {
      'Authorization': sessionStorage.getItem('access_token') as string,
      'Content-Type': 'multipart/form-data'
    }

    return from(
      axios.post(`${environment.url}file/photo`, formData, { headers })
    ).pipe(
      map((response) => {
        const data = response.data;

        if (data && data.message && data.name) {
          return data.name;
        } else {
          throw new Error('Failed to upload file.');
        }
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  // This method returns the file name
  getImage(fileName: string): Observable<Blob> {
    const headers = {
      'Authorization': sessionStorage.getItem('access_token') as string
    };

    return this.http.get(`${environment.url}file/image/${fileName}`, {
      headers,
      responseType: 'blob' // Indica que se espera una respuesta binaria (blob)
    }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  // Returns the list of files
  getFiles(): Observable<any> {
    return this.http.get(`${environment.url}auth/users/files`);
  }

}
