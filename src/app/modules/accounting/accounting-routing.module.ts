import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountingComponent } from './Home/accounting.component';
import { AccountEditMaintenanceComponent } from './pages/account-edit-maintenance/account-edit-maintenance.component';
import { AccountLedgerBalanceSmsServiceComponent } from './pages/account-ledger-balance-sms-service/account-ledger-balance-sms-service.component';
import { AccountOpeningMaintenanceComponent } from './pages/account-opening-maintenance/account-opening-maintenance.component';
import { AccountStatusChangeComponent } from './pages/account-status-change/account-status-change.component';
import { AdjustmentTransactionsComponent } from './pages/adjustment-transactions/adjustment-transactions.component';
import { ApproveLoanApplicationComponent } from './pages/approve-loan-application/approve-loan-application.component';
import { ApproveMemberApplicationComponent } from './pages/approve-member-application/approve-member-application.component';
import { AddNomineeComponent } from './pages/approve-member-application/auto-new-account-openning/add-nominee/add-nominee.component';
import { AutoNewAccountOpenningComponent } from './pages/approve-member-application/auto-new-account-openning/auto-new-account-openning.component';
import { AutoAnniversaryProcessingComponent } from './pages/auto-anniversary-processing/auto-anniversary-processing.component';
import { AutoBenefitTransferComponent } from './pages/auto-benefit-transfer/auto-benefit-transfer.component';
import { AutoInstructionDepositProcessComponent } from './pages/auto-instruction-deposit-process/auto-instruction-deposit-process.component';
import { AutoManualTransactionComponent } from './pages/auto-manual-transaction/auto-manual-transaction.component';
import { AutoProvisionProcessComponent } from './pages/auto-provision-process/auto-provision-process.component';
import { AutoRenewalProcessComponent } from './pages/auto-renewal-process/auto-renewal-process.component';
import { BackUpProcessComponent } from './pages/back-up-process/back-up-process.component';
import { BenefitWithdrawalComponent } from './pages/benefit-withdrawal/benefit-withdrawal.component';
import { BoothGlCodeControlMaintenanceComponent } from './pages/booth-gl-code-control-maintenance/booth-gl-code-control-maintenance.component';
import { BudgetParameterMaintenanceComponent } from './pages/budget-parameter-maintenance/budget-parameter-maintenance.component';
import { CashDepositComponent } from './pages/cash-deposit/cash-deposit.component';
import { ChequeBookIssueComponent } from './pages/cheque-book-issue/cheque-book-issue.component';
import { ChequeStatusChangeComponent } from './pages/cheque-status-change/cheque-status-change.component';
import { CollectorTransferComponent } from './pages/collector-transfer/collector-transfer.component';
import { CounterChequeBookComponent } from './pages/counter-cheque-book/counter-cheque-book.component';
import { CsLoanRescheduleComponent } from './pages/cs-loan-reschedule/cs-loan-reschedule.component';
import { CsVerifyDailyTransactionComponent } from './pages/cs-verify-daily-transaction/cs-verify-daily-transaction.component';
import { DailyReverseCsTransactionComponent } from './pages/daily-reverse-cs-transaction/daily-reverse-cs-transaction.component';
import { DailyReverseGlTransactionComponent } from './pages/daily-reverse-gl-transaction/daily-reverse-gl-transaction.component';
import { DayEndProcessComponent } from './pages/day-end-process/day-end-process.component';
import { DayEndProcessTestComponent } from './pages/day-end-process-test/day-end-process-test.component';
import { DistrictCodeMaintenanceComponent } from './pages/district-code-maintenance/district-code-maintenance.component';
import { DivisionCodeMaintenanceComponent } from './pages/division-code-maintenance/division-code-maintenance.component';
import { EditLoanAccountComponent } from './pages/edit-loan-account/edit-loan-account.component';
import { EditLoanApplicationComponent } from './pages/edit-loan-application/edit-loan-application.component';
import { EditMemberApplicationComponent } from './pages/edit-member-application/edit-member-application.component';
import { EditMemberInformationsComponent } from './pages/edit-member-informations/edit-member-informations.component';
import { EncashmentComponent } from './pages/encashment/encashment.component';
import { ExcelCollectionSheetComponent } from './pages/excel-collection-sheet/excel-collection-sheet.component';
import { GeneralJournalTransactionComponent } from './pages/general-journal-transaction/general-journal-transaction.component';
import { GlVerifyDailyTransactionComponent } from './pages/gl-verify-daily-transaction/gl-verify-daily-transaction.component';
import { LoanApplicationRejectComponent } from './pages/loan-application-reject/loan-application-reject.component';
import { LoanDisbursementComponent } from './pages/loan-disbursement/loan-disbursement.component';
import { LoanPaymentScheduleComponent } from './pages/loan-payment-schedule/loan-payment-schedule.component';
import { LoanSettlementComponent } from './pages/loan-settlement/loan-settlement.component';
import { LoanTimeAllowanceComponent } from './pages/loan-time-allowance/loan-time-allowance.component';
import { MemberCardAuthorizationComponent } from './pages/member-card-authorization/member-card-authorization.component';
import { MemberDepositQueryComponent } from './pages/member-deposit-query/member-deposit-query.component';
import { MemberGreetingSmsServiceComponent } from './pages/member-greeting-sms-service/member-greeting-sms-service.component';
import { MemberPictureAuthorizationComponent } from './pages/member-picture-authorization/member-picture-authorization.component';
import { MemberReferancePictureAuthorizationComponent } from './pages/member-referance-picture-authorization/member-referance-picture-authorization.component';
import { MemberSignatureAuthorizationComponent } from './pages/member-signature-authorization/member-signature-authorization.component';
import { MemberStatusChangeComponent } from './pages/member-status-change/member-status-change.component';
import { ModifyChartOfAccountComponent } from './pages/modify-chart-of-account/modify-chart-of-account.component';
import { NewCollectorsMaintenanceComponent } from './pages/new-collectors-maintenance/new-collectors-maintenance.component';
import { NewFixedDepositComponent } from './pages/new-fixed-deposit/new-fixed-deposit.component';
import { NewGroupMaintenaceComponent } from './pages/new-group-maintenace/new-group-maintenace.component';
import { LoanReturnScheduleComponent } from './pages/new-loan-application/loan-return-schedule/loan-return-schedule.component';
import { NewLoanApplicationComponent } from './pages/new-loan-application/new-loan-application.component';
import { NewMemberApplicationComponent } from './pages/new-member-application/new-member-application.component';
import { OpenChartOfAccountComponent } from './pages/open-chart-of-account/open-chart-of-account.component';
import { PaymentTransactionWithdrawalComponent } from './pages/payment-transaction-withdrawal/payment-transaction-withdrawal.component';
import { PostOfficeCodeMaintenanceComponent } from './pages/post-office-code-maintenance/post-office-code-maintenance.component';
import { ProfitAndLossAppropriationComponent } from './pages/profit-and-loss-appropriation/profit-and-loss-appropriation.component';
import { ProfitLossAppropriationComponent } from './pages/profit-loss-appropriation/profit-loss-appropriation.component';
import { AccountOpenAndCloseRegisterComponent } from './pages/reports/account-open-and-close-register/account-open-and-close-register.component';
import { AccountStatementReportComponent } from './pages/reports/account-statement-report/account-statement-report.component';
import { AccountTransferReportComponent } from './pages/reports/account-transfer-report/account-transfer-report.component';
import { AuditReportsComponent } from './pages/reports/audit-reports/audit-reports.component';
import { BlankCollectionSheetComponent } from './pages/reports/blank-collection-sheet/blank-collection-sheet.component';
import { BudgetReportsComponent } from './pages/reports/budget-reports/budget-reports.component';
import { CashBookReportComponent } from './pages/reports/cash-book-report/cash-book-report.component';
import { CashCollectionReportByACTypeComponent } from './pages/reports/cash-collection-report-by-a-c-type/cash-collection-report-by-a-c-type.component';
import { CashCollectionReportComponent } from './pages/reports/cash-collection-report/cash-collection-report.component';
import { CashDisbursementReportComponent } from './pages/reports/cash-disbursement-report/cash-disbursement-report.component';
import { ChartOfAccountReportComponent } from './pages/reports/chart-of-account-report/chart-of-account-report.component';
import { ChequeBookRegisterComponent } from './pages/reports/cheque-book-register/cheque-book-register.component';
import { CsDailyTransactionReportComponent } from './pages/reports/cs-daily-transaction-report/cs-daily-transaction-report.component';
import { CsDailyTransactionVoucherReportComponent } from './pages/reports/cs-daily-transaction-voucher-report/cs-daily-transaction-voucher-report.component';
import { CsVoucherWiseTransactionReportComponent } from './pages/reports/cs-voucher-wise-transaction-report/cs-voucher-wise-transaction-report.component';
import { DailyTransactionSummaryReportComponent } from './pages/reports/daily-transaction-summary-report/daily-transaction-summary-report.component';
import { DailyTransactionVoucherReportComponent } from './pages/reports/daily-transaction-voucher-report/daily-transaction-voucher-report.component';
import { DepositDefaulterReportComponent } from './pages/reports/deposit-defaulter-report/deposit-defaulter-report.component';
import { DepositMaturityReportComponent } from './pages/reports/deposit-maturity-report/deposit-maturity-report.component';
import { EstimatedMaturityIntReportComponent } from './pages/reports/estimated-maturity-int-report/estimated-maturity-int-report.component';
import { FinalAccountsReportComponent } from './pages/reports/final-accounts-report/final-accounts-report.component';
import { GenerateNewMemberNumberListComponent } from './pages/reports/generate-new-member-number-list/generate-new-member-number-list.component';
import { GlAccountStatementReportsComponent } from './pages/reports/gl-account-statement-reports/gl-account-statement-reports.component';
import { GroupSummaryStatementReportComponent } from './pages/reports/group-summary-statement-report/group-summary-statement-report.component';
import { GuarantorSurityReportComponent } from './pages/reports/guarantor-surity-report/guarantor-surity-report.component';
import { IdentityCardListComponent } from './pages/reports/identity-card-list/identity-card-list.component';
import { InoperativeOperativeAccountReportComponent } from './pages/reports/inoperative-operative-account-report/inoperative-operative-account-report.component';
import { JournalReportComponent } from './pages/reports/journal-report/journal-report.component';
import { LedgerBalanceReportByCtrlComponent } from './pages/reports/ledger-balance-report-by-ctrl/ledger-balance-report-by-ctrl.component';
import { LedgerBalanceReportComponent } from './pages/reports/ledger-balance-report/ledger-balance-report.component';
import { LoanApplicationReportComponent } from './pages/reports/loan-application-report/loan-application-report.component';
import { LoanApplicationReport2Component } from './pages/reports/loan-application-report2/loan-application-report2.component';
import { LoanApprovedAndRejectedReportComponent } from './pages/reports/loan-approved-and-rejected-report/loan-approved-and-rejected-report.component';
import { LoanDefaulterReportComponent } from './pages/reports/loan-defaulter-report/loan-defaulter-report.component';
import { LoanDisbursementReportComponent } from './pages/reports/loan-disbursement-report/loan-disbursement-report.component';
import { LoanExpiryReportComponent } from './pages/reports/loan-expiry-report/loan-expiry-report.component';
import { LoanInformationReportComponent } from './pages/reports/loan-information-report/loan-information-report.component';
import { LoanReceivableAmountReportComponent } from './pages/reports/loan-receivable-amount-report/loan-receivable-amount-report.component';
import { LoanRecoveryReportComponent } from './pages/reports/loan-recovery-report/loan-recovery-report.component';
import { LoanTimeAllotmentReportComponent } from './pages/reports/loan-time-allotment-report/loan-time-allotment-report.component';
import { MemberAdmissionFormComponent } from './pages/reports/member-admission-form/member-admission-form.component';
import { MemberImageInformationReportComponent } from './pages/reports/member-image-information-report/member-image-information-report.component';
import { MemberLoanPerformanceReportComponent } from './pages/reports/member-loan-performance-report/member-loan-performance-report.component';
import { MemberNomineeStatementReportComponent } from './pages/reports/member-nominee-statement-report/member-nominee-statement-report.component';
import { MemberPersonnalLedgerDetailReportComponent } from './pages/reports/member-personnal-ledger-detail-report/member-personnal-ledger-detail-report.component';
import { MemberRegisterReportByAccountComponent } from './pages/reports/member-register-report-by-account/member-register-report-by-account.component';
import { MemberRegisterReportComponent } from './pages/reports/member-register-report/member-register-report.component';
import { MemberRelationInformationReportComponent } from './pages/reports/member-relation-information-report/member-relation-information-report.component';
import { MemberStatementReportComponent } from './pages/reports/member-statement-report/member-statement-report.component';
import { MonthlyMonitoringReportComponent } from './pages/reports/monthly-monitoring-report/monthly-monitoring-report.component';
import { MutualAidServiceReportComponent } from './pages/reports/mutual-aid-service-report/mutual-aid-service-report.component';
import { PersonnalLedgerComponent } from './pages/reports/personnal-ledger/personnal-ledger.component';
import { PreviousTransactionTransferReportComponent } from './pages/reports/previous-transaction-transfer-report/previous-transaction-transfer-report.component';
import { ProfitAndLossAppropriationTransactionComponent } from './pages/reports/profit-and-loss-appropriation-transaction/profit-and-loss-appropriation-transaction.component';
import { ProvisionBalanceReportComponent } from './pages/reports/provision-balance-report/provision-balance-report.component';
import { ReceivedAndPaymentReportsComponent } from './pages/reports/received-and-payment-reports/received-and-payment-reports.component';
//import { ChequeStatusChangeComponent } from './pages/cheque-status-change/cheque-status-change.component';
import { ReceivedPaymentRegisterByidReportComponent } from './pages/reports/received-payment-register-byid-report/received-payment-register-byid-report.component';
import { RiskyNonriskyLoanReportComponent } from './pages/reports/risky-nonrisky-loan-report/risky-nonrisky-loan-report.component';
import { StrengthAnalysisReportComponent } from './pages/reports/strength-analysis-report/strength-analysis-report.component';
import { VoterIdListComponent } from './pages/reports/voter-id-list/voter-id-list.component';
import { VoucherSearchReportComponent } from './pages/reports/voucher-search-report/voucher-search-report.component';
import { YeGlTransactionsListComponent } from './pages/reports/ye-gl-transactions-list/ye-gl-transactions-list.component';
import { YeGlTrialBalanceReportComponent } from './pages/reports/ye-gl-trial-balance-report/ye-gl-trial-balance-report.component';
import { ReverseChequeBookComponent } from './pages/reverse-cheque-book/reverse-cheque-book.component';
import { SavenDaysWithdrawalNoticeComponent } from './pages/saven-days-withdrawal-notice/saven-days-withdrawal-notice.component';
import { SearchChequeBookComponent } from './pages/search-cheque-book/search-cheque-book.component';
import { AccountBalanceTransferComponent } from './pages/special-transfer/account-balance-transfer/account-balance-transfer.component';
import { AccountToAccountBalanceTransferComponent } from './pages/special-transfer/account-to-account-balance-transfer/account-to-account-balance-transfer.component';
import { AccountTransactionTransferComponent } from './pages/special-transfer/account-transaction-transfer/account-transaction-transfer.component';
import { AccountTransferComponent } from './pages/special-transfer/account-transfer/account-transfer.component';
import { MemberTransferComponent } from './pages/special-transfer/member-transfer/member-transfer.component';
import { SuretyRefundTransactionComponent } from './pages/surety-refund-transaction/surety-refund-transaction.component';
import { SuretyReleaseTransactionComponent } from './pages/surety-release-transaction/surety-release-transaction.component';
import { ThanaCodeMaintenanceComponent } from './pages/thana-code-maintenance/thana-code-maintenance.component';
import { TransferDepositComponent } from './pages/transfer-deposit/transfer-deposit/transfer-deposit.component';
import { UpazilaCodeMaintenanceComponent } from './pages/upazila-code-maintenance/upazila-code-maintenance.component';
import { VerifyLoanApplicationComponent } from './pages/verify-loan-application/verify-loan-application.component';
import { VerifyMemberApplicationComponent } from './pages/verify-member-application/verify-member-application.component';
import { VerifyMemberSignatureCardComponent } from './pages/verify-member-signature-card/verify-member-signature-card.component';
import { VillageCodeMaintenanceComponent } from './pages/village-code-maintenance/village-code-maintenance.component';
import { YeGeneralJournalTransactionComponent } from './pages/ye-general-journal-transaction/ye-general-journal-transaction.component';
import { YeProfitLossAppropriationTransactionComponent } from './pages/ye-profit-loss-appropriation-transaction/ye-profit-loss-appropriation-transaction.component';
import { DividendProcessComponent } from './pages/year-closing-process/dividend-process/dividend-process.component';
import { PensionProcessComponent } from './pages/year-closing-process/pension-process/pension-process.component';
import { RebateProcessComponent } from './pages/year-closing-process/rebate-process/rebate-process.component';
import { ServiceChargeProcessComponent } from './pages/year-closing-process/service-charge-process/service-charge-process.component';
import { ShareProtectionProcessComponent } from './pages/year-closing-process/share-protection-process/share-protection-process.component';
import { StandardProcessComponent } from './pages/year-closing-process/standard-process/standard-process.component';
import { TimeDepositProcessComponent } from './pages/year-closing-process/time-deposit-process/time-deposit-process.component';
import { YearEndPostTranscationComponent } from './pages/year-end-post-transcation/year-end-post-transcation.component';
import { YearEndReverseTransactionComponent } from './pages/year-end-reverse-transaction/year-end-reverse-transaction.component';
import { LoanDisbRecoveryAnalysisReportComponent } from './pages/reports/loan-disb-recovery-analysis-report/loan-disb-recovery-analysis-report.component';
//import { LoanApplicationReport2Component } from './pages/reports/loan-application-report2/loan-application-report2.component';
import { DetailListReportComponent } from './pages/reports/detail-list-report/detail-list-report.component';
import { StandardAccountIntReportComponent } from './pages/reports/standard-account-int-report/standard-account-int-report.component';
import { OpenMemberInformationsComponent } from './pages/open-member-informations/open-member-informations.component';
import { AutoAccountOpenMemberInformationComponent } from './pages/open-member-informations/auto-account-open-member-information/auto-account-open-member-information.component';
import { GlToGlTransferComponent } from './pages/gl-to-gl-transfer/gl-to-gl-transfer.component';


