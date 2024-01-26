import { LoadingService } from './../../../services/loading.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { TranslocoService } from '@ngneat/transloco';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { timer, combineLatest } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  loading: boolean | undefined;
  lang: any;
  isDropdownOpen = false;
  isDropdownOpens = false;
  selectedCountry: any;
  selectedCountryImage: any;
  route : any;
  manageRoute : any;
  environment = environment;
  
  options = [
    { image: './assets/media/logos/flag-mex.png', lang: 'es', text: () => this.getTranslatedText('language.es') },
    { image: './assets/media/logos/flag-usa.png', lang: 'en', text: () => this.getTranslatedText('language.en') },
  ];

  @ViewChild('languageDropdown', { static: false })
  languageDropdown!: ElementRef;

  constructor(
    private language: LanguageService,
    private ts: TranslocoService,
    public auth : AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ls: LoadingService
  ) {}

  ngOnInit(): void {
    this.ls.show();
    this.activatedRoute.params.subscribe(routeParams => {
      this.route = this.router.url;
    });

    this.loadSelectedCountry();
    this.lang = this.language.getActiveLanguage();

    timer(1000).pipe(delay(1000)).subscribe(() => {
      this.ls.hide();
    });
  }

  private loadSelectedCountry(): void {
    this.ls.show();
    const selectedLang = this.language.getActiveLanguage();

    const selectedIndex = this.options.findIndex(option => option.lang === selectedLang);
    if (selectedIndex !== -1) {
      const selectedOption = this.options.splice(selectedIndex, 1)[0];
      this.options.splice(1, 0, selectedOption);
    }

    this.selectedCountryImage = localStorage.getItem('selectedCountryImage') || '';

    if (!this.selectedCountryImage) {
      this.selectedCountryImage = this.options.find(option => option.lang === selectedLang)?.image || '';
      localStorage.setItem('selectedCountryImage', this.selectedCountryImage);
    }

    this.selectedCountry = localStorage.getItem('selectedCountry') || 'English';

    timer(1000).pipe(delay(1000)).subscribe(() => {
      this.ls.hide();
    });
  }

  changeLang(lang: string): void {
    this.language.setActiveLanguage(lang);
  }

  getTranslatedText(key: string): string {
    return this.ts.translate(key);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.isDropdownOpens = false;
  }

  toggleDropdowns(): void {
    this.isDropdownOpens = !this.isDropdownOpens;
    this.isDropdownOpen = false;
  }

  selectCountry(image: string, lang: string): void {
    this.ls.show();
    this.changeLang(lang);

    const selectedIndex = this.options.findIndex(option => option.lang === lang);

    if (selectedIndex !== -1) {
      const selectedOption = this.options.splice(selectedIndex, 1)[0];
      this.options.splice(1, 0, selectedOption);
    }

    this.selectedCountryImage = image;

    localStorage.setItem('selectedCountryImage', this.selectedCountryImage);

    this.languageDropdown.nativeElement.click();

    timer(1000).pipe(delay(1000)).subscribe(() => {
      this.ls.hide();
    });
  }
}
