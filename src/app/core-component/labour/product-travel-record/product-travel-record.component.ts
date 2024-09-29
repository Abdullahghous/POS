import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/core.index';

@Component({
  selector: 'app-product-travel-record',
  templateUrl: './product-travel-record.component.html',
  styleUrl: './product-travel-record.component.scss'
})
export class ProductTravelRecordComponent {
  getLocation:any=[]

  constructor(
    private api :HttpService
  ){
    this.location();
  }
  obj={
    location:"",
    thekedar:"",
    activity:"",
    itemDef:"",
    monshi:"",
    remarks:"",
    bags:"",
  }
  location(){
  this.api.getObservable('location/getAll').subscribe(
    (res) => {
    console.log(res,'loctionmmmmmm')
    this.getLocation = res;
  }


  )
  }
}
