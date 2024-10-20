import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { MainWrapperComponent } from '../shared-components/main-wrapper/main-wrapper.component';
import { NavigationComponent } from '../shared-components/navigation/navigation.component'
import { FooterComponent } from '../shared-components/footer/footer.component';
import { HouseKeepingWrapperComponent } from './house-keeping-wrapper/house-keeping-wrapper.component';
import { AccountingWrapperComponent } from './accounting-wrapper/accounting-wrapper.component';



@NgModule({
  declarations: [
    MainWrapperComponent,
    NavigationComponent,
    FooterComponent,
    HouseKeepingWrapperComponent,
    AccountingWrapperComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    MainWrapperComponent,
    NavigationComponent,
    FooterComponent,
    HouseKeepingWrapperComponent,
    AccountingWrapperComponent
  ]
})
export class SharedComponentsModule { }
