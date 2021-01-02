import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth-service';
import { Router } from '@angular/router'

@Injectable()
export class PreventLoggedInAccess implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    var isAuth = this.authService.getIsAuth()
    if (isAuth) this.router.navigate(['/user']);
    return !isAuth;
  }
}
