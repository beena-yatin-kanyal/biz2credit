import { Component, OnInit, ViewChild } from '@angular/core';
import { Category, CategoryService, Result, BulkResult, SubCategory, SubCategoryService, FileDownloaderService } from '../../shared';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})
export class SubcategoryComponent implements OnInit {

  fileToBeUploaded:File; 

  fileNotSelected:boolean=false;

  //object to store form data
  model:SubCategory;
  
  cats:Category[];
  subcats:SubCategory[];

  @ViewChild("subCategoryForm")
  subCategoryForm:FormGroup;
  
  @ViewChild('fileToUpload')
  fileInput: any;
  
  subs: Subscription;
  
    constructor(private spinner:NgxSpinnerService,
      private notifier:AlertService,
      private categoryService:CategoryService,
      private subCategoryService:SubCategoryService,
      private downloaderService:FileDownloaderService) { 
        this.model = new SubCategory();
        this.cats= new Array();
        this.subcats=new Array();
      }
  
    ngOnInit() {
      this.spinner.show();  
      this.categoryService.loadCategories()
          .subscribe((cats : Category[])=>{
            this.spinner.hide();
            if(cats != null && cats.length > 0)
            this.cats=cats;
            else
            this.cats=new Array();

          });
      this.loadSubCategories();     
    }
    public loadSubCategories()
    {
      this.spinner.show();  
      this.subCategoryService.loadAll()
          .subscribe((subcats : SubCategory[])=>{
            this.spinner.hide();
            if(subcats !=null && subcats.length > 0)
            this.subcats=subcats;
            else
            this.subcats=new Array();

          });
    }
    ngOnDestroy()
    {
      if (this.subs !=null)
          this.subs.unsubscribe();
    
    }
  
    public categorySelected()
    {
      console.log(this.model.category+" is selected.");
    }


    public addSubCategory()
    {
    if(this.subCategoryForm.invalid)
    {
    
      console.log('marking the form touched.');
        for(let i in this.subCategoryForm.controls)
        this.subCategoryForm.controls[i].markAsTouched();
    }
    else
    { 
    this.spinner.show();  
    
    console.log("Saving sub categories...");
    this.subs=this.subCategoryService.save(this.model).subscribe(
      (result:Result)=>{
        this.spinner.hide();
        
        if(result.code  == 100)
        {
          this.notifier.success("Successfully added.");
          this.loadSubCategories();
        }
        else if(result.code  == 200)
        {
          this.notifier.danger("This category and sub category combination is already added.");
          
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
  

  public uploadSubCategories()
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
          this.subs = this.subCategoryService.uploadFile(this.fileToBeUploaded)
          .subscribe(  (result:BulkResult) => {
             if(result.code == 100)
             {
               this.notifier.success(result.count+" sub categories are successfully added");
               this.loadSubCategories();
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


    public downloadSubCategories()
    {
      console.log("downloading sub categories...");
      this.spinner.show();  
      this.downloaderService.downloadFile("downloadSubCategories").subscribe(blob =>{
        var blob = new Blob([blob], { type: 'application/vnd.ms-excel'});
        
        console.log("creating url...");
        var url= window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = "subcategory.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
        this.spinner.hide();  
      });
    
    
    }

}
