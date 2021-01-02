import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router'

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate() {
    var isAdmin = document.cookie.split(';')[1].trim() === 'is_user=n'
    if (!isAdmin) this.router.navigate(['/user'])
    return isAdmin;
  }
}