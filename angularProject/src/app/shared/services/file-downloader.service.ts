import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class FileDownloaderService
{

    http:HttpClient;
    

    public constructor(httpService : HttpClient)
    {
     this.http=httpService;
    }

    public downloadFile(fileUrl:string):Observable<Blob>
    {
  
      const url=environment.Services_URL+fileUrl;
      console.log("sending request to "+url );
      
      return this.http.get(url, {responseType : 'blob'}).
      map((data:Blob) => {
              return data;
      });
  
    }
  
}