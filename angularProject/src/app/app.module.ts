//modules imports
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//application routing module
import {AppRoutingModule} from './app-routing.module';
//components imports
import { AppComponent } from './app.component';
//browser animation module required by alert module 
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SharedModule, CategoryService, ProductService, UnitService, RequirementService, AdminGuard, UserGuard} from './shared'
import {ContactService, UserService, FileUploaderService,SubCategoryService} from './shared';
import {FileDownloaderService} from './shared';



@NgModule({
  declarations: [ AppComponent],
  imports: [
    BrowserModule, BrowserAnimationsModule,SharedModule,
    CommonModule, AppRoutingModule
  ],
  providers: [ContactService,UserService,
  FileDownloaderService,FileUploaderService,
  CategoryService,SubCategoryService,
  ProductService, RequirementService,
  UnitService,AdminGuard,UserGuard],
  bootstrap: [AppComponent]
 
})
export class AppModule { }
