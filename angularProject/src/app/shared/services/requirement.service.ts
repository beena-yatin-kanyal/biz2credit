import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Result } from '../entities/result';
import { environment } from '../../../environments/environment';
import { Requirement, GeoAddress, GeoNames, GeoNamesResult, RequirementResult} from '../entities';

@Injectable()
export class RequirementService
{

    

    http:HttpClient;
    api_prefix="http://api.geonames.org/findNearbyPlaceNameJSON?formatted=true&lat=";
    api_mid="&lng=";
    api_suffix="&radius="+environment.Area_Range+"&username=c2cunion&style=full";

    public constructor(httpService : HttpClient)
    {
     this.http=httpService;
    }

public saveRequirement(requirement:Requirement):Observable<Result>
  {

    const url=environment.Services_URL+"saveRequirement";
    console.log("sending request to "+url );
    console.log("to save: "+JSON.stringify(requirement));
    return this.http.post<Result>(url,requirement);
    
  }

  public loadRequirements(userId:number):Observable<Requirement[]>
  {

    const url=environment.Services_URL+"requirements?userId="+userId;
    console.log("sending request to "+url );
    return this.http.get<Requirement[]>(url);
    

  }

  public reqsByProduct(userId:number,product:String,loc:String[]):Observable<RequirementResult[]>
  {

    const url=environment.Services_URL+"reqsByProduct";
    console.log("sending request to "+url );
    return this.http.post<RequirementResult[]>(url,{'userId':userId,'value':product,'locations':loc});
    

  }
  public reqsByCategory(userId:number,category:String,loc:String[]):Observable<RequirementResult[]>
  {

    const url=environment.Services_URL+"reqsByCategory";
    console.log("sending request to "+url );
    return this.http.post<RequirementResult[]>(url,{'userId':userId,'value':category,'locations':loc});
   
  }
  public reqsBySubCategory(userId:number,subcategory:String,loc:String[]):Observable<RequirementResult[]>
  {

    const url=environment.Services_URL+"reqsBySubCategory";
    console.log("sending request to "+url );
    return this.http.post<RequirementResult[]>(url,{'userId':userId,'value':subcategory,'locations':loc});
    

  }


  public nearByPlaces(lat:number,lng:number):Observable<GeoNamesResult>
  {
    var api_url = this.api_prefix+lat+this.api_mid+lng+this.api_suffix;
    console.log("api url is: "+api_url);
    return this.http.get<GeoNamesResult>(api_url);
  }
  public geoCode(location:string):Observable<GeoAddress>
  {
    var api_url = "https://maps.googleapis.com/maps/api/geocode/json?&address="+location+"&key=AIzaSyCYr5BgzrJ56gOcPNcFW1fql0eLenqLbr8";
    //return this.http.get(api_url, { responseType: 'text' });
    
    return this.http.get<GeoAddress>(api_url);
  }
}