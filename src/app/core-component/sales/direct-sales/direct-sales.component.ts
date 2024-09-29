import { Component } from '@angular/core';
import { VoucherService } from 'src/app/core/service/voucher/voucher.service'; 


@Component({
  selector: 'app-direct-sales',
  templateUrl: './direct-sales.component.html',
  styleUrl: './direct-sales.component.scss'
})
export class DirectSalesComponent {
 
  payLoad=
  {
    "company": {
        "id": "1",
        "name": ""
    },
    "branch": {
        "id": "1",
        "name": ""
    },
    "voucherType": {
        "name": ""
    },
    "voucherStatus": {
        "id": "M",
        "name": ""
    },
    "voucherCode": "",
    "inventoryVoucherType": "SQV",
    "voucherNarration": "",
    "searchByDate": "3",
    "fromDate": "2024-07-22",
    "toDate": "2024-07-22",
    "postedUnPosted": "2"
  }
 
  sjvVoucher: any = {
    createdAt: '',
    id: 0,
    voucherType: '',
    voucherStatus: '',
    branch: { id: '0' },
    itemStock: {
      id: 0,
      voucherStatus: '',
      financialYear: '0',
      account: { code: 0 },
      itemDef: { id: '0' },
      gateInwardNo: '',
      gateInwardDate: '',
      itemDefId: '0',
      invoiceNo: "INV-5375",
      invoiceDate: "2024-06-05",
      invoiceDueDate: "2024-06-20",
      silaiRate: '0.00',
      rate: '',
      silaiAmount: '',
      gisahi: '0.00',
      marketFee: '0.00',
      proWeight: '',
      netAmount: '0.0000',
      loadingRate: '0.00',
      loadingCharges: '0.00',
      freightRate: '0.00',
      freightCharges: '0.00',
      millTaxRate: '0.00',
      millTaxAmount: '0',
      otherExp: '0.00',
      brokriValue: '0.00',
      brokeryRate: '0.00',
      bankTaxRate: '0.00',
      builtyWeight: '',
      kantaWeight: '',
      moisture: '',
      permintNumber: '',
      bankTaxAmount: '',
      brokriRate: '0.00',
      brokriAmount: '0.00',
      bardanaRate: '0.00',
      bardanaAmount: '',
      totalAmount: '0.00',
      unloadingRate: '0.00',
      unloadingCharges: '',
      active: false,
      costing: false,
      pallyGisai: '',
      itemStockEntries: [
        {
          id: '0',
          voucherDate: '',
          purchaseOrderEntry: '',
          prePurchaseEntry: '',
          itemDef: '',
          itemQuantity: '0.00',
          transactionType: "OUT",
          returnedQuantity: '0',
          bagWeightDeduction: '0.00',
          totalBagWeightDeduction: '0.00',
          otherBagWeight: '0',
          purchaseRate: '0.00',
          totalKatoti: '0.00',
          percentage: '',
          percentage40: '0',
          saleRate: '0',
          katoti: '0',
          totalKg: '0.00',
          safiKg: '0.00',
          bags: 0.00,
          bag: '0',
          parti: '',
          stockEntryStatus: '',
          manWithKg: "0",
          discountAmount: '0.00',
          discount: '0.00',
          rem: '',
          amount: '0.00',
          openingQty: '',
          openingRate: '',
          active: true,
          netAmount: '0.00',
          man: 0,
          kg: '0.00'
        }
      ],
      createdBy: '',
      createdAt: '',
      modifiedBy: '',
      modifiedAt: '',
    },
    voucherDate: "2024-06-05",
    voucherNumber: '5375',
    voucherCode: "STV-5375",
    vehicalNumber: '0',
    bookNumber: '0',
    regNumber: '',
    typeVoucher: "STV",
    ptvNumber: '0',
    voucherNarration: '',
    paymentType: '0',
    active: false,
    posted: false
  };

  pjvVoucher: any = {
    createdAt: '',
    id: 0,
    voucherType: '',
    voucherStatus: '',
    branch: { id: '0' },
    itemStock: {
      id: 0,
      voucherStatus: '',
      financialYear: '0',
      account: { code: 0 },
      itemDef: { id: '0' },
      gateInwardNo: '',
      gateInwardDate: '',
      itemDefId: '0',
      invoiceNo: "INV-5375",
      invoiceDate: "2024-06-05",
      invoiceDueDate: "2024-06-20",
      silaiRate: '0.00',
      rate: '',
      silaiAmount: '',
      gisahi: '0.00',
      marketFee: '0.00',
      proWeight: '',
      netAmount: '0.0000',
      loadingRate: '0.00',
      loadingCharges: '0.00',
      freightRate: '0.00',
      freightCharges: '0.00',
      millTaxRate: '0.00',
      millTaxAmount: '0',
      otherExp: '0.00',
      brokriValue: '0.00',
      brokeryRate: '0.00',
      bankTaxRate: '0.00',
      builtyWeight: '',
      kantaWeight: '',
      moisture: '',
      permintNumber: '',
      bankTaxAmount: '',
      brokriRate: '0.00',
      brokriAmount: '0.00',
      bardanaRate: '0.00',
      bardanaAmount: '',
      totalAmount: '0.00',
      unloadingRate: '0.00',
      unloadingCharges: '',
      active: false,
      costing: false,
      pallyGisai: '',
      itemStockEntries: [
        {
          id: '0',
          voucherDate: '',
          purchaseOrderEntry: '',
          prePurchaseEntry: '',
          itemDef: '',
          itemQuantity: '0.00',
          transactionType: "OUT",
          returnedQuantity: '0',
          bagWeightDeduction: '0.00',
          totalBagWeightDeduction: '0.00',
          otherBagWeight: '0',
          purchaseRate: '0.00',
          totalKatoti: '0.00',
          percentage: '',
          percentage40: '0',
          saleRate: '0',
          katoti: '0',
          totalKg: '0.00',
          safiKg: '0.00',
          bags: 0.00,
          bag: '0',
          parti: '',
          stockEntryStatus: '',
          manWithKg: "0",
          discountAmount: '0.00',
          discount: '0.00',
          rem: '',
          amount: '0.00',
          openingQty: '',
          openingRate: '',
          active: true,
          netAmount: '0.00',
          man: 0,
          kg: '0.00'
        }
      ],
      createdBy: '',
      createdAt: '',
      modifiedBy: '',
      modifiedAt: '',
    },
    voucherDate: "2024-06-05",
    voucherNumber: '5375',
    voucherCode: "STV-5375",
    vehicalNumber: '0',
    bookNumber: '0',
    regNumber: '',
    typeVoucher: "STV",
    ptvNumber: '0',
    voucherNarration: '',
    paymentType: '0',
    active: false,
    posted: false
  };

  constructor(private voucherService: VoucherService) { }

  ngOnInit(): void {
  
  }

  calculcate(): void {
    debugger
    this.voucherService.calculateVoucher(this.sjvVoucher);
    this.voucherService.calculateVoucher(this.pjvVoucher);
    this.sjvVoucher=this.voucherService.voucher1;
    debugger
  }
  
}
