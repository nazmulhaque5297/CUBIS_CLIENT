import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';
import { FixedDepositCreateModel } from '../modules/accounting/models/fixed-deposit.model';

@Injectable({
  providedIn: 'root',
})
export class YeGeneralJournalTransactionService {
  constructor(private httpClient: HttpClient) {}

  public generalJournalTrnPageLoad() {
    return this.httpClient.get(
      createUrl(
        `Accounting/SpecialFunction/GLYearEndJournalTransaction/GetInputHelpData`
      )
    );
  }
  public generalJournalGLCodeFind(data: any) {
    return this.httpClient.get(
      createUrl(
        `Accounting/SpecialFunction/GLYearEndJournalTransaction/GLAccFind?accNo=` +
          data
      )
    );
  }
  public generalJournalGLCodeInfo(glcode: number) {
    return this.httpClient.get(
      createUrl(
        `Accounting/SpecialFunction/GLYearEndJournalTransaction/GetGLAccInfo?GLCode=` +
          glcode
      )
    );
  }
  public newFixedDepositGLCodeInfo(data: FixedDepositCreateModel) {
    return this.httpClient.post(
      createUrl(
        `Accounting/SpecialFunction/GLYearEndJournalTransaction/GetGLAccInfoNewFixedDeposit`
      ),
      data
    );
  }
  public generalJournalAddAndGetTempData(data: any) {
    return this.httpClient.post(
      createUrl(
        `Accounting/SpecialFunction/GLYearEndJournalTransaction/AddAndDepositTrnTempData`
      ),
      data
    );
  }
  public generalJournalFinalUpdateData(data: any) {
    return this.httpClient.post(
      createUrl(
        `Accounting/SpecialFunction/GLYearEndJournalTransaction/MainUpdateTransaction`
      ),
      data
    );
  }
  public generalJournalEditVoucharData(data: any) {
    return this.httpClient.get(
      createUrl(
        `Accounting/SpecialFunction/GLYearEndJournalTransaction/VoucherEditData?voucherNo=` +
          data
      )
    );
  }
}
