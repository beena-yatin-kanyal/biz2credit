import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImageUrl } from '../entities';
import {environment} from '../../../environments/environment';

@Injectable()
export class FileUploaderService
{

    http:HttpClient;
    

    public constructor(httpService : HttpClient)
    {
     this.http=httpService;
    }

  public uploadFile(fileToUpload: File, mailId:string): Observable<ImageUrl> {
      const endpoint = environment.Services_URL+"uploadProfileImage";
      const formData: FormData = new FormData();
      formData.append('mailId',mailId);
      formData.append('file', fileToUpload);
      return this.http
        .post(endpoint, formData)
        .map((result:ImageUrl) => { return result; });
        
  }
  
}