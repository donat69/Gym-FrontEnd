import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { FunctionsService } from './services/functions.service';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoading = false;
  loading: boolean | undefined;

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private auth: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private gtmService: GoogleTagManagerService
  ) {
    this.gtmService.addGtmToDom();

    if (this.auth.getAccessToken()) {
      this.getUsers();
    }
  }

  ngOnInit() {
    this.router.events.forEach(item => {
      if (item instanceof NavigationEnd) {
        const gtmTag = {
          event: 'page',
          pageName: item.url
        };
        
        this.gtmService.pushTag(gtmTag);
      }
    });
    
    this.loadingService.getLoadingStatus().subscribe((loading: boolean) => {
      this.isLoading = loading;
    });
  }

  getUsers() {
    this.loading = true;

    this.api.post('auth/access-token/users', {
      'access_token': this.auth.getAccessToken()
    }).subscribe((response: any) => {
      this.loading = false;
      this.auth.setUser(response);
      this.auth.checkLogin();
      this.auth.startSessionCheck();
    }, error => {
      this.loading = false;
      this.router.navigate(['logout']);
    });
  }

}
