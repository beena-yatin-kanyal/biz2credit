import { Injectable } from '@angular/core';
import { User } from '../models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
@Injectable()
export class UserService {

  constructor(private http:HttpClient) { }
  userEndpoint="users";

  //Method to save the user
  saveUser(user:User):Observable<any>
  {
    let saveUrl=environment.apiUrl+this.userEndpoint;
    return this.http.post(saveUrl,user);
  }
}