const routes: Routes = [
  { path: '', component: AccountingComponent },
  { path: 'chart-of-account-report', component: ChartOfAccountReportComponent },
  { path: 'new-member-application', component: NewMemberApplicationComponent },
  {
    path: 'excel-collection-and-disbursement-sheet',
    component: ExcelCollectionSheetComponent,
  },
  {
    path: 'edit-member-application',
    component: EditMemberApplicationComponent,
  },
  {
    path: 'verify-member-application',
    component: VerifyMemberApplicationComponent,
  },
  {
    path: 'approve-member-application',
    component: ApproveMemberApplicationComponent,
  },
  {
    path: 'auto-new-account-openning/:source',
    component: AutoNewAccountOpenningComponent,
  },
  { path: 'add-nominee-maintenance', component: AddNomineeComponent },
  {
    path: 'account-opening-maintenance',
    component: AccountOpeningMaintenanceComponent,
  },
  {
    path: 'account-edit-maintenance',
    component: AccountEditMaintenanceComponent,
  },
  {
    path: 'modify-chart-of-account',
    component: ModifyChartOfAccountComponent,
  },
  { path: 'new-loan-application', component: NewLoanApplicationComponent },
  {
    path: 'loan-receivable-amount-report',
    component: LoanReceivableAmountReportComponent,
  },
  { path: 'member-register-report', component: MemberRegisterReportComponent },
  {
    path: 'member-register-report-by-account',
    component: MemberRegisterReportByAccountComponent,
  },
  {
    path: 'guarantor-surity-report',
    component: GuarantorSurityReportComponent,
  },
  {
    path: 'generate-new-member-number-list',
    component: GenerateNewMemberNumberListComponent,
  },
  {
    path: 'loan-information-report',
    component: LoanInformationReportComponent,
  },
  { path: 'cheque-book-register', component: ChequeBookRegisterComponent },

  {
    path: 'post-office-code-maintenance',
    component: PostOfficeCodeMaintenanceComponent,
  },
  {
    path: 'edit-member-informations',
    component: EditMemberInformationsComponent,
  },
  {
    path: 'post-office-code-maintenance',
    component: PostOfficeCodeMaintenanceComponent,
  },
  {
    path: 'edit-member-informations',
    component: EditMemberInformationsComponent,
  },
  {
    path: 'division-code-maintenance',
    component: DivisionCodeMaintenanceComponent,
  },
  {
    path: 'village-area-code-maintenance',
    component: VillageCodeMaintenanceComponent,
  },
  {
    path: 'district-code-maintenance',
    component: DistrictCodeMaintenanceComponent,
  },
  {
    path: 'upzila-code-maintenance',
    component: UpazilaCodeMaintenanceComponent,
  },
  { path: 'thana-code-maintenance', component: ThanaCodeMaintenanceComponent },
  { path: 'withdrawal', component: PaymentTransactionWithdrawalComponent },
  { path: 'loan-return-schedule', component: LoanReturnScheduleComponent },
  { path: 'cash-deposit', component: CashDepositComponent },
  { path: 'transfer-deposit', component: TransferDepositComponent },
  { path: 'account-status-change', component: AccountStatusChangeComponent },
  { path: 'member-status-change', component: MemberStatusChangeComponent },
  { path: 'auto-renewal-process', component: AutoRenewalProcessComponent },
  { path: 'auto-provision-process', component: AutoProvisionProcessComponent },
  { path: 'encashment', component: EncashmentComponent },
  {
    path: 'auto-anniversary-process',
    component: AutoAnniversaryProcessingComponent,
  },
  {
    path: 'auto-instruction-deposit-process',
    component: AutoInstructionDepositProcessComponent,
  },
  { path: 'auto-benefit-transfer', component: AutoBenefitTransferComponent },
  {
    path: 'auto-manual-transaction',
    component: AutoManualTransactionComponent,
  },
  { path: 'account-transfer', component: AccountTransferComponent },
  {
    path: 'a-c-to-a-c-balance-transfer',
    component: AccountToAccountBalanceTransferComponent,
  },
  {
    path: 'auto-anniversary-process',
    component: AutoAnniversaryProcessingComponent,
  },
  {
    path: 'auto-instruction-deposit-process',
    component: AutoInstructionDepositProcessComponent,
  },
  { path: 'new-group-maintenance', component: NewGroupMaintenaceComponent },
  {
    path: 'saven-days-withdrawal-notice',
    component: SavenDaysWithdrawalNoticeComponent,
  },
  {
    path: 'new-collector-maintenance',
    component: NewCollectorsMaintenanceComponent,
  },
  { path: 'counter-cheque-book', component: CounterChequeBookComponent },
  { path: 'cheque-book-issue', component: ChequeBookIssueComponent },
  {
    path: 'loan-risky-non-risky-balance-report',
    component: RiskyNonriskyLoanReportComponent,
  },
  {
    path: 'estimated-maturity-int.-report',
    component: EstimatedMaturityIntReportComponent,
  },
  {
    path: 'daily-transaction-summary-report',
    component: DailyTransactionSummaryReportComponent,
  },
  {
    path: 'cash-disbursement-payment-report',
    component: CashDisbursementReportComponent,
  },
  {
    path: 'member-statement',
    component: MemberStatementReportComponent,
  },
  {
    path: 'group-summary-statement',
    component: GroupSummaryStatementReportComponent,
  },
  {
    path: 'deposit-maturity-report',
    component: DepositMaturityReportComponent,
  },
  {
    path: 'account-transfer-report',
    component: AccountTransferReportComponent,
  },
  {
    path: 'provision-balance-report',
    component: ProvisionBalanceReportComponent,
  },
  {
    path: 'new-fixed-deposit',
    component: NewFixedDepositComponent,
  },
  {
    path: 'loan-expiry-report',
    component: LoanExpiryReportComponent,
  },
  {
    path: 'input-budget',
    component: BudgetParameterMaintenanceComponent,
  },
  {
    path: 'loan-time-allotment-report',
    component: LoanTimeAllotmentReportComponent,
  },
  {
    path: 'profit-&-loss-appropriation-transaction',
    component: ProfitLossAppropriationComponent,
  },
  {
    path: 'member-wise-nominee-information-report',
    component: MemberNomineeStatementReportComponent,
  },
  {
    path: 'prevoius-transaction-transfer-reports',
    component: PreviousTransactionTransferReportComponent,
  },
  {
    path: 'cheque-status-change',
    component: ChequeStatusChangeComponent,
  },
  {
    path: 'search-cheque-number',
    component: SearchChequeBookComponent,
  },
  {
    path: 'verify-daily-gl-transaction',
    component: GlVerifyDailyTransactionComponent,
  },
  {
    path: 'general-journal-transactions',
    component: GeneralJournalTransactionComponent,
  },
  {
    path: 'received-and-payment-register-by-id.',
    component: ReceivedPaymentRegisterByidReportComponent,
  },
  {
    path: 'daily-reverse-gl-transactions',
    component: DailyReverseGlTransactionComponent,
  },
  {
    path: 'account-statement',
    component: AccountStatementReportComponent,
  },
  { path: 'loan-settlement', component: LoanSettlementComponent },
  {
    path: 'reverse-cheque-book',
    component: ReverseChequeBookComponent,
  },
  {
    path: 'ye-general-journal-transactions',
    component: YeGeneralJournalTransactionComponent,
  },
  {
    path: 'member-card-authorization',
    component: MemberCardAuthorizationComponent,
  },
  {
    path: 'interest-benefit-withdrawal',
    component: BenefitWithdrawalComponent,
  },
  {
    path: 'edit-loan-account-informations',
    component: EditLoanAccountComponent,
  },
  {
    path: 'member-personnal-ledger-detail',
    component: MemberPersonnalLedgerDetailReportComponent,
  },
  {
    path: 'member-relation-information',
    component: MemberRelationInformationReportComponent,
  },
  {
    path: 'loan-disbursement',
    component: LoanDisbursementComponent,
  },
  {
    path: 'loan-disbursement-report',
    component: LoanDisbursementReportComponent,
  },
  {
    path: 'journal-reports',
    component: JournalReportComponent,
  },
  {
    path: 'verify-loan-application',
    component: VerifyLoanApplicationComponent,
  },
  {
    path: 'cash-book-report',
    component: CashBookReportComponent,
  },
  {
    path: 'profit-and-loss-appropriation-maint.',
    component: ProfitAndLossAppropriationComponent,
  },
  {
    path: 'adjustment-transactions',
    component: AdjustmentTransactionsComponent,
  },
  {
    path: 'approve-loan-application',
    component: ApproveLoanApplicationComponent,
  },
  {
    path: 'daily-transaction-voucher-report2',
    component: DailyTransactionVoucherReportComponent,
  },
  { path: 'member-deposit-query', component: MemberDepositQueryComponent },
  {
    path: 'open-chart-of-account',
    component: OpenChartOfAccountComponent,
  },
  {
    path: 'loan-account-reject',
    component: LoanApplicationRejectComponent,
  },
  {
    path: 'edit-loan-application',
    component: EditLoanApplicationComponent,
  },
  {
    path: 'booth-gl-code-control-maintenance',
    component: BoothGlCodeControlMaintenanceComponent,
  },
  {
    path: 'cs-voucher-wise-transaction-list',
    component: CsVoucherWiseTransactionReportComponent,
  },
  {
    path: 'cs-transaction-list',
    component: CsDailyTransactionReportComponent,
  },
  {
    path: 'loan-payment-schedule',
    component: LoanPaymentScheduleComponent,
  },
  {
    path: 'verify-daily-cs-transactions',
    component: CsVerifyDailyTransactionComponent,
  },
  {
    path: 'loan-re-schedule',
    component: CsLoanRescheduleComponent,
  },
  {
    path: 'daily-reverse-cs-transaction',
    component: DailyReverseCsTransactionComponent,
  },
  {
    path: 'day-end-process',
    component: DayEndProcessComponent,
  },
  {
    path: 'day-end-process-test',
    component: DayEndProcessTestComponent,
  },
  {
    path: 'member-picture-authorization',
    component: MemberPictureAuthorizationComponent,
  },
  {
    path: 'member-signature-authorization',
    component: MemberSignatureAuthorizationComponent,
  },
  {
    path: 'member-referance-picture-authorization',
    component: MemberReferancePictureAuthorizationComponent,
  },
  {
    path: 'verify-member-signature-card',
    component: VerifyMemberSignatureCardComponent,
  },
  {
    path: 'voucher-search-report',
    component: VoucherSearchReportComponent,
  },
  {
    path: 'final-accounts-reports',
    component: FinalAccountsReportComponent,
  },
  { path: 'day-end-process', component: DayEndProcessComponent },
  { path: 'day-end-process-test', component: DayEndProcessTestComponent },
  {
    path: 'cash-collection-report-by-a-c-type',
    component: CashCollectionReportByACTypeComponent,
  },
  { path: 'day-end-process', component: DayEndProcessComponent },
  { path: 'day-end-process-test', component: DayEndProcessTestComponent },
  {
    path: 'loan-time-allowance-ta',
    component: LoanTimeAllowanceComponent,
  },
  { path: 'day-end-process', component: DayEndProcessComponent },
  { path: 'day-end-process-test', component: DayEndProcessTestComponent },
  {
    path: 'loan-surety-release',
    component: SuretyReleaseTransactionComponent,
  },
  { path: 'standerd-int.-process', component: StandardProcessComponent },
  { path: 'pension-int.-process', component: PensionProcessComponent },
  { path: 'time-deposit-int.-process', component: TimeDepositProcessComponent },
  { path: 'dividend-process', component: DividendProcessComponent },
  {
    path: 'share-protection-process',
    component: ShareProtectionProcessComponent,
  },
  { path: 'rebate-process', component: RebateProcessComponent },
  { path: 'service-charge-process', component: ServiceChargeProcessComponent },
  { path: 'loan-surety-refund', component: SuretyRefundTransactionComponent },
  {
    path: 'reverse-ye-gl-transactions',
    component: YearEndReverseTransactionComponent,
  },
  {
    path: 'post-ye-gl-transactions',
    component: YearEndPostTranscationComponent,
  },
  {
    path: 'ye-profit-and-loss-appropriation-transaction',
    component: YeProfitLossAppropriationTransactionComponent,
  },
  {
    path: 'ledger-balance-report',
    component: LedgerBalanceReportComponent,
  },
  {
    path: 'account-statement-reports',
    component: GlAccountStatementReportsComponent,
  },
  {
    path: 'sms-members-ledger-balance',
    component: AccountLedgerBalanceSmsServiceComponent,
  },
  {
    path: 'sms-greetings-service',
    component: MemberGreetingSmsServiceComponent,
  },
  { path: 'backup-database', component: BackUpProcessComponent },
  {
    path: 'account-balance-transfer',
    component: AccountBalanceTransferComponent,
  },
  {
    path: 'account-transaction-transfer',
    component: AccountTransactionTransferComponent,
  },
  {
    path: 'loan-application-report',
    component: LoanApplicationReportComponent,
  },
  {
    path: 'sms-members-ledger-balance',
    component: AccountLedgerBalanceSmsServiceComponent,
  },
  {
    path: 'sms-greetings-service',
    component: MemberGreetingSmsServiceComponent,
  },
  {
    path: 'daily-transaction-voucher-report',
    component: CsDailyTransactionVoucherReportComponent,
  },
  {
    path: 'voter-id-list',
    component: VoterIdListComponent,
  },
  {
    path: 'member-loan-performence-report',
    component: MemberLoanPerformanceReportComponent,
  },
  {
    path: 'cash-collection-report',
    component: CashCollectionReportComponent,
  },
  {
    path: 'budget-reports',
    component: BudgetReportsComponent,
  },
  {
    path: 'identity-card-list',
    component: IdentityCardListComponent,
  },
  {
    path: 'received-and-payment-reports',
    component: ReceivedAndPaymentReportsComponent,
  },
  {
    path: 'member-image-information-report',
    component: MemberImageInformationReportComponent,
  },
  {
    path: 'member-admission-form',
    component: MemberAdmissionFormComponent,
  },
  {
    path: 'account-open-and-close-register',
    component: AccountOpenAndCloseRegisterComponent,
  },

  {
    path: 'member-transfer',
    component: MemberTransferComponent,
  },
  { path: 'member-transfer', component: MemberTransferComponent },
  {
    path: 'blank-collection-sheet',
    component: BlankCollectionSheetComponent,
  },
  {
    path: 'loan-recovery-report',
    component: LoanRecoveryReportComponent,
  },
  {
    path: 'loan-approved-and-rejected-report',
    component: LoanApprovedAndRejectedReportComponent,
  },
  {
    path: 'deposit-defaulter-report',
    component: DepositDefaulterReportComponent,
  },
  {
    path: 'inoperative-operative-account-report',
    component: InoperativeOperativeAccountReportComponent,
  },
  {
    path: 'profit-and-loss-appropriation-transaction',
    // component: ProfitAndLossAppropriationTransactionComponent,
    component:ProfitLossAppropriationComponent,
  },

  {
    path: 'personnal-ledger',
    component: PersonnalLedgerComponent,
  },
  {
    path: 'mutual-aid-service-report',
    component: MutualAidServiceReportComponent,
  },
  {
    path: 'ledger-balance-report-by-ctrl',
    component: LedgerBalanceReportByCtrlComponent,
  },
  {
    path: 'loan-defaulter-report',
    component: LoanDefaulterReportComponent,
  },
  {
    path: 'ye-gl-transactions-list',
    component: YeGlTransactionsListComponent,
  },
  {
    path: 'ye-gl-trial-balance-report',
    component: YeGlTrialBalanceReportComponent,
  },
  {
    path: 'monthly-monitoring-report',
    component: MonthlyMonitoringReportComponent,
  },
  {
    path: 'audit-reports',
    component: AuditReportsComponent,
  },
  {
    path: 'strength-analysis-report',
    component: StrengthAnalysisReportComponent,
  },

  { path: 'collector-transfer', component: CollectorTransferComponent },

  {
    path: 'loan-application-report2',
    component: LoanApplicationReport2Component,
  },

  {
    path: 'loan-application-report2',
    component: LoanApplicationReport2Component,
  },

  { path: 'collector-transfer', component: CollectorTransferComponent },
  {
    path: 'loan-disb.and-recovery-analysis-report',
    component: LoanDisbRecoveryAnalysisReportComponent,
  },
  {
    path: 'detail-list-report',
    component: DetailListReportComponent,
  },
  {
    path: 'standerd-account-int-report',
    component: StandardAccountIntReportComponent,
  },
  {
    path: 'open-member-information',
    component: OpenMemberInformationsComponent,
  },
  {
    path: 'open-member-information-auto-acc',
    component: AutoAccountOpenMemberInformationComponent
    ,
  },
  {
    path: 'member-loan-performance-report',
    component: MemberLoanPerformanceReportComponent
    ,
  }, 
  {
    path:'gl-to-gl-transfer',
    component:GlToGlTransferComponent

  },



  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountingRoutingModule {}
export const routingComponents = [
  ChartOfAccountReportComponent,
  LoanReturnScheduleComponent,
];
