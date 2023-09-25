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

        // if there's no token, redirect the user to the login page or another appropriate page
        this.router.navigate(['/login']);
        return false;
    }
}
