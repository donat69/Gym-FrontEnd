import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private domSanitizer: DomSanitizer
  ) {}

  convertBlobToSafeUrl(blob: Blob): Observable<SafeUrl> {
    return new Observable((observer) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        const safeUrl = this.domSanitizer.bypassSecurityTrustUrl(base64String);
        observer.next(safeUrl);
        observer.complete();
      };

      reader.onerror = (error) => {
        observer.error(error);
      };

      reader.readAsDataURL(blob);
    });
  }
  
  dataURItoBlob(dataURI: string, mimeString: string) {
    const splitDataURI = dataURI.split(',');
    const byteString = atob(splitDataURI[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([arrayBuffer], { type: mimeString });
  }

  async convertBase64(archivo: File): Promise<string> {
    const blob = new Blob([archivo], { type: archivo.type });
    const arrayBuffer = await blob.arrayBuffer();

    console.log(arrayBuffer); // ArrayBuffer { byteLength: 207 }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
  
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Jpeg = base64.replace(/^data:(.+\/)+[^;]+/, 'data:image/jpeg');
        resolve(base64Jpeg);
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  extractBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.domSanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };

      reader.onerror = error => {
        reject(error);
      };
    } catch (e) {
      reject(e);
    }
  });
  
}
