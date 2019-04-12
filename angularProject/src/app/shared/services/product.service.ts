import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../entities/contact';
import { Result } from '../entities/result';
import { BulkResult } from '../entities/bulk-result';
import { environment } from '../../../environments/environment';
import { Product  } from '../../shared';


@Injectable()
export class ProductService
{

    http:HttpClient;
    

    public constructor(httpService : HttpClient)
    {
     this.http=httpService;
    }

public save(product:Product):Observable<Result>
  {

    const url=environment.Services_URL+"saveProduct";
    console.log("sending request to "+url );
    return this.http.post(url,product).
    map((data:Result) => {
      console.log('Following response is received: '+ data.code);
      return data;
    });

  }

  public load(cat:string,sub:string):Observable<Product[]>
  {

    const url=environment.Services_URL+"products/"+cat+"/"+sub;
    console.log("sending request to "+url );
    return this.http.get(url).
    map((data:Product[]) => {
      console.log('Following response is received: '+ 
        JSON.stringify(data));
      return data;
    });

  }

  public loadAll():Observable<Product[]>
  {

    const url=environment.Services_URL+"products";
    console.log("sending request to "+url );
    return this.http.get(url).
    map((data:Product[]) => {
      console.log('Following response is received: '+ 
        JSON.stringify(data));
      return data;
    });

  }


  public uploadFile(fileToUpload: File): Observable<BulkResult> {
    const endpoint = environment.Services_URL+"bulkProduct";
    console.log("sending request to "+endpoint);
    const formData: FormData = new FormData();
      formData.append('file', fileToUpload);
    return this.http
      .post(endpoint, formData)
      .map((result:BulkResult) => { return result; });
      
}
}