import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  authenticated: boolean = false;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authenticated = this.authService.getIsAuth();
    this.authService.getAuthStatusListener().subscribe((auth) => {
      this.authenticated = auth;
    })
  }

  logout(){
    this.authService.logout();
  }

}
