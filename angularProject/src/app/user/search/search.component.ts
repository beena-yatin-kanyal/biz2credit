import { Component, OnInit } from '@angular/core';
import { Requirement, RequirementService, UserService, RequirementResult, GeoNames, GeoNamesResult } from '../../shared';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import {Parser} from 'xml2js';
import {LocationResult} from '../../shared';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  reqs: Requirement[];
  model = {'criteria':''};
  searchResult: RequirementResult[];
  showResult:boolean;
  advance:boolean=false;
  cats:string[];
  subcats:string[];
  
  constructor(private spinner:NgxSpinnerService,
    private notifier:AlertService,
    private requirementService:RequirementService,
    private userService:UserService)
    
    { 
          this.reqs=new Array();
          this.searchResult=new Array();
          this.showResult=false;
          this.cats=new Array();
          this.subcats=new Array();
    }

    ngOnInit() {
      this.spinner.show();  
      this.loadRequirements();
      this.spinner.hide();   
       
    }
    initCatAndSubcats()
    {
      for(let req of this.reqs)
      {
        
        if(this.cats.indexOf(req.category) == -1)
           this.cats.push(req.category);

        if(this.subcats.indexOf(req.subCategory) == -1)
           this.subcats.push(req.subCategory);

      }
    }


    public toggleAdvanceSearch()
    {
      this.showResult=false;
      this.advance= !this.advance;
    }
    public loadRequirements()
    {
      this.requirementService.loadRequirements(this.userService.currentUser.id)
              .subscribe((reqs : Requirement[])=>{
                if(reqs !=null && reqs.length > 0)
                {
                    this.reqs=reqs;
                    this.initCatAndSubcats();
                }  
                if(reqs.length ==1)
                {
                  this.model.criteria=this.reqs[0].product;
                  this.searchByProduct(this.reqs[0]);
                }

              });
    }

    

    public searchByProduct(req)
    {
      let loc=this.userService.currentUser.location;
      console.log("Finding lat & lng of : "+loc);
      this.spinner.show();
      this.requirementService.geoCode(this.userService.currentUser.location)
        .subscribe(response => {
              let lat=response.results[0].geometry.location.lat;
              let lng=response.results[0].geometry.location.lng;
              console.log("Lat is: "+lat);
              console.log("Lng is: "+lng);
              console.log("obtaing near by places using the lat and lng");
             
              this.requirementService.nearByPlaces(lat,lng)
                    .subscribe((response:GeoNamesResult)=>{
                      console.log(response);
                      let locations=new Array();
                      for(let geoName of response.geonames)
                      {
                          locations.push(geoName.asciiName);
                          
                      }
                      
                      console.log(locations);   
                      //adding location of the current user to the locations array
                      locations.push(this.userService.currentUser.location);
                      console.log("obtaining products similar to "+this.model.criteria); 
                      this.requirementService.reqsByProduct(this.userService.currentUser.id ,this.model.criteria,locations)
                        .subscribe((data:RequirementResult[])=>{
                          
                            if(data !=null)
                                this.searchResult=data;
                            else
                                this.searchResult=new Array();

                            this.showResult=true;
                            this.spinner.hide();  
                }); 

                    });
                  
      });
    }   

      public searchByCategory(req)
      {
        let loc=this.userService.currentUser.location;
        console.log("Finding lat & lng of : "+loc);
        this.spinner.show();
        this.requirementService.geoCode(this.userService.currentUser.location)
          .subscribe(response => {
                let lat=response.results[0].geometry.location.lat;
                let lng=response.results[0].geometry.location.lng;
                console.log("Lat is: "+lat);
                console.log("Lng is: "+lng);
                console.log("obtaing near by places using the lat and lng");
               
                this.requirementService.nearByPlaces(lat,lng)
                      .subscribe((response:GeoNamesResult)=>{
                        console.log(response);
                        let locations=new Array();
                        for(let geoName of response.geonames)
                        {
                            locations.push(geoName.asciiName);
                            
                        }
                        //adding location of the current user to the locations array
                          locations.push(this.userService.currentUser.location);
                        console.log(locations);   
                        console.log("obtaining requirements similar to "+this.model.criteria); 
                        this.requirementService.reqsByCategory(this.userService.currentUser.id ,this.model.criteria,locations)
                          .subscribe((data:RequirementResult[])=>{
                            
                              if(data !=null)
                                  this.searchResult=data;
                              else
                                  this.searchResult=new Array();
  
                              this.showResult=true;
                              this.spinner.hide();  
                  }); 
  
                      });
                    
        });
            

   
  } 


  public searchBySubcategory(req)
      {
        let loc=this.userService.currentUser.location;
        console.log("Finding lat & lng of : "+loc);
        this.spinner.show();
        this.requirementService.geoCode(this.userService.currentUser.location)
          .subscribe(response => {
                let lat=response.results[0].geometry.location.lat;
                let lng=response.results[0].geometry.location.lng;
                console.log("Lat is: "+lat);
                console.log("Lng is: "+lng);
                console.log("obtaing near by places using the lat and lng");
               
                this.requirementService.nearByPlaces(lat,lng)
                      .subscribe((response:GeoNamesResult)=>{
                        console.log(response);
                        let locations=new Array();
                        for(let geoName of response.geonames)
                        {
                            locations.push(geoName.asciiName);
                            
                        }
                         //adding location of the current user to the locations array
                        locations.push(this.userService.currentUser.location);
                        console.log(locations);   
                        console.log("obtaining requirements similar to "+this.model.criteria); 
                        this.requirementService.reqsBySubCategory(this.userService.currentUser.id ,this.model.criteria,locations)
                          .subscribe((data:RequirementResult[])=>{
                            
                              if(data !=null)
                                  this.searchResult=data;
                              else
                                  this.searchResult=new Array();
  
                              this.showResult=true;
                              this.spinner.hide();  
                  }); 
  
                      });
                    
        });
            

   
  } 
}
