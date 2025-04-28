import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,Validators,FormBuilder } from '@angular/forms';
import { HttpService,SidebarService,routes } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-account-management-add-edit',
  templateUrl: './account-management-add-edit.component.html',
  styleUrls: ['./account-management-add-edit.component.scss']
})
export class AccountManagementAddEditComponent implements OnInit {
  public routes = routes;
  getBranches:any[]= [];
  getCompanies:any[]= [];
  isLevelThreeVisible: boolean = true;
  formGroupLevels = new FormGroup({
    levelOne: new FormControl('', Validators.required),
    levelTwo: new FormControl('', Validators.required),
    levelThree: new FormControl(''),
    levelFour: new FormControl(''),
    code: new FormControl(''),
    name: new FormControl(''),
  });

  // Separate form group for the modal
  modalForm = new FormGroup({
    levelOne: new FormControl('', Validators.required),
    levelTwo: new FormControl('', Validators.required),
    levelThree: new FormControl(''),
    code: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    accountLevel: new FormControl(''),
    parentCode: new FormControl(''),
    formattedCode: new FormControl('')
  });

  // Example data for levels
  levelOneData: any = [];
  levelTwoData: any = [];
  levelThreeData: any = [];
  levelFourData: any = [];

  // Modal data (for patching)
  modalData = {
    levelOne: '',
    levelTwo: '',
    levelThree: '',
    nextCode: '',
    nextFormattedCode: '',
    nextFormattedCode3: '',
    name: '',
    accountLevel: '',
    parentCode: '',
    formattedCode: '',
  };

  nextCodeValue: string = '';
  selectedLevelOne: any = null;
  selectedLevelTwo: any = null;
  selectedLevelThree: any = null;
  selectedLevelFour: any =null;
  accountName:any=null;
  formattedCode:any =null;
  accountName3:any=null;
  formattedCode3:any =null;
  code:any=null;
  code2:any=null;
  code3:any=null;
  table:any=null;
  
  constructor(
    private apiService: HttpService,
    private sidebar: SidebarService,
    private snackBarService:SnackBarService,
    private allApiService:AllApiService,
    private fb: FormBuilder,
  ) {
   
  }
  upDated:any={
    "code": "",
    "formattedCode": "",
    "accountName": "",
    "balanceLimit": "",
    "upperLimit": "",
    "contactPerson": "",
    "salesman": "",
    "mobile": "",
    "phone": "",
    "fax": "",
    "email": "",
    "website": "",
    "address": "",
    "province": "",
    "city": "",
    "accountTitle": "",
    "accountNumber": "",
    "bankBranchCode": "",
    "bankBranchName": "",
    "branches": [
        {
            "id": "1",
            "name": ""
        }
    ]
  }
  ngOnInit(): void {
    // Initialize level data
    this.apiService.getObservable<any[]>('accounts/one_level_accounts').subscribe((res) => {
      this.levelOneData = res;
      console.log('level====1',res);
    });

    // Subscribe to form control changes
    this.formGroupLevels.get('levelOne')?.valueChanges.subscribe((value) => {
      this.onChangeLevelOne(value);
    });
    this.formGroupLevels.get('levelTwo')?.valueChanges.subscribe((value) => {
      this.onChangeLevelTwo(value);
    });
    this.formGroupLevels.get('levelThree')?.valueChanges.subscribe((value) => {
      this.onChangeLevelThree(value);
    });
    this.formGroupLevels.get('levelFour')?.valueChanges.subscribe((value) => {
      this.onChangeLevelFour(value);
    });
    this.getAll();
    

  }

  onChangeLevelOne(value: any) {
    this.apiService.getObservable<any[]>('accounts/two_level_accounts?parentCode=' + value).subscribe((res: any[]) => {
      this.levelTwoData = res;
      console.log('level====1',res);
      const level = this.levelOneData.accountLevelResults.find((l: any) => l.code == value);
      this.selectedLevelOne = `${level?.code} ${level?.name}`; 
      
    });
  }
  
  onChangeLevelTwo(value: any) {
    debugger
    this.apiService.getObservable<any[]>('accounts/three_level_accounts?parentCode=' + value).subscribe((res: any[]) => {
      this.levelThreeData = res;
      console.log('level====2',res);
      const level = this.levelTwoData.accountLevelResults.find((l: any) => l.code == value);
      this.selectedLevelTwo = `${level?.formattedCode} ${level?.name}`;
      this.code2= level?.code;
    });
  }
  
  onChangeLevelThree(value: any) {
    debugger
    this.apiService.getObservable<any[]>('accounts/four_level_accounts?parentCode=' + value).subscribe((res: any[]) => {
      this.levelFourData = res;
      console.log('level====3',res);
      const level = this.levelThreeData.accountLevelResults.find((l: any) => l.code == value);
      this.selectedLevelThree = `${level?.formattedCode} ${level?.name}`;
      this.formattedCode3= level?.formattedCode;
      this.code3= level?.code;
      this.accountName3= level?.name
      console.log('level====3=3',this.selectedLevelThree);
    });
  }

  onChangeLevelFour(value: any) {
    this.apiService.getObservable('accounts/account_data?code='+value).subscribe((res:any) =>
      {
        console.log('Final' ,res);
        this.accountName=res.accountData.accountName
        const level = this.levelFourData.accountLevelResults.find((l: any) => l.code == value);
        this.selectedLevelFour = level?.formattedCode
        // console.log('level====4',this.selectedLevelFour);
        // this.selectedLevelFour= value;
        this.table = res;
        this.upDated = { 
          ...res.accountData, 
          code: this.formGroupLevels.value.levelFour 
      };
      console.log("CODE updated::", this.upDated);
      })
      document.getElementById('filter_search')?.click();
      // console.log("CODE CHANGE DP::", value);
      
  }

