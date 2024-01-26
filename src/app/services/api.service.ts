import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  environment = environment;

  constructor(
    private http: HttpClient
  ) {}

  http_header() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: sessionStorage.getItem('access_token') as string,
        'Cache-Control': 'no-cache',
      }),
    };
  }

  get(data: string) {
    return this.http.get(environment.url + data, this.http_header());
  }

  getWithTenantID(data: string, tenantId: number) {
    let headers = this.http_header().headers;

    if (tenantId !== null) {
      headers = headers.append('x-tenant-id', tenantId.toString());
    }

    let params = new HttpParams()

    if (tenantId !== null) {
      params = params.set('tenantId', tenantId.toString());
    }

    return this.http.get(environment.url + data, { headers, params });
  }

  post(data: string, body: any) {
    return this.http.post(environment.url + data, body, this.http_header());
  }

  put(data: string, body: any) {
    return this.http.put(environment.url + data, body, this.http_header());
  }

  delete(data: string) {
    return this.http.delete(environment.url + data, this.http_header());
  }

  post_(data: string, body: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(environment.url + data, body, options);
  }

  post__(data: string, body: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(data, body, options);
  }

  get__(data: string) {
    return this.http.get(data);
  }

}
