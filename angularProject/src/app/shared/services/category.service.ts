import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contact } from '../entities/contact';
import { Result } from '../entities/result';
import { BulkResult } from '../entities/bulk-result';
import { environment } from '../../../environments/environment';
import { Category,  } from '..';


@Injectable()
export class CategoryService
{

    http:HttpClient;
    

    public constructor(httpService : HttpClient)
    {
     this.http=httpService;
    }

public saveCategory(category:Category):Observable<Result>
  {

    const url=environment.Services_URL+"saveCategory";
    console.log("sending request to "+url );
    return this.http.post(url,category).
    map((data:Result) => {
      console.log('Following response is received: '+ data.code);
      return data;
    });

  }

  public loadCategories():Observable<Category[]>
  {

    const url=environment.Services_URL+"categories";
    console.log("sending request to "+url );
    return this.http.get(url).
    map((data:Category[]) => {
      console.log('Following response is received: '+ 
        JSON.stringify(data));
      return data;
    });

  }

  




  public uploadFile(fileToUpload: File): Observable<BulkResult> {
    const endpoint = environment.Services_URL+"bulkCategory";
    const formData: FormData = new FormData();
      formData.append('file', fileToUpload);
    return this.http
      .post(endpoint, formData)
      .map((result:BulkResult) => { return result; });
      
}
}