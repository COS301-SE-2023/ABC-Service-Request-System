import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        const token = this.authService.getToken();

        if (token) {
            return true;  // token exists, grant access to route
        }

        const currentUrl: string = window.location.href;

        if(currentUrl.includes('client'))
          this.router.navigate(['/client-login']);
        else
          this.router.navigate(['/login']);


        // if there's no token, redirect the user to the login page or another appropriate page
        return false;
    }
}
