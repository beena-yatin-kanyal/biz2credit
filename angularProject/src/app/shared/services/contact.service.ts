import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../entities/contact';
import { Result } from '../entities/result';
import { environment } from '../../../environments/environment';


@Injectable()
export class ContactService
{

    http:HttpClient;
    

    public constructor(httpService : HttpClient)
    {
     this.http=httpService;
    }

public saveContactUs(contact:Contact):Observable<Result>
  {

    const url=environment.Services_URL+"contactUs";
    console.log("sending request to "+url );
    return this.http.post(url,contact).
    map((data:Result) => {
      console.log('Following response is received: '+ data.code);
      return data;
    });

  }
}