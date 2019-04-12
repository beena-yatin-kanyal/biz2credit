import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { UserGuard,AdminGuard } from './shared';

const routes: Routes = [
    { path: '', redirectTo: 'visitor', pathMatch : 'full'},
    { path: 'visitor', loadChildren: './visitor/visitor.module#VisitorModule'},
    { path: 'user', loadChildren: './user/user.module#UserModule', canActivate: [UserGuard]},
    { path: 'admin', loadChildren: './admin/admin.module#AdminModule',canActivate: [AdminGuard] },
    { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
    { path: 'not-authorized', loadChildren: './not-authorized/not-authorized.module#NotAuthorizedModule' },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes,{useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
