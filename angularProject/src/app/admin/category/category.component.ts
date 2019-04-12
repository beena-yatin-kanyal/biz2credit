import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { CategoryService, Category, Result, BulkResult, FileDownloaderService } from '../../shared';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {

fileToBeUploaded:File; 

fileNotSelected:boolean=false;

cats:Category[];

//object to store form data
model:Category;

@ViewChild("categoryForm")
categoryForm:FormGroup;

@ViewChild('fileToUpload')
fileInput: any;

subs: Subscription;

  constructor(private spinner:NgxSpinnerService,
    private notifier:AlertService,
    private categoryService:CategoryService,
    private downloaderService:FileDownloaderService) { 
      this.model = new Category();
      this.cats=new Array();
    }

  ngOnInit() {
    this.loadCategories();
  }
  ngOnDestroy()
  {
    if (this.subs !=null)
        this.subs.unsubscribe();
  
  }


  public loadCategories()
  {
    this.spinner.show();  
    this.categoryService.loadCategories()
        .subscribe((cats : Category[])=>{
          this.spinner.hide();
          if(cats != null && cats.length > 0)
          this.cats=cats;
          else
          this.cats=new Array();

        }); 
  }

  public addCategory()
  {
  if(this.categoryForm.invalid)
  {
  
    console.log('marking the form touched.');
      for(let i in this.categoryForm.controls)
      this.categoryForm.controls[i].markAsTouched();
  }
  else
  { 
  this.spinner.show();  
  
  console.log("Submitting login form...");
  this.subs=this.categoryService.saveCategory(this.model).subscribe(
    (result:Result)=>{
      this.spinner.hide();
      
      if(result.code  == 100)
      {
        this.notifier.success("Successfully added.");
        this.categoryForm.reset();
        this.loadCategories();
      }
      else if(result.code  == 200)
        {
          this.notifier.danger("This category is already added.");
          
        }
      else
      this.notifier.danger("Sorry we are having some issue on the server, please try again later.");
    }); 
  }
  }
  
  uploadFileChanged(files: FileList)
  {
   this.fileToBeUploaded = this.fileInput.nativeElement.files[0];
      
    
  }

  public uploadCategories()
  {
    
    if(this.fileToBeUploaded !=null)  
    { 
        this.fileNotSelected=false;
        console.log("uploading categories...");
        let fname:string = this.fileToBeUploaded.name;
        console.log("File name is: "+fname);
        let ext=fname.substring(fname.indexOf('.')+1);
        ext=ext.toLocaleLowerCase();
        console.log("extension is: "+ext);
        if (ext === "xlsx" || ext === "xls") 
        {
          console.log("Is an excel file, uploading it...");
          this.subs = this.categoryService.uploadFile(this.fileToBeUploaded)
          .subscribe(  (result:BulkResult) => {
             if(result.code == 100)
             {
               this.notifier.success(result.count+" categories are successfully added");
               this.loadCategories();
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
      console.log("no file is selected.");
      this.fileNotSelected=true;
    }

  }

public downloadCategories()
{
  console.log("downloading categories...");
  this.spinner.show();  
  this.downloaderService.downloadFile("downloadCategories").subscribe(blob =>{
    var blob = new Blob([blob], { type: 'application/vnd.ms-excel'});
    
    console.log("creating url...");
    var url= window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = "category.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element
    this.spinner.hide();  

    console.log("opening url...");
    //window.open(url);
    
  });


}

}
