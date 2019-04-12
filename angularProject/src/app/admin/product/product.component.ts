import { Component, OnInit, ViewChild } from '@angular/core';
import { Category, CategoryService, Result, BulkResult, Product, ProductService, SubCategory, SubCategoryService, FileDownloaderService } from '../../shared';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  fileToBeUploaded:File; 
  
  fileNotSelected:boolean=false;

  //object to store form data
  model:Product;
  
  cats:Category[];
  subCats:SubCategory[];
  products:Product[];

  @ViewChild("productForm")
  productForm:FormGroup;
  
  @ViewChild('fileToUpload')
  fileInput: any;
  
  subs: Subscription;
  
    constructor(private spinner:NgxSpinnerService,
      private notifier:AlertService,
      private categoryService:CategoryService,
      private subCategoryService:SubCategoryService,
      private productService:ProductService,
      private downloaderService:FileDownloaderService) { 
        this.model = new Product();
        this.cats= new Array();
        this.subCats=new Array();
        this.products=new Array();
      }
  
    ngOnInit() {
      this.spinner.show();  
      this.categoryService.loadCategories()
          .subscribe((cats : Category[])=>{
            if(cats !=null && cats.length > 0)
              this.cats=cats;

          });
      this.loadProducts();    
      this.spinner.hide(); 
    }

    loadProducts()
    {
      
      this.productService.loadAll()
          .subscribe((products : Product[])=>{
            
            if(products != null && products.length > 0)
               this.products=products;
            else
               this.products=new Array();   

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
            this.spinner.hide();
            if(subCats.length > 0)
                this.subCats = subCats;
            else
                this.subCats=new Array();    
            
          });
    }

    public subCategorySelected()
    {
      console.log(this.model.subCategory+" is selected.");
      
    }
    public addProduct()
    {
    if(this.productForm.invalid)
    {
    
      console.log('marking the form touched.');
        for(let i in this.productForm.controls)
        this.productForm.controls[i].markAsTouched();
    }
    else
    { 
    this.spinner.show();  
    
    console.log("Saving sub categories...");
    this.subs=this.productService.save(this.model).subscribe(
      (result:Result)=>{
        this.spinner.hide();
        
        if(result.code  == 100)
        {
          this.notifier.success("Successfully added.");
          this.loadProducts(); 
        }
        else if(result.code  == 200)
        {
          this.notifier.danger("This category, sub category, and product combination is already added.");
          
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
  
    public uploadProducts()
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
            this.subs = this.productService.uploadFile(this.fileToBeUploaded)
            .subscribe(  (result:BulkResult) => {
               if(result.code == 100)
               {
                 this.notifier.success(result.count+" products are successfully added");
                 this.loadProducts(); 
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
      else
      {
        this.fileNotSelected=true;
      }  
    }

    public downloadProducts()
    {
      console.log("downloading products...");
      this.spinner.show();  
      this.downloaderService.downloadFile("downloadProducts").subscribe(blob =>{
        var blob = new Blob([blob], { type: 'application/vnd.ms-excel'});
        
        console.log("creating url...");
        var url= window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = "products.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
        this.spinner.hide();  
      });
    
    
    }

}
