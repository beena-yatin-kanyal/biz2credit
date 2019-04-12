import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent} from '../shared';
import {AdminHeaderComponent} from './admin-header';
import { AdminComponent} from './admin.component';
import {CategoryComponent} from './category';
import {SubcategoryComponent} from './subcategory';
import { ProductComponent } from './product';
import { UnitComponent } from './unit';
import {UsersComponent} from './users';
const routes: Routes = [
    {
        path: '', component: AdminComponent,

        children :[
            {
                path:"", component:DashboardComponent 
            },
            {
                path:"category", component:CategoryComponent,
            },
            {
                path:"subcategory", component:SubcategoryComponent
            },
            {
                path:"products", component:ProductComponent
            },
            {
                path:"units", component:UnitComponent 
            },
            {
                path:"users", component:UsersComponent 
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}