  addAccount3(value: any) {
    debugger
    this.apiService
      .getObservable('accounts/next_account_code?accountLevel=3&parentCode=' + value)
      .subscribe((res: any) => {
        this.modalData.nextFormattedCode = res.nextFormattedCode;
        this.modalData.nextCode = res.nextCode;
          this.modalForm.patchValue({
            levelOne: this.selectedLevelOne,
            levelTwo: this.selectedLevelTwo,
            code: this.modalData.nextCode,
            name: this.modalData.name,
            accountLevel: '3',
            formattedCode:this.modalData.nextFormattedCode,
            parentCode:value,
        })
    });
    this.isLevelThreeVisible = false
  }
  editAccount3(value:any) {
    debugger
    // this.modalData.nextCode = res.nextCode;
    this.modalForm.patchValue({
      levelOne: this.selectedLevelOne,
      levelTwo: this.selectedLevelTwo,
      levelThree: this.selectedLevelThree,
      formattedCode: this.selectedLevelThree,
      code: this.formGroupLevels.value.levelThree,
      name: this.accountName3,
      accountLevel: '3',
      parentCode:this.code2,
    })
    this.isLevelThreeVisible = false
  }
  
  addAccount4(value:any) {
    debugger
    this.apiService.getObservable('accounts/next_account_code?accountLevel=4&parentCode=' + value).subscribe((res: any) => {
       console.log('code',res)
      this.modalData.nextFormattedCode = res.nextFormattedCode;
      this.modalData.nextCode = res.nextCode;
        this.modalForm.patchValue({
          levelOne: this.selectedLevelOne,
          levelTwo: this.selectedLevelTwo,
          levelThree: this.selectedLevelThree,
          code: this.modalData.nextCode,
          name: this.modalData.name,
          accountLevel: '4',
          formattedCode:this.modalData.nextFormattedCode,
          parentCode:value,
        })
    });
    this.isLevelThreeVisible = true
  }
  editAccount4(value:any) {
    debugger
        // this.modalData.nextCode = res.nextCode;
        this.modalForm.patchValue({
          levelOne: this.selectedLevelOne,
          levelTwo: this.selectedLevelTwo,
          levelThree: this.selectedLevelThree,
          formattedCode: this.selectedLevelFour,
          code: this.formGroupLevels.value.levelFour,
          name: this.accountName,
          accountLevel: '4',
          parentCode:this.code3,
        })
        console.log('levelfourdata',this.levelFourData);
        console.log('levelthreedata',this.levelThreeData)
        this.isLevelThreeVisible = true
  }
  onSubmit(value: any) {
    if (this.modalForm.invalid) {
      this.modalForm.markAllAsTouched(); // this will show all validation errors
      return;
    }
  
    const accountData = this.modalForm.value;
    console.log('Form Data:', accountData);
  
    this.apiService.post('accounts/add_or_update_account', accountData).subscribe(
      (res) => {
        document.getElementById('close-account')?.click();
        if (res) {
          this.snackBarService.showSuccess('Account Added Or Updated Successfully!');
        } else {
          this.snackBarService.showError('Please fill all the required fields!');
        }
      },
      (error) => {
        this.snackBarService.showError('An error occurred while adding the record!');
      }
    );
  }
  onChangeLevelFinal(value:any){
    this.apiService.getObservable('accounts/account_data?code='+value).subscribe((res:any) =>
      {
        console.log("demoo" ,res)
        this.table = res
      })
      document.getElementById('filter_search')?.click();
      console.log("table CHANGE DP::", value);
  }
  addAccount={
    
      "accountLevel": "",
      "parentCode": "",
      "nextCode": "",
      "nextFormattedCode": "",
      "name": ""
  
  }
  // fo(){
  //   debugger
  //   this.formGroupLevels.patchValue({
  //     levelOne: this.levelOneValue,
  //     levelTwo: this.levelTwoValue,
  //     levelThree: this.levelThreeValue,
  //     nextCode: this.nextCodeValue,
  //     name:'',
  //   })
  // }
  accountUpDate(){
    this.apiService.post('accounts/add_or_update_account_data',this.upDated).subscribe((res:any)=>{
      console.log('accountUpDate',res);
      if (res) {
        this.snackBarService.showSuccess('Account Added Or Updated Successfully!');
        // this.newVoucher();
      } else {
        this.snackBarService.showError('Please fill all the required fields!');
      }
    },
    (error) => {
      this.snackBarService.showError('An error occurred while adding the record!');
    })
  }
  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  public filter = false;
  openFilter() {
    this.filter = !this.filter;
  }
  getAll(){
    let getBranches: any = localStorage.getItem('branch');
    let getCompanies: any = localStorage.getItem('companies');
    // console.log(getCompanies,'compnayyyy====8')
    if ( getBranches && getCompanies
       != null && JSON.parse(getBranches).length != 0) {
      this.getBranches = JSON.parse(getBranches);
      this.getCompanies = JSON.parse(getCompanies);
      // debugger
    }
    else{
      this.allApiService.getBranches();
      getBranches = localStorage.getItem('branch');
      this.getBranches = JSON.parse(getBranches);
      this.allApiService.getCompanies();
      getCompanies = localStorage.getItem('companies');
      this.getCompanies = JSON.parse(getCompanies);
    }
    // console.log('company::',this.getCompanies)
    console.log('branch::',this.getBranches)
  }
}
