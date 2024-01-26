import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FunctionsService } from '../../../services/functions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  loading: boolean | undefined;
  
  constructor(
    public auth: AuthService,
    public fun: FunctionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.logout();
  }

  logout() {
    this.loading = false;

    this.auth.logout();
    
    this.router.navigateByUrl('/login');

    location.reload();
  }

}
