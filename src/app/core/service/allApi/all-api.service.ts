import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/core.index';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';


interface AllBanks {
  id: number;
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class AllApiService {
  generalLedgerForm: any;
  searchButton: string | undefined;
  toggleTable: boolean | false = false;
  ledgerData: any;
  itemDefs:any [] =[];
  partyList: any[] = [];
  branchList: any;
  AllBanks : AllBanks[] = [];
  finanicailYearList: any;
  finanicailYearForDates: any;
  serverData: any;

  constructor(private apiService: HttpService) {}

  public searchPartyLedger() {
    if (this.generalLedgerForm.valid) {
      this.searchButton = 'Loading...';
      this.apiService
        .post('reports/general_ledger', this.generalLedgerForm.value)
        .pipe(
          catchError((error) => {
            console.error('Error fetching ledger:', error);
            this.searchButton = 'Search';
            return of(null);
          })
        )
        .subscribe((response: any) => {
          if (response) {
            this.toggleTable = true;
            this.ledgerData = response;
          } else {
            console.log('No data returned');
          }
          this.searchButton = 'Search';
        });
    } else {
      console.log('Form is invalid');
      window.alert('Form and To Date should not be empty');
    }

    return {
      toggleTable: this.toggleTable,
      Search: this.searchButton,
      ledgerData: this.ledgerData,
    };
  }

  public getBanks():Observable<AllBanks[]> {
   return this.apiService.getObservable<AllBanks[]>('app/getAllBanks').pipe(
    catchError((error) => {
      console.error( 'Error fetching banks ', error);
      return of([]);
    }));
  }

  public getItemDefs(): void {
    // Assuming getObservable method is used for consistency
    this.apiService.getObservable<any[]>('app/getAllItems').subscribe(
      (res: any[]) => {
        console.log(res,"itemDef===================1");
        localStorage.setItem('itemDefs', JSON.stringify(res));
      },
      (error) => {
        console.error('Error fetching item definitions:', error);
      }
    );
  }
  getMills(): void {
    // Assuming getObservable method is used for consistency
    this.apiService.getObservable<any[]>('app/getMills').subscribe(
      (response: any[]) => {
        console.log(response,"mills===================2");
        localStorage.setItem('mills', JSON.stringify(response));
      },
      (error) => {
        console.error('Error fetching mills:', error);
      }
    );
  }
  khata(){
    this.apiService.getObservable<any[]>('app/getMillKhate').subscribe((res:any[])=>{
      localStorage.setItem('millKhata', JSON.stringify(res));
      console.log('millkhata',res)
    })
  }
  public getBranches():void {
    this.apiService.getObservable<any[]>('app/getAllbranch').subscribe(
      (response: any[]) => {
        console.log(response,"branchh======13");
        localStorage.setItem('branch', JSON.stringify(response));
      },
      (error) => {
        console.error('Error fetching branch:', error);
      }
    );
  }
  public getCompanies():void  {
    this.apiService.getObservable<any[]>('app/getAllCompany').subscribe(
     (res:any[]) =>{
       console.log(res , 'company====5');
       localStorage.setItem('companies' , JSON.stringify(res))
     } ,
     (error) => {
       console.error('Error fetching Companies:', error);
     }
   )
 }
   getParties():void  {
     this.apiService.getObservable<any[]>('app/getAllParties').subscribe(
    (res:any[]) =>{
      console.log(res , 'parrteee===4');
      localStorage.setItem('parties' , JSON.stringify(res))
    } ,
    (error) => {
      console.error('Error fetching parties:', error);
    }
    )
  }
  
  financialYear(): void {
    this.apiService.getObservable<any>('app/getAllYear').subscribe(
      (res:any) =>{
        console.log(res , 'getyearrrrrr====6');
      localStorage.setItem('financialYear' , JSON.stringify(res))
      },
      (error) => {
        console.error('Error fetching financialYear:', error);
      }
    );
  }

  // public getAllAccounts() {
  //   this.apiService
  //     .get('accounts/four_level_accounts?parentCode=0')
  //     .subscribe((response: any) => {
  //       localStorage.setItem('allAccounts', JSON.stringify(response));
  //     });
  // }


  public formatDate(date: any): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  public formatDateDayMonthYear(date: any): string {
    // debugger
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  getItems(){
    let items: any = localStorage.getItem('itemDefs');
    if (items != null && JSON.parse(items).length != 0) {
      this.itemDefs = JSON.parse(items);
      return this.itemDefs;
    }else{
       this.getItemDefs();
      items = localStorage.getItem('itemDefs');
      return this.itemDefs = JSON.parse(items);
    }
  }
}
