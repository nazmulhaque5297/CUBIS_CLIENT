import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashDepositComponent } from '../accounting/pages/cash-deposit/cash-deposit.component';
import { DailyReverseCsTransactionComponent } from '../accounting/pages/daily-reverse-cs-transaction/daily-reverse-cs-transaction.component';
import { DailyReverseGlTransactionComponent } from '../accounting/pages/daily-reverse-gl-transaction/daily-reverse-gl-transaction.component';
import { EditLoanApplicationComponent } from '../accounting/pages/edit-loan-application/edit-loan-application.component';
import { GeneralJournalTransactionComponent } from '../accounting/pages/general-journal-transaction/general-journal-transaction.component';
import { NewLoanApplicationComponent } from '../accounting/pages/new-loan-application/new-loan-application.component';
import { PaymentTransactionWithdrawalComponent } from '../accounting/pages/payment-transaction-withdrawal/payment-transaction-withdrawal.component';
import { CsVoucherWiseTransactionReportComponent } from '../accounting/pages/reports/cs-voucher-wise-transaction-report/cs-voucher-wise-transaction-report.component';
import { BoothComponent } from './Home/booth.component';
import { BoothCsVoucherWiseTransactionReportComponent } from '../accounting/pages/reports/booth-cs-voucher-wise-transaction-report/booth-cs-voucher-wise-transaction-report.component';
import { MemberLoanPerformanceReportComponent } from '../accounting/pages/reports/member-loan-performance-report/member-loan-performance-report.component';
import { GroupSummaryStatementReportComponent } from '../accounting/pages/reports/group-summary-statement-report/group-summary-statement-report.component';
import { VoucherSearchReportComponent } from '../accounting/pages/reports/voucher-search-report/voucher-search-report.component';
import { AccountStatementReportComponent } from '../accounting/pages/reports/account-statement-report/account-statement-report.component';
import { BoothJournalReportComponent } from '../accounting/pages/reports/booth-journal-report/booth-journal-report.component';
import { BoothReceivedAndPaymentReportComponent } from '../accounting/pages/reports/booth-received-and-payment-report/booth-received-and-payment-report.component';
import { LoanRecoveryReportComponent } from '../accounting/pages/reports/loan-recovery-report/loan-recovery-report.component';
import { DepositDefaulterReportComponent } from '../accounting/pages/reports/deposit-defaulter-report/deposit-defaulter-report.component';
import { NewMemberApplicationComponent } from '../accounting/pages/new-member-application/new-member-application.component';
import { EditMemberApplicationComponent } from '../accounting/pages/edit-member-application/edit-member-application.component';
import { BenefitWithdrawalComponent } from '../accounting/pages/benefit-withdrawal/benefit-withdrawal.component';

const routes: Routes = [
  { path: '', component: BoothComponent },
  { path: 'new-loan-application', component: NewLoanApplicationComponent },
  { path: 'new-member-application', component: NewMemberApplicationComponent },
  {
    path: 'edit-member-application',
    component: EditMemberApplicationComponent,
  },
  {
    path: 'edit-loan-application',
    component: EditLoanApplicationComponent,
  },
  {
    path: 'daily-reverse-cs-transaction',
    component: DailyReverseCsTransactionComponent,
  },
  {
    path: 'general-journal-transactions',
    component: GeneralJournalTransactionComponent,
  },
  {
    path: 'daily-reverse-gl-transactions',
    component: DailyReverseGlTransactionComponent,
  },
  { path: 'deposit', component: CashDepositComponent },
  { path: 'withdrawal', component: PaymentTransactionWithdrawalComponent },
  {
    path: 'cs-voucher-wise-transaction-list',
    component: BoothCsVoucherWiseTransactionReportComponent,
  },
  {
    path: 'member-loan-performence-report',
    component: MemberLoanPerformanceReportComponent,
  },
  {
    path: 'group-summary-statement',
    component: GroupSummaryStatementReportComponent,
  },
  {
    path: 'voucher-search-report',
    component: VoucherSearchReportComponent,
  },
  {
    path: 'cs-account-statement',
    component: AccountStatementReportComponent,
  },
  {
    path: 'journal-reports',
    component: BoothJournalReportComponent,
  },
  {
    path: 'received-and-payment',
    component: BoothReceivedAndPaymentReportComponent,
  },
  {
    path: 'loan-recovery-report',
    component: LoanRecoveryReportComponent,
  },
  {
    path: 'deposit-defaulter-report',
    component: DepositDefaulterReportComponent,
  },
  {
    path: 'interest-benefit-withdrawal',
    component: BenefitWithdrawalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoothRoutingModule {}
