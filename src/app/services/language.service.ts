import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(
    private transloco: TranslocoService
  ) {}

  /**
   * Método para establecer el idioma activo del usuario y guardarlo en el local storage
   * @param lang idioma a establecer
   * @memberof LanguageService
   */
  public setActiveLanguage(lang: string): void {
    this.transloco.setActiveLang(lang);
    localStorage.setItem('selectedLang', lang);
  }

  /**
   * Método para obtener el idioma activo del usuario y si no existe, se establece el idioma por defecto
   * @returns {string} idioma activo
   * @memberof LanguageService
   */
  public getActiveLanguage(): string {
    const savedLang = localStorage.getItem('selectedLang');

    if (savedLang) {
      this.transloco.setActiveLang("es");
      return savedLang;
    } else {
      const defaultLang = 'en';
      
      localStorage.setItem('selectedLang', defaultLang);
      this.transloco.setActiveLang(defaultLang);
      return defaultLang;
    }
  }
  
}
