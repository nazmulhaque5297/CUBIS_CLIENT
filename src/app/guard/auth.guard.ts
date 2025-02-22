import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authenticationService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {    
        if (this.authenticationService.IsAuthenticated()) {            
            return true; 
        }                
        this.router.navigate(['/sign-in'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}