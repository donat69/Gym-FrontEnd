import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.css'],
})
export class LeftmenuComponent implements OnInit {
  route: any;
  manageRoute: any;
  environment = environment;
  
  constructor(
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public crud: CrudService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((routeParams) => {
      this.route = this.router.url;
    });
  }

  isOpen = true;
}
