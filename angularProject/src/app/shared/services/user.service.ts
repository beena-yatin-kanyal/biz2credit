import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { User } from '../entities/user';
import { Result } from '../entities/result';
import { Login } from '../entities/login';
import { UserProfile } from '../entities/user.profile';
import { environment } from '../../../environments/environment';
import {SessionStorageService} from 'ngx-webstorage';
@Injectable()
export class UserService 
{
    mobileOrEmail:string; //variable to mantain the state b/w login and forgot password
    
    baseUrl:string;
    currentUser:UserProfile;

    public constructor(
    private http : HttpClient,
    private storage:SessionStorageService)
    {
     this.baseUrl=environment.Services_URL;
     this.mobileOrEmail="";
     if(this.storage.isStorageAvailable())
      {
        this.currentUser=this.storage.retrieve('currentUser');

      }
    }

    public logout()
    {
      this.currentUser=null;
      if(this.storage.isStorageAvailable())
      {
        this.storage.clear();

      }
    }
    public login()
    {
      if(this.storage.isStorageAvailable())
      {
        this.storage.store("currentUser",this.currentUser);

      }

    }
public registerUser(user: User):Observable<Result>
  {

    const url=this.baseUrl+"register";
    console.log("sending request to "+url );
    return this.http.post(url,user).
    map((data:Result) => {
      console.log('Following response is received: '+ data.code);
      return data;
    });

  }

  public loadUsers():Observable<UserProfile[]>
  {

    const url=this.baseUrl+"users";
    console.log("sending request to "+url );
    return this.http.get<UserProfile[]>(url);

  }
  public toggleStatus(userId:number):Observable<Result>
  {

    const url=this.baseUrl+"toggle/"+userId;
    console.log("sending request to "+url );
    return this.http.get<Result>(url);

  }


  public updateProfile(user: UserProfile):Observable<Result>
  {

    const url=this.baseUrl+"updateProfile";
    console.log("sending request to "+url );
    return this.http.post<Result>(url,user);

  }


  public verifyOtp(otp:string):Observable<Result>
  {

    const url=this.baseUrl+"verifyOtp";
    console.log("sending request to "+url );
    return this.http.post<Result>(url,otp);

  }


  public resetPassword(emailOrPassword:string):Observable<Result>
  {

    const url=this.baseUrl+"passwordRecovery";
    console.log("sending request to "+url );
    return this.http.post<Result>(url,emailOrPassword);

  }


  public loginUser(login : Login):Observable<Result>
  {

    const url=this.baseUrl+"login";
    console.log("sending request to "+url );
    return this.http.post(url,login).
    map((data:UserProfile) => {
      console.log(JSON.stringify(data));
       if(data.status == 100)
       {
          this.currentUser=data;
          this.login();
          if(this.currentUser.profileImageUrl == null)
              this.currentUser.profileImageUrl=environment.API_URL+"uploads/images/no_profile.png";
          else
              this.currentUser.profileImageUrl=environment.API_URL+data.profileImageUrl;
   
          console.log("image url is: "+this.currentUser.profileImageUrl);    
       }         
        
      return {'code': data.status};
    });

  }
}