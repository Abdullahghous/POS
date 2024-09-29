import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  

  public voucher1: any ;
  constructor() { }

  calculateVoucher(voucher: any) {
    voucher.itemStock.itemStockEntries.forEach((entry: any) => {
      const totalKg = parseFloat(entry.totalKg) || 0;
      const bagWeightDeduction = parseFloat(entry.bagWeightDeduction) || 0;
      const katoti = parseFloat(entry.katoti) || 0;
      const purchaseRate = parseFloat(entry.purchaseRate) || 0;
      const saleRate = parseFloat(entry.saleRate) || 0;
      const bags = parseFloat(entry.bags) || 0;

      let millTaxRate = parseFloat(voucher.itemStock.millTaxRate) || 0;
      let silaiRate = parseFloat(voucher.itemStock.silaiRate) || 0;
      let bankTaxRate = parseFloat(voucher.itemStock.bankTaxRate) || 0;
      let bardanaRate = parseFloat(voucher.itemStock.bardanaRate) || 0;
      let freightCharges = parseFloat(voucher.itemStock.freightCharges) || 0;
      let otherExp = parseFloat(voucher.itemStock.otherExp) || 0;

      if (bags === 0) {
        console.error("Number of bags cannot be zero.");
        return;
      }

      const totalBagWeightDeduction = bags * bagWeightDeduction;
      const totalKatoti = bags * katoti;
      const safiKg = totalKg - totalBagWeightDeduction -  totalKatoti ;
      
      const itemQuantity = totalKg  -totalBagWeightDeduction -totalKatoti;
      const manWithKg = safiKg  / 40;
      // const calculatedAmount = manWithKg * (purchaseRate || saleRate);
      const millTaxAmount = safiKg * millTaxRate / 40;
      const otherBagWeight = safiKg / bags;
      const amount = manWithKg * (purchaseRate || saleRate) ;
      const saleAmount = manWithKg * saleRate;
      const silaiAmount = bags * silaiRate;
      const bankTaxAmount = amount * bankTaxRate / 100;
      debugger
      const bardanaAmount = bags * bardanaRate;
      const netAmount = amount - millTaxAmount - bankTaxAmount +
       silaiAmount + bardanaAmount - freightCharges - otherExp;

      // Log calculated values for debugging
      console.log('Net Amount:', netAmount);
      entry.totalBagWeightDeduction = totalBagWeightDeduction.toFixed(2);
      entry.safiKg = safiKg.toFixed(2);
      entry.amount = amount.toFixed(2);
      entry.netAmount = netAmount.toFixed(2);
      entry.totalKatoti = totalKatoti.toFixed(2);
      entry.manWithKg = manWithKg.toFixed(2);
      entry.itemQuantity = itemQuantity.toFixed(2);
      entry.otherBagWeight = otherBagWeight.toFixed(2);

      voucher.itemStock.millTaxAmount = millTaxAmount.toFixed(2);
      voucher.itemStock.silaiAmount = silaiAmount.toFixed(2);
      voucher.itemStock.bankTaxAmount = bankTaxAmount.toFixed(2);
      voucher.itemStock.bardanaAmount = bardanaAmount.toFixed(2);
      voucher.itemStock.netAmount = netAmount.toFixed(2);
  
      debugger
      this.voucher1 = voucher;
    });
  }
}
