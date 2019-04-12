import { NgModule } from '@angular/core';
import {IntroComponent} from './intro';
import {HowItWorksComponent} from './how-it-works';
import {LoginComponent} from './login';
import {RegisterComponent} from './register';
import {ContactUsComponent} from './contact-us';
import {FaqComponent} from './faq';
import {ForgotPasswordComponent} from './forgot-password';
import { VisitorRoutingModule } from './visitor-routing.module';
import {SharedModule} from '../shared';
import { VisitorComponent } from './visitor.component';
import {HeaderComponent} from './header';
import {HomeComponent} from './home';
import {OtpVerificationComponent} from './otp-verification';
import { LoginRegisterComponent } from './login-register';
import { LoginWrapperComponent } from './login-wrapper';


@NgModule({
  imports: [
    VisitorRoutingModule,
    SharedModule, 
   
  ],
  declarations: [
  IntroComponent,FaqComponent,
  HowItWorksComponent,LoginComponent,RegisterComponent,
  ContactUsComponent,ForgotPasswordComponent,VisitorComponent,
  HeaderComponent,HomeComponent,OtpVerificationComponent,
  LoginRegisterComponent, LoginWrapperComponent
  ]
 
})
export class VisitorModule { }
