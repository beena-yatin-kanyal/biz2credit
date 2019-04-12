//modules imports
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//google map service module import
import { AgmCoreModule } from '@agm/core';
//spinner module import
import { NgxSpinnerModule } from 'ngx-spinner';
//alert module import
import { AlertModule } from 'ngx-alerts';
//file uploader module
import { FileUploaderModule } from "ng4-file-upload";

//countdown module
import { CountdownTimerModule } from 'ngx-countdown-timer';
//captcha module import
import { BotDetectCaptchaModule } from 'angular-captcha';
import { FooterComponent, DashboardComponent, LogoutComponent} from './components';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import {Ng2Webstorage} from 'ngx-webstorage';

@NgModule({
  declarations: 
  [ 
    DashboardComponent,FooterComponent,LogoutComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCYr5BgzrJ56gOcPNcFW1fql0eLenqLbr8",
      libraries: ["places"]
    }),
    AlertModule.forRoot({maxMessages: 5, timeout: 10000}),
    BotDetectCaptchaModule.forRoot({
      captchaEndpoint: 'botdetectcaptcha',
    }),
    CommonModule,CountdownTimerModule.forRoot(),
    NgxMyDatePickerModule.forRoot(),
    FileUploaderModule,FormsModule,
    HttpClientModule,Ng2Webstorage,
    NgxSpinnerModule,RouterModule
    
  ],
  
  exports: [
    AgmCoreModule,AlertModule,BotDetectCaptchaModule,
    CommonModule,CountdownTimerModule,DashboardComponent,
    FileUploaderModule,NgxMyDatePickerModule,
    FooterComponent,FormsModule,HttpClientModule,
    LogoutComponent,NgxSpinnerModule,
    Ng2Webstorage,RouterModule]
})
export class SharedModule { }
