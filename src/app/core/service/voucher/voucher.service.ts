import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  weightParBag =0;

  public voucher1: any ;
  public voucher2:any;
  constructor() { }

  calculateVoucher(parentVoucher: any) {
    debugger
   var voucher =parentVoucher.pjvVoucher;
  // var voucher =parentVoucher
    voucher.itemStock.itemStockEntries.forEach((entry: any) => {
      const totalKg = parseFloat(entry.totalKg) || 0;
      const bagWeightDeduction = parseFloat(entry.bagWeightDeduction) || 0;
      const katoti = parseFloat(entry.katoti) || 0;
      // const purchaseRate = parseFloat(entry.purchaseRate) || 0;
      let price = parseFloat(entry.price) || 0;
      const bags = parseFloat(entry.bags) || 0;
      // let netAmount=parseFloat(entry.netAmount) || 0 ;

      let millTaxRate = parseFloat(voucher.itemStock.millTaxRate) || 0;
      let silaiRate = parseFloat(voucher.itemStock.silaiRate) || 0;
      let bankTaxRate = parseFloat(voucher.itemStock.bankTaxRate) || 0;
      let bardanaRate = parseFloat(voucher.itemStock.bardanaRate) || 0;
      let freightCharges = parseFloat(voucher.itemStock.freightCharges) || 0;
      let otherExp = parseFloat(voucher.itemStock.otherExp) || 0;
      let brokriValue = parseFloat(voucher.itemStock.brokriValue) || 0;
      let brokriRate = parseFloat(voucher.itemStock.brokriRate) || 0;
      // if (bags === 0) {
      //   console.error("Number of bags cannot be zero.");
      //   return;
      // }

      const totalBagWeightDeduction = bags * bagWeightDeduction;
      const totalKatoti = bags * katoti;
      const safiKg = totalKg - totalBagWeightDeduction -  totalKatoti ;
      
      const itemQuantity = totalKg  -totalBagWeightDeduction -totalKatoti;
      const manWithKg = safiKg  / this.weightParBag;
      const millTaxAmount = safiKg * millTaxRate / 40;
      const otherBagWeight = safiKg / bags;
      const amount = manWithKg * price ;
      const silaiAmount = bags * silaiRate;
      const bankTaxAmount = amount * bankTaxRate / 100;
      const bardanaAmount = bags * bardanaRate;
      const netAmount = amount - millTaxAmount - bankTaxAmount +
       silaiAmount + bardanaAmount - freightCharges - otherExp;
      const brokriAmount = netAmount * brokriRate  ;

      // Log calculated values for debugging
      console.log('Net Amount:', netAmount);
      entry.totalBagWeightDeduction = totalBagWeightDeduction.toFixed(2);
      entry.safiKg = safiKg.toFixed(0);
      entry.amount = amount.toFixed(2);
      entry.totalKatoti = totalKatoti.toFixed(2);
      entry.manWithKg = manWithKg.toFixed(2);
      entry.itemQuantity = itemQuantity.toFixed(2);
      entry.otherBagWeight = otherBagWeight.toFixed(2);

      debugger
      ///
      parentVoucher.sjvVoucher.itemStock.itemStockEntries[0].totalKg = totalKg.toFixed(0);
      parentVoucher.sjvVoucher.itemStock.itemStockEntries[0].bagWeightDeduction = bagWeightDeduction.toFixed(0);
      parentVoucher.sjvVoucher.itemStock.itemStockEntries[0].bags = bags.toFixed(0);
      parentVoucher.sjvVoucher.itemStock.itemStockEntries[0].katoti = katoti.toFixed(0);
      // parentVoucher.sjvVoucher.itemStock.itemStockEntries[0].manWithKg = manWithKg.toFixed(2);
      parentVoucher.sjvVoucher.itemStock.itemStockEntries[0].itemQuantity = itemQuantity.toFixed(0);
      parentVoucher.sjvVoucher.itemStock.itemStockEntries[0].otherBagWeight = otherBagWeight.toFixed(0);
      /////
      voucher.itemStock.millTaxAmount = millTaxAmount.toFixed(2);
      voucher.itemStock.silaiAmount = silaiAmount.toFixed(2);
      voucher.itemStock.bankTaxAmount = bankTaxAmount.toFixed(2);
      voucher.itemStock.bardanaAmount = bardanaAmount.toFixed(2);
      voucher.itemStock.netAmount = netAmount.toFixed(2);
      voucher.itemStock.netAmount = netAmount.toFixed(2);
      voucher.itemStock.brokriAmount = brokriAmount.toFixed(2);
      voucher.itemStock.brokriRate = brokriRate.toFixed(2);
  
      debugger
      this.voucher1 = voucher;
    });
  }
  pjvVoucher(voucher: any) {
    debugger
    voucher.itemStock.itemStockEntries.forEach((entry: any) => {
      const totalKg = parseFloat(entry.totalKg) || 0;
      const bagWeightDeduction = parseFloat(entry.bagWeightDeduction) || 0;
      const katoti = parseFloat(entry.katoti) || 0;
      // const purchaseRate = parseFloat(entry.purchaseRate) || 0;
      let price = parseFloat(entry.price) || 0;
      const bags = parseFloat(entry.bags) || 0;
      // let netAmount=parseFloat(entry.netAmount) || 0 ;

      let millTaxRate = parseFloat(voucher.itemStock.millTaxRate) || 0;
      let silaiRate = parseFloat(voucher.itemStock.silaiRate) || 0;
      let bankTaxRate = parseFloat(voucher.itemStock.bankTaxRate) || 0;
      let bardanaRate = parseFloat(voucher.itemStock.bardanaRate) || 0;
      let freightCharges = parseFloat(voucher.itemStock.freightCharges) || 0;
      let otherExp = parseFloat(voucher.itemStock.otherExp) || 0;
      let brokriValue = parseFloat(voucher.itemStock.brokriValue) || 0;
      let brokriRate = parseFloat(voucher.itemStock.brokriRate) || 0;
      // if (bags === 0) {
      //   console.error("Number of bags cannot be zero.");
      //   return;
      // }

      const totalBagWeightDeduction = bags * bagWeightDeduction;
      const totalKatoti = bags * katoti;
      const safiKg = totalKg - totalBagWeightDeduction -  totalKatoti ;
      
      const itemQuantity = totalKg  -totalBagWeightDeduction -totalKatoti;
      const manWithKg = safiKg  / this.weightParBag;
      const millTaxAmount = safiKg * millTaxRate / 40;
      const otherBagWeight = safiKg / bags;
      const amount = manWithKg * price ;
      const silaiAmount = bags * silaiRate;
      const bankTaxAmount = amount * bankTaxRate / 100;
      const bardanaAmount = bags * bardanaRate;
      const netAmount = amount - millTaxAmount - bankTaxAmount +
       silaiAmount + bardanaAmount - freightCharges - otherExp;
      const brokriAmount = netAmount * brokriRate  ;

      // Log calculated values for debugging
      console.log('Net Amount:', netAmount);
      entry.totalBagWeightDeduction = totalBagWeightDeduction.toFixed(2);
      entry.safiKg = safiKg.toFixed(2);
      entry.amount = amount.toFixed(2);
      entry.totalKatoti = totalKatoti.toFixed(2);
      entry.manWithKg = manWithKg.toFixed(2);
      entry.itemQuantity = itemQuantity.toFixed(2);
      entry.otherBagWeight = otherBagWeight.toFixed(2);

      voucher.itemStock.millTaxAmount = millTaxAmount.toFixed(2);
      voucher.itemStock.silaiAmount = silaiAmount.toFixed(2);
      voucher.itemStock.bankTaxAmount = bankTaxAmount.toFixed(2);
      voucher.itemStock.bardanaAmount = bardanaAmount.toFixed(2);
      voucher.itemStock.netAmount = netAmount.toFixed(2);
      voucher.itemStock.netAmount = netAmount.toFixed(2);
      voucher.itemStock.brokriAmount = brokriAmount.toFixed(2);
      voucher.itemStock.brokriRate = brokriRate.toFixed(2);
  
      debugger
      this.voucher2 = voucher;
    });
  }
}