import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotAuthorizedRoutingModule } from './not-authorized-routing.module';
import { NotAuthorizedComponent } from './not-authorized.component';

import { SharedModule } from '../shared';

@NgModule({
  imports: [
    CommonModule,
    NotAuthorizedRoutingModule,SharedModule
  ],
  declarations: [NotAuthorizedComponent]
})
export class NotAuthorizedModule { }
