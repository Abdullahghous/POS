import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrl: './bank-account.component.scss'
})
export class BankAccountComponent {
  parties:any[]= [];
  list:any[]=[]
  addData:any=[]
  pay:any={
    account:{
      code:0,
    } 
  }
  constructor(
    private allApiService:AllApiService,
    private apiService: HttpService,
    private snackbar : SnackBarService
  ){
     this.getAll()
  }
  getAccount(value: any) {
    console.log('value::', value);
  
    this.apiService.getObservable<any[]>(`app/bank_account/by_code?code=` + value).subscribe(
      (res: any) => {
        console.log('response::', res); // 👈 Check what exactly is returned
  
        this.list = res.bankAccountEntries; // Assign result to display
      });
  }
  test:any={
    fileName:"GM KHUDIAN KHAS.pdf"
  }
  sendAccount(id:any){
    debugger
    const updatedAccount: any = {
      ...id,
      bankName: typeof id.bankName === 'object' ? id.bankName.name : id.bankName,
    };
    this.addData.push(
      updatedAccount,
    )
   console.log('data.push::',this.addData)
   console.log('Send Account::',updatedAccount)
  }
  deleteRow(i:any){
    if(this.addData){
      this.addData.splice(i,1)
    }
  }
  custmer:any="";
  sendSelected(){
    console.log('party',this.parties)
    debugger
    this.apiService.post('bankAccounts/back-account-list?partyName='+this.custmer,this.addData)
    .subscribe(
      (res:any) =>{
        let api=res.fileName
      console.log('sendapi',api);
      if(res){
        this.apiService.getObservable("/bankAccounts/back-account-list?fileName=" + api).subscribe((res:any) =>{
          console.log('dekhoo g new try::',res)
        });
        this.snackbar.showSuccess('List priented Sucsesefully Downloaded')
      }else{
        this.snackbar.showError('An Error was ')
      }
    },
    (error) => {
      this.snackbar.showError('An error occurred while adding the record!');
     
    }
  )
  }
  getAll(){
    let parties: any = localStorage.getItem('parties');
    // console.log(parties,'compnayyyy====8')
    if (parties
       != null && JSON.parse(parties).length != 0) {
      this.parties =JSON.parse(parties);
    }
    else{
      this.allApiService.getParties();
      parties = localStorage.getItem('parties');
      this.parties = JSON.parse(parties);
    }
  }
}
