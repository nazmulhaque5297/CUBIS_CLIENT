import { Routes } from '@angular/router';
import { Path } from '../@core/structs/path.enum';
import { AuthGuard } from '../guard';
import { HomePageComponent } from '../pages/public/home-page/home-page.component';
import { SignInPageComponent } from '../pages/public/sign-in-page/sign-in-page.component';
import { ForgotPasswordPageComponent } from '../pages/public/forgot-password-page/forgot-password-page.component';
import { ChangePasswordComponent } from '../pages/public/change-password/change-password.component';

export const PUBLIC_ROUTES: Routes = [
  {
    path: Path.Home,
    component: HomePageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: Path.ChangePassword,
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
  },
  {
    path: Path.SignIn,
    component: SignInPageComponent,
  },
  {
    path: Path.ForgotPassword,
    component: ForgotPasswordPageComponent,
  },
];

export const PUBLIC_ROUTING_COMPONENTS = [
  HomePageComponent,
  SignInPageComponent,
  ForgotPasswordPageComponent,
  ChangePasswordComponent
];
