import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../shared';
import { UserComponent } from './user.component';
import { RequirementComponent } from './requirement';
import { SearchComponent } from './search';

const routes: Routes = [
    {
        path: '', component: UserComponent,
   
    children :[
        {
            path:"", component:DashboardComponent
        },
        {
            path:"requirement", component:RequirementComponent
        },
        {
            path:"search", component:SearchComponent
        }
    ]
}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
