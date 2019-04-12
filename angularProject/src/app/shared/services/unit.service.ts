import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../entities/contact';
import { Result } from '../entities/result';
import { BulkResult } from '../entities/bulk-result';
import { environment } from '../../../environments/environment';
import { Unit} from '../../shared';


@Injectable()
export class UnitService
{

    http:HttpClient;
    

    public constructor(httpService : HttpClient)
    {
     this.http=httpService;
    }

public save(unit:Unit):Observable<Result>
  {

    const url=environment.Services_URL+"saveUnit";
    console.log("sending request to "+url );
    return this.http.post<Result>(url,unit);

  }

  public loadAll():Observable<Unit[]>
  {

    const url=environment.Services_URL+"units";
    console.log("sending request to "+url );
    return this.http.get<Unit[]>(url);

  }
  public loadUnit(cat:String,sub:String,product:String):Observable<Unit>
  {

    const url=environment.Services_URL+"units/"+cat+"/"+sub+"/"+product;
    console.log("sending request to "+url );
    return this.http.get<Unit>(url);

  }

  public uploadFile(fileToUpload: File): Observable<BulkResult> {
    const endpoint = environment.Services_URL+"bulkUnit";
    console.log("sending request to "+endpoint);
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    return this.http.post<BulkResult>(endpoint, formData);
      
      
}
}