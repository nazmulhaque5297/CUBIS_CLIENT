import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './guard';
import { JwtInterceptor, ErrorInterceptor } from './helpers';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainWrapperComponent } from './components/main-wrapper/main-wrapper.component';

//ngrx
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './effects/user.effects';
import { DayStartProcessComponent } from './pages/public/day-start-process/day-start-process.component';
import { ChangePasswordComponent } from './pages/public/change-password/change-password.component';
import { DatePipe } from '@angular/common';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { AllMemberInformationComponent } from './pages/public/all-member-information/all-member-information.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    NavigationComponent,
    FooterComponent,
    MainWrapperComponent,
    DayStartProcessComponent,
    ChangePasswordComponent,
    AllMemberInformationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([UserEffects]),
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DatePipe,
    BsLocaleService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
