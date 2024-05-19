import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BuscarGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    const searchParam = next.queryParams['s'];
    if (searchParam) {
      return this.router.createUrlTree(['/search'], { queryParams: { s: searchParam } });
    } else {
      return true;
    }
  }
}
