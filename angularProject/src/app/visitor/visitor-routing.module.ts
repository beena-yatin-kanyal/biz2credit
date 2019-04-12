import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IntroComponent} from './intro';
import {HowItWorksComponent} from './how-it-works';
import {LoginComponent} from './login';
import {RegisterComponent} from './register';
import {ContactUsComponent} from './contact-us';
import {FaqComponent} from './faq';
import {ForgotPasswordComponent} from './forgot-password';
import { VisitorComponent } from './visitor.component';
import { OtpVerificationComponent } from './otp-verification';
import {LoginRegisterComponent} from './login-register';
import {LoginWrapperComponent} from './login-wrapper';

const routes: Routes = [
{
    path: '', component: VisitorComponent,
    children :[
        { 
            path: '', redirectTo: 'home', pathMatch : 'full' 
        },
        { 
            path: 'home', component:IntroComponent 
        },
        {
            path:"contactUs", component:ContactUsComponent
        },
        {
            path:"howItWorks", component:HowItWorksComponent
        },
        {
            path:"faq", component:FaqComponent
        },
        {
            path:"login", component:LoginWrapperComponent
        },
        {
            path:"login-register", component:LoginRegisterComponent,
               children: 
                    [ 
                        {
                            path:"forgotPassword", component:ForgotPasswordComponent,
                            outlet: 'loginsection'
                        },
                        { 
                            path: '', component:LoginComponent,  outlet: 'loginsection'
                        },
                        {
                            path:"verifyOtp", component:OtpVerificationComponent
                        },
                        { 
                            path: '', component:RegisterComponent
                        }
                       
                    ]
        },
        
            
    ]
   }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    
    exports: [RouterModule]
})
export class VisitorRoutingModule {
}
