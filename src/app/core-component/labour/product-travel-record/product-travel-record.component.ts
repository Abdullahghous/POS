import { Component } from '@angular/core';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  routes,
  DataService,
  pageSelection,
  apiResultFormat,
  SidebarService,
  HttpService
} from 'src/app/core/core.index';
import { productTravelRecord } from 'src/app/shared/model/page.model';
import { PaginationService, tablePageSize } from 'src/app/shared/shared.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-travel-record',
  templateUrl: './product-travel-record.component.html',
  styleUrls: ['./product-travel-record.component.scss']
})
export class ProductTravelRecordComponent {
  getLocation: any = [];
  itemDefs: any = [];
  travel: any = [];
  activity: any = [];
  thekedarList: any = [];
  thekedarEntryList: any = [];
  filterActivity:any=[]

  initChecked = false;

  public routes = routes;
  public tableData: Array<productTravelRecord> = [];
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  showFilter = false;
  dataSource: MatTableDataSource<productTravelRecord> = new MatTableDataSource<productTravelRecord>();

  public searchDataValue = '';

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
    private sidebar: SidebarService,
    private api: HttpService,
    private allApiService: AllApiService,
    private snackBarService: SnackBarService
  ) {
    this.dropDownsList();
    this.getItem();
  }
  travelpdf(){
    console.log('report====travel',this.travelReport);
    this.api.post('travel/download/stockByLocation', this.travelReport, { responseType: 'blob' }).subscribe(
      (res: any) => {
        console.log('PDF file received', res);
        const blobUrl = window.URL.createObjectURL(res);
    
        // Create a link element
        const link = document.createElement('a');
    
        // Set the download attribute with the file name
        link.href = blobUrl;
        link.download = 'stock_by_location_report.pdf';  // Name the file for download
    
        // Trigger the download by simulating a click
        link.click();
    
        // Optional: Clean up the object URL after download
        window.URL.revokeObjectURL(blobUrl);
      },
      (error) => {
        console.error('Error while downloading the PDF:', error);
      }
    );
    // this.api.post('travel/download/thekedarActivityReport', this.travelReport).subscribe((res:any) =>
    //   {
    //     console.log('travel/trveellel==pdf',res)
    //   })
  }
  getTotalBags(): number {
    return this.tableData.reduce((sum, item) => sum + (+item.bags || 0), 0);
  }

  getTotalAmount(): number {
    return this.tableData.reduce((sum, item) => sum + (item.amount || 0), 0);
  }
  
  travelThekedarPdf(){
    console.log('report====travel',this.travelReport);
    this.api.post('travel/download/thekedarActivityReport', this.travelReport, { responseType: 'blob' }).subscribe(
      (res: any) => {
        console.log('PDF file received thekedar', res);
        const blobUrl = window.URL.createObjectURL(res);
    
        // Create a link element
        const link = document.createElement('a');
    
        // Set the download attribute with the file name
        link.href = blobUrl;
        link.download = 'thekedar_activity_report.pdf';  // Name the file for download
    
        // Trigger the download by simulating a click
        link.click();
    
        // Optional: Clean up the object URL after download
        window.URL.revokeObjectURL(blobUrl);
      },
      (error) => {
        console.error('Error while downloading the PDF:', error);
      }
    );
    // this.api.post('travel/download/thekedarActivityReport', this.travelReport).subscribe((res:any) =>
    //   {
    //     console.log('travel/trveellel==pdf',res)
    //   })
  }
  search() {
      console.log(this.list); // تلاش کی معلومات کو لاگ کریں
    
      this.api.post('travel/getAll', this.list).subscribe(
        (res: any) => {
          if (res) {
            const result = res.map((item: any) => ({
              ...item,
              dummydate: this.allApiService.formatDateDayMonthYear(item.date),
            }));
    
            console.log(result, 'treeevvvl===');
            this.tableData = result; // ٹیبل کے ڈیٹا کو اپ ڈیٹ کریں
            this.totalData = res.totalData; // یہ لائن شامل کریں
            this.dataSource = new MatTableDataSource<productTravelRecord>(this.tableData);
    
            // Pagination کی سیٹنگ
            this.pagination.tablePageSize.subscribe((pageSize: tablePageSize) => {
              if (this.router.url === this.routes.productTravelRecord) {
                // this.getTableData({ skip: pageSize.skip, limit: pageSize.pageSize }); // یہاں pageSize.limit کی جگہ pageSize.pageSize استعمال کریں
                this.pageSize = pageSize.pageSize;
              }
            });
          }
        },
        // error => {
        //   console.error('API Error:', error); // ایرو کی ہینڈلنگ
        // }
      );
    }
  
  public sortData(sort: Sort) {
    const data = this.tableData.slice();
    if (!sort.active || sort.direction === '') {
      this.tableData = data;
    } else {
      this.tableData = data.sort((a, b) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
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
    this.tableData.forEach((f) => {
      f.isSelected = !initChecked; // Toggle the selection based on initChecked
    });
  }
 
  
  obj:any=[
      {fromLocation :{id:0} ,
      toLocation :{id:0} ,
      
      activity: {id:0},
      thekedar:{id:0},
      // thekedarEntry:{id:0},
      itemDef:{id:0},
      remarks: "",
      status:false,
      bags: 0,
      date:new Date().toISOString().substring(0, 10) ,
      rate:0
      }
  ]
  list={
   
   fromLocation :{id:0} ,
   toLocation :{id:0} ,
   location :{id:0} ,
   mazodory:{id:0},
   monshi: {id:0},
   activity: {id:0},
   thekedar:{id:0},
   itemDef:{id:0},
   status:2,
   fromDate: new Date().toISOString().substring(0, 10),
   toDate: new Date().toISOString().substring(0, 10),
  
  }
  travelReport={
    "companyId":0,
     "branchId":0,
     "financialYearId":0,
     "activityId":0,
     "locationId":0,
     "toLocationId":0,
     "fromLocationId":0,
     "thekedarId":0,
     "monshiId":0,
     "itemDefId":0,
     "fromDate": new Date().toISOString().substring(0, 10),
     "toDate": new Date().toISOString().substring(0, 10),
     "status":2
 }
 updateTravelReport(field: string, value: any): void {
  //  this.api.getObservable('download/thekedarActivityReport').subscribe((res:any) => console.log ('htttppp', res))
  switch (field) {
    case 'itemDefId':
      this.travelReport.itemDefId = value;
      break;
    case 'locationId':
      this.travelReport.locationId = value;
      break;
      case 'fromLocationId':
      this.travelReport.fromLocationId = value;
      break;
      case 'toLocationId':
      this.travelReport.toLocationId = value;
      break;
    case 'activityId':
      this.travelReport.activityId = value;
      break;
    case 'thekedarId':
      this.travelReport.thekedarId = value;
      break;
    case 'status':
      this.travelReport.status = value;
      break;
      case 'fromDate':
      this.travelReport.fromDate = value;
      break;
      case 'toDate':
      this.travelReport.toDate = value;
      break;
    default:
      break;
  }
}
  addTravel() {
    // Function to check if any field in the object is null or has a value of 0
    const isValid = this.obj.every((item: any) => {
      return (
        item.fromLocation.id !== 0 &&
        item.toLocation.id !== 0 &&
        item.date !== null &&
        item.date !== 0 &&
        item.activity.id !== null &&
        item.activity.id !== 0 &&
        item.itemDef.id !== null &&
        item.itemDef.id !== 0 &&
        item.bags !== null &&
        item.bags !== 0
      );
    });
  
    // If validation fails, show an error message and exit the function
    if (!isValid) {
      this.snackBarService.showError('Please fill all the required fields!');
      return;
    }
  
    // If validation passes, proceed with the API call
    this.api.post('travel/addOrUpdate', this.obj).subscribe(
      (res) => {
        console.log(res, 'trrrrravrllll');
        if (res) {
          // debugger
          document.getElementById('cancelButton')?.click();
          this.snackBarService.showSuccess('Record Update Successfully!');
          
        } else {
          this.snackBarService.showError('Please fill all the required fields!');
        }
      },
      (_error) => {
        this.snackBarService.showError('An error occurred while adding the record!');
      }
    );
  }
  editTravel(data:any){ 
    debugger
    console.log("edit ===trv1111",data); 
     
    this.obj =[data];
    this.filterActivity=[data.activity]
    // this.thekedarGetId(data)
    console.log("edit====traveljjjj",this.obj);
  }
  
  dropDownsList(){
  this.api.getObservable('location/getAll').subscribe(
    (res) => {
    // console.log(res,'loctionmmmmmm')
    this.getLocation = res;
    });
    this.api.getObservable('activity/getAll').subscribe(
      (res) =>{
        // console.log(res,'accccttttvittyyyy')
        this.activity=res;
      }
    );
    this.api.getObservable('thekedar/getAll').subscribe(
      (res) => {
          // console.log(res, 'fnnnnnew');
          this.thekedarList=res;
          this.thekedarList.forEach((thekedar:any) => {
              thekedar.thekedarEntries.forEach((entry:any)=>{
               this.thekedarEntryList.push({...entry,name:thekedar.name})
              //  console.log(this.thekedarEntryList,"thekedarEntry==5====");
              });
          });
      }
    );
  }
 public thekedarGetId(id:any){
  // debugger
    console.log('thekeda list::',id)
    this.filterActivity=[];
    this.api.getObservable('thekedar/getById/'+id.thekedar.id).subscribe((res:any) =>
    {
      //this.filterActivity=re.thekedarEntries;
      id.activity={id:0,name:''}
       var filteredItems = this.itemDefs.filter((item: { id: any; }) => item.id === id.itemDef.id);
      // this.filterActivity =  res.thekedarEntries.filter((item: { code: any; }) => item.code === filteredItems.parentCode);
      
      res.thekedarEntries.forEach((e:any)=>{
        console.log(e.itemSubCategory.code,'e.itemSubCategory.code   '+filteredItems[0].parentCode);
        if (e.itemSubCategory.code===filteredItems[0].parentCode) {
          // Your code here
       
      
        this.filterActivity.push(e.activity);
        }
      //  console.log(this.filterActivity,'2no===')
      })
      // this.obj. activity.id=0
    })
  }
  cancel(){
    this.obj = [{
      fromLocation :{id:0} ,
      toLocation :{id:0} ,
      // monshi: {id:1},
      activity: {id:0},
      thekedar:{id:0},
      // thekedarEntry:{id:0},
      itemDef:{id:0},
      remarks: "",
      status:false,
      bags: 0,
      rate:0,
      date:new Date().toISOString().substring(0, 10) ,
      }];
    document.getElementById('cancelButton')?.click();
  }
  getEntries(index:number){
    // console.log(index,'indexxxx')
    // this.api.getObservable('thekedar/getById').subscribe(
    //   (res) =>{ 
    //     console.log(res,'identryess')
    //   }
    // )
  }
  getItem(){
    let items: any = localStorage.getItem('itemDefs');
    if (items != null && JSON.parse(items).length != 0) {
     this.itemDefs = JSON.parse(items);
    //  debugger
    }else{
      this.allApiService.getItemDefs();
      items = localStorage.getItem('itemDefs');
      this.itemDefs = JSON.parse(items);
    }

  } 
  deleteRow(i: number): void {
    if (this.obj.length > 1) {
      this.obj.splice(i, 1);
    }
  }
  
  addNewRow(data: any, i: number) {
    this.obj.splice(
      i + 1,
      0,
      JSON.parse(
        JSON.stringify({
          fromLocation :{id:0} ,
          toLocation :{id:0} ,
          // monshi: {id:1},
          activity: {id:0},
          thekedar:{id:0},
          // thekedarEntry:{id:0},
          itemDef:{id:0},
          remarks: "",
          status:false,
          bags: 0,
          rate:0,
          // date:new Date().toISOString().substring(0, 10) ,
          })
    )
   );
  }
  confirmColor() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: ' btn btn-success',
        cancelButton: 'me-2 btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      confirmButtonText: 'Yes, delete it!',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire('Deleted!', 'Your file has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
      }
    });
  }

  // generatePDF() {
  //   // debugger
  //   const data: any = document.getElementById('table-container');
  //   html2canvas(data).then(canvas => {
  //     const imgWidth = 208;
  //     const pageHeight = 295;
  //     const imgHeight = canvas.height * imgWidth / canvas.width;
  //     const heightLeft = imgHeight;

  //     const contentDataURL = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const position = 0;
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //     pdf.save(`${environment.PRODUCT_NAME}-product-travel-record.pdf`);
  //   });
  // }
  generatePDF() {
    const data: any = document.getElementById('table-container');
  
    // 📌 Dummy Date اور Bags کے کالم چھپائیں
    document.querySelectorAll('.hide-in-pdf').forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
  
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
  
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${environment.PRODUCT_NAME}-product-travel-record.pdf`);
  
      // 🔹 PDF کے بعد دوبارہ شو کریں
      document.querySelectorAll('.hide-in-pdf').forEach(el => {
        (el as HTMLElement).style.display = 'table-cell';
      });
    });
  }
  
  exportToExcel(): void {
    // Create a new workbook and a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.travel);

    // Create a workbook with the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save the file
    XLSX.writeFile(wb, `${environment.PRODUCT_NAME}-product-travel-record.xlsx`);
  }
}

