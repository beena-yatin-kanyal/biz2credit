import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared';
import { UserComponent } from './user.component';
import {UserHeaderComponent} from './user-header';
import { RequirementComponent } from './requirement';
import { SearchComponent } from './search';

@NgModule({
  imports: [
    UserRoutingModule,
    SharedModule
  ],
  declarations: [UserComponent,UserHeaderComponent,
  RequirementComponent, SearchComponent]
})
export class UserModule { }
