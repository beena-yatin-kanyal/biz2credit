import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../entities/contact';
import { Result } from '../entities/result';
import { BulkResult } from '../entities/bulk-result';
import { environment } from '../../../environments/environment';
import { SubCategory  } from '../../shared';


@Injectable()
export class SubCategoryService
{

    http:HttpClient;
    

    public constructor(httpService : HttpClient)
    {
     this.http=httpService;
    }

public save(sub:SubCategory):Observable<Result>
  {

    const url=environment.Services_URL+"saveSubCategory";
    console.log("sending request to "+url );
    return this.http.post(url,sub).
    map((data:Result) => {
      console.log('Following response is received: '+ data.code);
      return data;
    });

  }

  public load(category:string):Observable<SubCategory[]>
  {

    const url=environment.Services_URL+"subCategories/"+category;
    console.log("sending request to "+url );
    return this.http.get(url).
    map((data:SubCategory[]) => {
      console.log('Following response is received: '+ 
        JSON.stringify(data));
      return data;
    });

  }

  public loadAll():Observable<SubCategory[]>
  {

    const url=environment.Services_URL+"subCategories";
    console.log("sending request to "+url );
    return this.http.get(url).
    map((data:SubCategory[]) => {
      console.log('Following response is received: '+ 
        JSON.stringify(data));
      return data;
    });

  }


  public uploadFile(fileToUpload: File): Observable<BulkResult> {
    const endpoint = environment.Services_URL+"bulkSubCategory";
    console.log("sending request to "+endpoint);
    const formData: FormData = new FormData();
      formData.append('file', fileToUpload);
    return this.http
      .post(endpoint, formData)
      .map((result:BulkResult) => { return result; });
      
}
}