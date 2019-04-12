import { Component, OnInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { Category, CategoryService, Result,SubCategoryService, Product, ProductService, FileDownloaderService, Requirement, SubCategory, Unit, RequirementService, UnitService, UserService } from '../../shared';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import {INgxMyDpOptions, IMyDateModel, NgxMyDatePickerDirective} from 'ngx-mydatepicker';


@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.css']
})
export class RequirementComponent implements OnInit {

  
  //object to store form data
  model:Requirement;
  
  cats:Category[];
  subCats:SubCategory[];
  products:Product[];
  units:Unit[];
  reqs: Requirement[];

  @ViewChild("requirementForm")
  requirementForm:FormGroup;

  @ViewChild("subcat")
  subcatSelect:ElementRef;

  @ViewChild("dp")
  datePicker:NgxMyDatePickerDirective;

  dateNotValid=false;

  today= new Date();
  day=this.today.getDate()-1;
  month=this.today.getMonth()+1;
  year=this.today.getFullYear();
  filter ={year: this.year, month: this.month, day: this.day};
  
  

  myOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    disableUntil: this.filter
};
  // Initialized to current date
  myDate: any;// = { jsdate: new Date() };

  subs: Subscription;
  
    constructor(private spinner:NgxSpinnerService,
      private notifier:AlertService,
      private categoryService:CategoryService,
      private subCategoryService:SubCategoryService,
      private productService:ProductService,
      private requirementService:RequirementService,
      private unitService:UnitService,
      private userService:UserService) { 
        this.model = new Requirement();
        this.cats= new Array();
        this.subCats=new Array();
        this.products=new Array();
        this.units=new Array();
        this.reqs=new Array();
        
       }
  
    ngOnInit() {
      this.spinner.show();  
      this.loadRequirements();
      this.categoryService.loadCategories()
          .subscribe((cats : Category[])=>{
            if(cats !=null && cats.length > 0)
                this.cats=cats;
           
          });
      this.spinner.hide();   
       
    }

public loadRequirements()
{
  this.requirementService.loadRequirements(this.userService.currentUser.id)
          .subscribe((reqs : Requirement[])=>{
            if(reqs !=null && reqs.length > 0)
                this.reqs=reqs;
           
          });
}

// optional date changed callback
onDateChanged(event: IMyDateModel): void {
  this.model.expectedPurchaseDate=event.date.year+"-"+event.date.month+"-"+event.date.day;
  console.log("expd: "+this.model.expectedPurchaseDate);
  if(this.datePicker.isDateValid)
     this.dateNotValid=false;
}


    ngOnDestroy()
    {
      if (this.subs !=null)
          this.subs.unsubscribe();
    
    }

   
    private  clear()
    {
      this.model = new Requirement();
      this.datePicker.clearDate();
      this.dateNotValid=false;
     
      
      for(let i in this.requirementForm.controls)
          this.requirementForm.controls[i].markAsUntouched();

         
    }

   
    public categorySelected()
    {
      this.spinner.show();  
      console.log(this.model.category+" is selected.");
      this.subCategoryService.load(this.model.category)
          .subscribe((subCats : SubCategory[])=>{
            if(subCats !=null && subCats.length > 0)
            {
              
               this.subCats = subCats;
              }   
            else
            {
               this.subCats = new Array();   
               this.products = new Array();
            }  
            this.spinner.hide();
             console.log("Model is :"+JSON.stringify(this.model));
            

          });
    }
    public subCategorySelected()
    {
      this.spinner.show();  
      console.log(this.model.subCategory+" is selected.");
      this.productService.load(this.model.category,this.model.subCategory)
          .subscribe((prods : Product[])=>{

            if(prods !=null && prods.length > 0)
            {
           
            this.products = prods;
            this.model.product=this.products[0].product;
            this.productSelected();
            }
         else
            this.products = new Array();

            this.spinner.hide();  
            console.log("Model is :"+JSON.stringify(this.model));
          });
    }
    
    public productSelected()
    {
      console.log(this.model.product+" is selected.");
      this.unitService.loadUnit(
        this.model.category,this.model.subCategory,
        this.model.product).subscribe((unit)=>{
          this.model.unit=unit.unit;
          console.log(this.model.unit+" is loaded.");
          console.log("Model is :"+JSON.stringify(this.model));
        });
    }
    public seriousnessSelected()
    {
      console.log(this.model.seriousness+" is selected.");
      console.log("Model is :"+JSON.stringify(this.model));
    }
    public addRequirement()
    {
      
    if(this.requirementForm.invalid || !this.datePicker.isDateValid())
    {
    

      console.log('marking the form touched.');
        for(let i in this.requirementForm.controls)
        this.requirementForm.controls[i].markAsTouched();

        //displaying date validation message
        if(!this.datePicker.isDateValid())
            this.dateNotValid=true;

    }
    else 
    { 
    
    this.dateNotValid=false;  
    this.spinner.show();  
    
    this.model.userId=this.userService.currentUser.id;
    console.log("Model is :"+JSON.stringify(this.model));
    this.subs=this.requirementService.saveRequirement(this.model).subscribe(
      (result:Result)=>{
        this.spinner.hide();
        
        if(result.code  == 100)
        {
          this.notifier.success("Successfully saved.");
          this.loadRequirements(); 
          this.clear();
        }
        else if(result.code  == 200)
        {
          this.notifier.danger(
            "Please upgrade your account to post more than "+
            environment.Free_Limit+" requirements.");
          
        }
        else
        this.notifier.danger("The requirement is already posted.");
      }); 
    }
    
    
    }
    
    
}
