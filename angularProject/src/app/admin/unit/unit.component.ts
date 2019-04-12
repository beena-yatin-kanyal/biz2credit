import { Component, OnInit, ViewChild } from '@angular/core';
import { Category, CategoryService, Result, BulkResult, Unit, UnitService, SubCategory, SubCategoryService, Product, ProductService, FileDownloaderService } from '../../shared';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

  fileToBeUploaded:File; 
  fileNotSelected:boolean=false;
  //object to store form data
  model:Unit;
  
  cats:Category[];
  subCats:SubCategory[];
  products:Product[];
  units:Unit[];

  @ViewChild("unitForm")
  unitForm:FormGroup;
  
  @ViewChild('fileToUpload')
  fileInput: any;
  
  subs: Subscription;
  
    constructor(private spinner:NgxSpinnerService,
      private notifier:AlertService,
      private categoryService:CategoryService,
      private subCategoryService:SubCategoryService,
      private productService:ProductService,
      private unitService:UnitService,
      private downloaderService:FileDownloaderService) { 
        this.model = new Unit();
        this.cats= new Array();
        this.subCats=new Array();
        this.products=new Array();
        this.units=new Array();
      }
  
    ngOnInit() {
      this.spinner.show();  
      this.categoryService.loadCategories()
          .subscribe((cats : Category[])=>{
            if(cats !=null && cats.length > 0)
                this.cats=cats;
           
          });
      this.loadUnits(); 
      this.spinner.hide();    
    }

   loadUnits()
   {
    
    this.unitService.loadAll()
        .subscribe((units : Unit[])=>{
           if(units !=null && units.length > 0)
              this.units=units;
            else
              this.units=new Array();  
          });

   }

    ngOnDestroy()
    {
      if (this.subs !=null)
          this.subs.unsubscribe();
    
    }
  
    public categorySelected()
    {
      this.spinner.show();  
      console.log(this.model.category+" is selected.");
      this.subCategoryService.load(this.model.category)
          .subscribe((subCats : SubCategory[])=>{
            if(subCats !=null && subCats.length > 0)
               this.subCats = subCats;
            else
            {
               this.subCats = new Array();   
               this.products = new Array();
            }  
            this.spinner.hide();

          });
    }
    public subCategorySelected()
    {
      this.spinner.show();  
      console.log(this.model.subCategory+" is selected.");
      this.productService.load(this.model.category,this.model.subCategory)
          .subscribe((prods : Product[])=>{

            if(prods !=null && prods.length > 0)
            this.products = prods;
         else
            this.products = new Array();
            this.spinner.hide();  
          });
    }
    public productSelected()
    {
      console.log(this.model.product+" is selected.");
      
    }

    public addUnit()
    {
    if(this.unitForm.invalid)
    {
    
      console.log('marking the form touched.');
        for(let i in this.unitForm.controls)
        this.unitForm.controls[i].markAsTouched();
    }
    else
    { 
    this.spinner.show();  
    
    console.log("Saving units...");
    this.subs=this.unitService.save(this.model).subscribe(
      (result:Result)=>{
        this.spinner.hide();
        
        if(result.code  == 100)
        {
          this.notifier.success("Successfully added.");
          this.loadUnits(); 
        }
        else if(result.code  == 200)
        {
          this.notifier.danger("This category, sub category, product and unit combination is already added.");
          
        }
        else
        this.notifier.danger("Sorry we are having some issue on the server, please try again later.");
      }); 
    }
    }
    
    uploadFileChanged(files: FileList)
    {
     this.fileToBeUploaded=this.fileInput.nativeElement.files[0];
       
    }
  
    public uploadUnits()
    {
      if(this.fileToBeUploaded !=null)  
      { 
          this.fileNotSelected=false;
          let fname:string = this.fileToBeUploaded.name;
          console.log("File name is: "+fname);
          let ext=fname.substring(fname.indexOf('.')+1);
          ext=ext.toLocaleLowerCase();
          console.log("extension is: "+ext);
          if (ext === "xlsx" || ext === "xls") 
          {
            console.log("Is an excel file, uploading it...");
            this.subs = this.unitService.uploadFile(this.fileToBeUploaded)
            .subscribe(  (result:BulkResult) => {
               if(result.code == 100)
               {
                 this.notifier.success(result.count+" units are successfully added");
                 this.loadUnits(); 
               }
               else if(result.code == 200)
               {
                 this.notifier.danger("Invalid file format, download sample file for the correct format.");
               }
               else 
               {
                 this.notifier.danger("Server error, try after some time.");
               }
             });  
          }
          else
          {
            this.notifier.danger("Only an Excel file is supported.");
          }
      }
      {
        this.fileNotSelected=true;
      }  

    }

    public downloadUnits()
    {
      console.log("downloading units...");
      this.spinner.show();  
      this.downloaderService.downloadFile("downloadUnits").subscribe(blob =>{
        var blob = new Blob([blob], { type: 'application/vnd.ms-excel'});
        
        console.log("creating url...");
        var url= window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = "units.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
        this.spinner.hide();  
      });
    
    }
}
