import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared';
import {AdminHeaderComponent} from './admin-header';
import { AdminComponent } from './admin.component';
import {RouterModule} from '@angular/router';
import { CategoryComponent } from './category';
import { SubcategoryComponent } from './subcategory';
import { ProductComponent } from './product';
import { UnitComponent } from './unit';
import {UsersComponent} from './users';
@NgModule({
  imports: [
    AdminRoutingModule,
    SharedModule
   
  ],
  declarations: [AdminHeaderComponent, AdminComponent,
  CategoryComponent, SubcategoryComponent,
  ProductComponent, UnitComponent, UsersComponent]
})
export class AdminModule { }
