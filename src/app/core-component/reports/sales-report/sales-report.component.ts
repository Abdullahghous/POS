import { Component , OnInit,ElementRef } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { document } from 'ngx-bootstrap/utils';
import {
  DataService,
  pageSelection,
  apiResultFormat,
  routes,
  SidebarService,HttpService
} from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { salesReport } from 'src/app/shared/model/page.model';
import { PaginationService, tablePageSize } from 'src/app/shared/shared.index';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.scss',
})
export class SalesReportComponent implements OnInit {
  initChecked = false;
  isSelected?: boolean;
  selectedValue1 = '';
  selectedValue2 = '';
  selectedValue3 = '';

  public routes = routes;
  // pagination variables
  public tableData: Array<salesReport> = [];
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<salesReport>;
  public searchDataValue = '';
  itemDefs: any[] = [];
  parties: any[] = [];
  mills: any[] = [];
  allParties:any[]= [];
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  saleReport:any[] = [];
  paymentType = '';

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
    private sidebar: SidebarService,
    private allApiService:AllApiService,
    private apiService: HttpService,
    private el: ElementRef,
  ) {
    this.data.getDataTable().subscribe((apiRes: apiResultFormat) => {
      this.totalData = apiRes.totalData;
      this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
        if (this.router.url == this.routes.salesReport) {
          this.getTableData({ skip: res.skip, limit: this.totalData  });
          this.pageSize = res.pageSize;
        }
      });
    });
   
  }
 
  
  ngOnInit(): void {
    this.getAll();
    
  }
  obj={
    "companyId": "0",
    "branchId": "0",
    "voucherStatusId": "0",
    "financialYearId": "0",
    "fromDate": new Date().toISOString().substring(0, 10),
    "toDate": new Date().toISOString().substring(0, 10),
    "itemDefId": "0",
    "itemCategoryId": "0",
    "accountCode": "0",
    "serchByDate": "1",
    "voucherType": "0"
  }
  sqvSearch(obj: any) {
    if (obj.voucherType === "SQV") {
      obj.callingFrom = "detailSearch";  // Add callingFrom if voucherType is "SQV"
      document.getElementById('pills-profile-tab').click()
    } else {
      delete obj.callingFrom;  // Remove callingFrom if voucherType is not "SQV"
      document.getElementById('pills-home-tab').click();
    }
  
    this.onSave(obj);  // Passing obj directly to onSave
    return obj;
  }
  onSave(obj: any) {
  
    this.apiService.post('reports/sales_report', obj).subscribe((res:any) => {
      if (res) {
      res.forEach((element:any) => {
        element.createdDate =  this.allApiService.formatDateDayMonthYear(element.createdDate);
        element.typeVoucher=this.splitFunctio(element.voucherCode)
      });
        this.saleReport = res;
        console.log('sale report ::',res)
      //
      }
    });
  
  }
  splitFunctio(  voucherCode:any){
    let splitValue: string[] = voucherCode.split('-');
  let firstPart: string = splitValue[0];
  return firstPart;
  }
  viwoVoucher(id:any ,typeVoucher:any){
    console.log('voucher viwo',id ,typeVoucher);
    const url = this.router.createUrlTree(['/sales/sales-list'], { queryParams: { id ,typeVoucher } });
    const fullUrl = window.location.origin + url.toString();
    console.log(fullUrl); 
    window.open(fullUrl, '_blank');
  }
  editVoucher(id:any){
    console.log('voucher ===view',id);
    const url = this.router.createUrlTree(['/sales/sale-voucher'], { queryParams: { id } });
    const fullUrl = window.location.origin + url.toString();
    console.log(fullUrl); // Log the full URL to check it
    window.open(fullUrl, '_blank');
  }
  getAll(){
    
    let items: any = localStorage.getItem('itemDefs');
    let parties: any = localStorage.getItem('parties');
    let mills: any = localStorage.getItem('mills');
    let getBranches: any = localStorage.getItem('branch');
    let getCompanies: any = localStorage.getItem('companies');
    let financialYear: any = localStorage.getItem('financialYear');
    // console.log(getCompanies,'compnayyyy====8')
    if (items && parties && mills && getBranches && getCompanies && financialYear
       != null && JSON.parse(items).length != 0) {
      this.itemDefs = JSON.parse(items);
      this.parties =JSON.parse(parties);
      this.mills = JSON.parse(mills); 
      this.getBranches = JSON.parse(getBranches);
      this.getCompanies = JSON.parse(getCompanies);
      this.financialYear = JSON.parse(financialYear);
      // debugger
    }
    else{
      this.allApiService.getItemDefs();
      items = localStorage.getItem('itemDefs');
      this.itemDefs = JSON.parse(items);
      this.allApiService.getMills();
      mills = localStorage.getItem('mills');
      this.mills = JSON.parse(mills);
      this.allApiService.getParties();
      parties = localStorage.getItem('parties');
      this.parties = JSON.parse(parties);
      this.allApiService.getBranches();
      getBranches = localStorage.getItem('branch');
      this.getBranches = JSON.parse(getBranches);
      this.allApiService.getCompanies();
      getCompanies = localStorage.getItem('companies');
      this.getCompanies = JSON.parse(getCompanies);
      this.allApiService.financialYear();
      financialYear = localStorage.getItem('financialYear');
      this.financialYear = JSON.parse(financialYear);
       debugger
    }
    const maxFinancialYear = this.financialYear.reduce((maxYear, currentYear) => {
      debugger
      return currentYear.id > maxYear.id ? currentYear : maxYear;
  }, this.financialYear[0]);
  // this.obj.fromDate =maxFinancialYear.fromDate;
  // this.obj.toDate =maxFinancialYear.toDate;
  this.obj.financialYearId =maxFinancialYear.id;
  }
  private getTableData(pageOption: pageSelection): void {
    this.data.getSalesReport().subscribe((apiRes: apiResultFormat) => {
      this.tableData = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: salesReport, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.tableData.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<salesReport>(this.tableData);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.tableData,
        serialNumberArray: this.serialNumberArray,
      });
    });
  }

  public sortData(sort: Sort) {
    const data = this.tableData.slice();
    if (!sort.active || sort.direction === '') {
      this.tableData = data;
    } else {
      this.tableData = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.tableData = this.dataSource.filteredData;
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
  selectAll(initChecked: boolean) {
    if (!initChecked) {
      this.tableData.forEach((f) => {
        f.isSelected = true;
      });
    } else {
      this.tableData.forEach((f) => {
        f.isSelected = false;
      });
    }
  }
}
