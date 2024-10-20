import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { DatePipe } from '@angular/common';

import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingComponent } from './Home/accounting.component';
import { NewMemberApplicationComponent } from './pages/new-member-application/new-member-application.component';
import { EditMemberApplicationComponent } from './pages/edit-member-application/edit-member-application.component';
import { AccountOpeningMaintenanceComponent } from './pages/account-opening-maintenance/account-opening-maintenance.component';
import { NewLoanApplicationComponent } from './pages/new-loan-application/new-loan-application.component';
import { ChartOfAccountReportComponent } from './pages/reports/chart-of-account-report/chart-of-account-report.component';
import { LoanReceivableAmountReportComponent } from './pages/reports/loan-receivable-amount-report/loan-receivable-amount-report.component';
import { MemberRegisterReportComponent } from './pages/reports/member-register-report/member-register-report.component';
import { MemberRegisterReportByAccountComponent } from './pages/reports/member-register-report-by-account/member-register-report-by-account.component';
import { GuarantorSurityReportComponent } from './pages/reports/guarantor-surity-report/guarantor-surity-report.component';
import { GenerateNewMemberNumberListComponent } from './pages/reports/generate-new-member-number-list/generate-new-member-number-list.component';
import { LoanInformationReportComponent } from './pages/reports/loan-information-report/loan-information-report.component';
import { ChequeBookRegisterComponent } from './pages/reports/cheque-book-register/cheque-book-register.component';
import { LoanApplicationInfoComponent } from './pages/new-loan-application/loan-application-info/loan-application-info.component';
import { LoanShareGuarantorComponent } from './pages/new-loan-application/loan-share-guarantor/loan-share-guarantor.component';
import { LoanDepositGuarantorComponent } from './pages/new-loan-application/loan-deposit-guarantor/loan-deposit-guarantor.component';
import { LoanPropertyGuarantorComponent } from './pages/new-loan-application/loan-property-guarantor/loan-property-guarantor.component';
import { VerifyMemberApplicationComponent } from './pages/verify-member-application/verify-member-application.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ApproveMemberApplicationComponent } from './pages/approve-member-application/approve-member-application.component';
import { AutoNewAccountOpenningComponent } from './pages/approve-member-application/auto-new-account-openning/auto-new-account-openning.component';
import { DepositAccountListComponent } from './pages/new-loan-application/deposit-account-list/deposit-account-list.component';
import { OnlyNumberDirective } from './services/only-number.directive';
import { AddNomineeComponent } from './pages/approve-member-application/auto-new-account-openning/add-nominee/add-nominee.component';
import { PostOfficeCodeMaintenanceComponent } from './pages/post-office-code-maintenance/post-office-code-maintenance.component';
import { EditMemberInformationsComponent } from './pages/edit-member-informations/edit-member-informations.component';
import { DivisionCodeMaintenanceComponent } from './pages/division-code-maintenance/division-code-maintenance.component';
import { VillageCodeMaintenanceComponent } from './pages/village-code-maintenance/village-code-maintenance.component';
import { DistrictCodeMaintenanceComponent } from './pages/district-code-maintenance/district-code-maintenance.component';
import { UpazilaCodeMaintenanceComponent } from './pages/upazila-code-maintenance/upazila-code-maintenance.component';
import { ThanaCodeMaintenanceComponent } from './pages/thana-code-maintenance/thana-code-maintenance.component';
import { PaymentTransactionWithdrawalComponent } from './pages/payment-transaction-withdrawal/payment-transaction-withdrawal.component';
import { LoanReturnScheduleComponent } from './pages/new-loan-application/loan-return-schedule/loan-return-schedule.component';
import { CashDepositComponent } from './pages/cash-deposit/cash-deposit.component';
import { AccountStatusChangeComponent } from './pages/account-status-change/account-status-change.component';
import { NewGroupMaintenaceComponent } from './pages/new-group-maintenace/new-group-maintenace.component';

import { RiskyNonriskyLoanReportComponent } from './pages/reports/risky-nonrisky-loan-report/risky-nonrisky-loan-report.component';
import { EstimatedMaturityIntReportComponent } from './pages/reports/estimated-maturity-int-report/estimated-maturity-int-report.component';
import { DailyTransactionSummaryReportComponent } from './pages/reports/daily-transaction-summary-report/daily-transaction-summary-report.component';
import { CashDisbursementReportComponent } from './pages/reports/cash-disbursement-report/cash-disbursement-report.component';
import { NewCollectorsMaintenanceComponent } from './pages/new-collectors-maintenance/new-collectors-maintenance.component';
import { CounterChequeBookComponent } from './pages/counter-cheque-book/counter-cheque-book.component';
import { TransferDepositComponent } from './pages/transfer-deposit/transfer-deposit/transfer-deposit.component';
import { ChequeBookIssueComponent } from './pages/cheque-book-issue/cheque-book-issue.component';
import { MemberStatementReportComponent } from './pages/reports/member-statement-report/member-statement-report.component';
import { MemberStatusChangeComponent } from './pages/member-status-change/member-status-change.component';
import { AutoRenewalProcessComponent } from './pages/auto-renewal-process/auto-renewal-process.component';
import { AutoProvisionProcessComponent } from './pages/auto-provision-process/auto-provision-process.component';
import { AutoAnniversaryProcessingComponent } from './pages/auto-anniversary-processing/auto-anniversary-processing.component';
import { AutoInstructionDepositProcessComponent } from './pages/auto-instruction-deposit-process/auto-instruction-deposit-process.component';
import { GroupSummaryStatementReportComponent } from './pages/reports/group-summary-statement-report/group-summary-statement-report.component';
import { DepositMaturityReportComponent } from './pages/reports/deposit-maturity-report/deposit-maturity-report.component';
import { AccountTransferReportComponent } from './pages/reports/account-transfer-report/account-transfer-report.component';
import { ProvisionBalanceReportComponent } from './pages/reports/provision-balance-report/provision-balance-report.component';
import { NewFixedDepositComponent } from './pages/new-fixed-deposit/new-fixed-deposit.component';
import { LoanExpiryReportComponent } from './pages/reports/loan-expiry-report/loan-expiry-report.component';
import { AutoBenefitTransferComponent } from './pages/auto-benefit-transfer/auto-benefit-transfer.component';
import { BudgetParameterMaintenanceComponent } from './pages/budget-parameter-maintenance/budget-parameter-maintenance.component';
import { OnlyNumberWithoutDecimalDirective } from './services/only-number-without-decimal.directive';
import { LoanTimeAllotmentReportComponent } from './pages/reports/loan-time-allotment-report/loan-time-allotment-report.component';
import { ProfitLossAppropriationComponent } from './pages/profit-loss-appropriation/profit-loss-appropriation.component';
import { MemberNomineeStatementReportComponent } from './pages/reports/member-nominee-statement-report/member-nominee-statement-report.component';
import { AccountTransferComponent } from './pages/special-transfer/account-transfer/account-transfer.component';
import { PreviousTransactionTransferReportComponent } from './pages/reports/previous-transaction-transfer-report/previous-transaction-transfer-report.component';
import { ReceivedPaymentRegisterByidReportComponent } from './pages/reports/received-payment-register-byid-report/received-payment-register-byid-report.component';
import { DailyReverseGlTransactionComponent } from './pages/daily-reverse-gl-transaction/daily-reverse-gl-transaction.component';
import { AccountStatementReportComponent } from './pages/reports/account-statement-report/account-statement-report.component';
import { GlVerifyDailyTransactionComponent } from './pages/gl-verify-daily-transaction/gl-verify-daily-transaction.component';
import { GeneralJournalTransactionComponent } from './pages/general-journal-transaction/general-journal-transaction.component';
import { LoanSettlementComponent } from './pages/loan-settlement/loan-settlement.component';
import { ChequeStatusChangeComponent } from './pages/cheque-status-change/cheque-status-change.component';
import { ReverseChequeBookComponent } from './pages/reverse-cheque-book/reverse-cheque-book.component';
import { YeGeneralJournalTransactionComponent } from './pages/ye-general-journal-transaction/ye-general-journal-transaction.component';
import { AccountEditMaintenanceComponent } from './pages/account-edit-maintenance/account-edit-maintenance.component';
import { MemberCardAuthorizationComponent } from './pages/member-card-authorization/member-card-authorization.component';
import { BenefitWithdrawalComponent } from './pages/benefit-withdrawal/benefit-withdrawal.component';
import { EditLoanAccountComponent } from './pages/edit-loan-account/edit-loan-account.component';
import { EditLoanAccountInfoComponent } from './pages/edit-loan-account/edit-loan-account-info/edit-loan-account-info.component';
import { ModifyChartOfAccountComponent } from './pages/modify-chart-of-account/modify-chart-of-account.component';
import { ChequeBookCounterComponent } from './pages/counter-cheque-book/cheque-book-counter/cheque-book-counter.component';
import { MemberPersonnalLedgerDetailReportComponent } from './pages/reports/member-personnal-ledger-detail-report/member-personnal-ledger-detail-report.component';
import { SearchChequeBookComponent } from './pages/search-cheque-book/search-cheque-book.component';
import { MemberRelationInformationReportComponent } from './pages/reports/member-relation-information-report/member-relation-information-report.component';
import { LoanDisbursementReportComponent } from './pages/reports/loan-disbursement-report/loan-disbursement-report.component';
import { IbwAccountDetailsLongTermComponent } from './pages/benefit-withdrawal/ibw-account-details-long-term/ibw-account-details-long-term.component';
import { IbwAccountDetailsShortTermComponent } from './pages/benefit-withdrawal/ibw-account-details-short-term/ibw-account-details-short-term.component';
import { EditLoanAccShareGuarantorComponent } from './pages/edit-loan-account/edit-loan-acc-share-guarantor/edit-loan-acc-share-guarantor.component';
import { EditLoanAccDepositGuarantorComponent } from './pages/edit-loan-account/edit-loan-acc-deposit-guarantor/edit-loan-acc-deposit-guarantor.component';
import { EditLoanAccPropertyGuarantorComponent } from './pages/edit-loan-account/edit-loan-acc-property-guarantor/edit-loan-acc-property-guarantor.component';
import { LoanDisbursementComponent } from './pages/loan-disbursement/loan-disbursement.component';
import { LoanDisbursementAccountDetailsComponent } from './pages/loan-disbursement/loan-disbursement-account-details/loan-disbursement-account-details.component';
import { JournalReportComponent } from './pages/reports/journal-report/journal-report.component';
import { VerifyLoanApplicationComponent } from './pages/verify-loan-application/verify-loan-application.component';
import { EncashmentComponent } from './pages/encashment/encashment.component';
import { CashBookReportComponent } from './pages/reports/cash-book-report/cash-book-report.component';
import { ProfitAndLossAppropriationComponent } from './pages/profit-and-loss-appropriation/profit-and-loss-appropriation.component';
import { AdjustmentTransactionsComponent } from './pages/adjustment-transactions/adjustment-transactions.component';
import { AdjustmentAccountDetailsComponent } from './pages/adjustment-transactions/adjustment-account-details/adjustment-account-details.component';
import { EncashmentAccountInfoComponent } from './pages/encashment/encashment-account-info/encashment-account-info.component';
import { ApproveLoanApplicationComponent } from './pages/approve-loan-application/approve-loan-application.component';
import { DailyTransactionVoucherReportComponent } from './pages/reports/daily-transaction-voucher-report/daily-transaction-voucher-report.component';
import { MemberDepositQueryComponent } from './pages/member-deposit-query/member-deposit-query.component';
import { OpenChartOfAccountComponent } from './pages/open-chart-of-account/open-chart-of-account.component';
import { LoanApplicationRejectComponent } from './pages/loan-application-reject/loan-application-reject.component';
import { EditLoanApplicationComponent } from './pages/edit-loan-application/edit-loan-application.component';
import { EditLoanApplicationInfoComponent } from './pages/edit-loan-application/edit-loan-application-info/edit-loan-application-info.component';
import { BoothGlCodeControlMaintenanceComponent } from './pages/booth-gl-code-control-maintenance/booth-gl-code-control-maintenance.component';
import { CsVoucherWiseTransactionReportComponent } from './pages/reports/cs-voucher-wise-transaction-report/cs-voucher-wise-transaction-report.component';
import { CsDailyTransactionReportComponent } from './pages/reports/cs-daily-transaction-report/cs-daily-transaction-report.component';
import { LoanPaymentScheduleComponent } from './pages/loan-payment-schedule/loan-payment-schedule.component';
import { CsVerifyDailyTransactionComponent } from './pages/cs-verify-daily-transaction/cs-verify-daily-transaction.component';
import { DailyReverseCsTransactionComponent } from './pages/daily-reverse-cs-transaction/daily-reverse-cs-transaction.component';
import { CsLoanRescheduleComponent } from './pages/cs-loan-reschedule/cs-loan-reschedule.component';
import { FinalAccountsReportComponent } from './pages/reports/final-accounts-report/final-accounts-report.component';
import { DayEndProcessComponent } from './pages/day-end-process/day-end-process.component';
import { DayEndProcessTestComponent } from './pages/day-end-process-test/day-end-process-test.component';
import { LoanTimeAllowanceComponent } from './pages/loan-time-allowance/loan-time-allowance.component';
import { MemberPictureAuthorizationComponent } from './pages/member-picture-authorization/member-picture-authorization.component';
import { MemberSignatureAuthorizationComponent } from './pages/member-signature-authorization/member-signature-authorization.component';
import { MemberReferancePictureAuthorizationComponent } from './pages/member-referance-picture-authorization/member-referance-picture-authorization.component';
import { VerifyMemberSignatureCardComponent } from './pages/verify-member-signature-card/verify-member-signature-card.component';
import { VoucherSearchReportComponent } from './pages/reports/voucher-search-report/voucher-search-report.component';
import { CashCollectionReportByACTypeComponent } from './pages/reports/cash-collection-report-by-a-c-type/cash-collection-report-by-a-c-type.component';
import { SuretyReleaseTransactionComponent } from './pages/surety-release-transaction/surety-release-transaction.component';
import { StandardProcessComponent } from './pages/year-closing-process/standard-process/standard-process.component';
import { PensionProcessComponent } from './pages/year-closing-process/pension-process/pension-process.component';
import { TimeDepositProcessComponent } from './pages/year-closing-process/time-deposit-process/time-deposit-process.component';
import { DividendProcessComponent } from './pages/year-closing-process/dividend-process/dividend-process.component';
import { ShareProtectionProcessComponent } from './pages/year-closing-process/share-protection-process/share-protection-process.component';
import { RebateProcessComponent } from './pages/year-closing-process/rebate-process/rebate-process.component';
import { ServiceChargeProcessComponent } from './pages/year-closing-process/service-charge-process/service-charge-process.component';
import { SuretyRefundTransactionComponent } from './pages/surety-refund-transaction/surety-refund-transaction.component';
import { YearEndReverseTransactionComponent } from './pages/year-end-reverse-transaction/year-end-reverse-transaction.component';
import { YearEndPostTranscationComponent } from './pages/year-end-post-transcation/year-end-post-transcation.component';
import { YeProfitLossAppropriationTransactionComponent } from './pages/ye-profit-loss-appropriation-transaction/ye-profit-loss-appropriation-transaction.component';
import { LedgerBalanceReportComponent } from './pages/reports/ledger-balance-report/ledger-balance-report.component';
import { GlAccountStatementReportsComponent } from './pages/reports/gl-account-statement-reports/gl-account-statement-reports.component';
import { AccountLedgerBalanceSmsServiceComponent } from './pages/account-ledger-balance-sms-service/account-ledger-balance-sms-service.component';
import { RebateVerifyListComponent } from './pages/year-closing-process/rebate-process/rebate-verify-list/rebate-verify-list.component';
import { MemberGreetingSmsServiceComponent } from './pages/member-greeting-sms-service/member-greeting-sms-service.component';
import { CsDailyTransactionVoucherReportComponent } from './pages/reports/cs-daily-transaction-voucher-report/cs-daily-transaction-voucher-report.component';
import { VoterIdListComponent } from './pages/reports/voter-id-list/voter-id-list.component';

import { BackUpProcessComponent } from './pages/back-up-process/back-up-process.component';
import { AccountToAccountBalanceTransferComponent } from './pages/special-transfer/account-to-account-balance-transfer/account-to-account-balance-transfer.component';
import { AccountBalanceTransferComponent } from './pages/special-transfer/account-balance-transfer/account-balance-transfer.component';
import { BudgetReportsComponent } from './pages/reports/budget-reports/budget-reports.component';
import { IdentityCardListComponent } from './pages/reports/identity-card-list/identity-card-list.component';
import { AccountTransactionTransferComponent } from './pages/special-transfer/account-transaction-transfer/account-transaction-transfer.component';
import { LoanApplicationReportComponent } from './pages/reports/loan-application-report/loan-application-report.component';
import { MemberLoanPerformanceReportComponent } from './pages/reports/member-loan-performance-report/member-loan-performance-report.component';
import { CashCollectionReportComponent } from './pages/reports/cash-collection-report/cash-collection-report.component';
import { ReceivedAndPaymentReportsComponent } from './pages/reports/received-and-payment-reports/received-and-payment-reports.component';
import { MemberImageInformationReportComponent } from './pages/reports/member-image-information-report/member-image-information-report.component';
import { MemberAdmissionFormComponent } from './pages/reports/member-admission-form/member-admission-form.component';
import { AccountOpenAndCloseRegisterComponent } from './pages/reports/account-open-and-close-register/account-open-and-close-register.component';
import { MemberTransferComponent } from './pages/special-transfer/member-transfer/member-transfer.component';
import { BlankCollectionSheetComponent } from './pages/reports/blank-collection-sheet/blank-collection-sheet.component';
import { LoanRecoveryReportComponent } from './pages/reports/loan-recovery-report/loan-recovery-report.component';
import { LoanApprovedAndRejectedReportComponent } from './pages/reports/loan-approved-and-rejected-report/loan-approved-and-rejected-report.component';
import { DepositDefaulterReportComponent } from './pages/reports/deposit-defaulter-report/deposit-defaulter-report.component';
import { InoperativeOperativeAccountReportComponent } from './pages/reports/inoperative-operative-account-report/inoperative-operative-account-report.component';
import { PersonnalLedgerComponent } from './pages/reports/personnal-ledger/personnal-ledger.component';
import { MutualAidServiceReportComponent } from './pages/reports/mutual-aid-service-report/mutual-aid-service-report.component';
import { LedgerBalanceReportByCtrlComponent } from './pages/reports/ledger-balance-report-by-ctrl/ledger-balance-report-by-ctrl.component';
import { ProfitAndLossAppropriationTransactionComponent } from './pages/reports/profit-and-loss-appropriation-transaction/profit-and-loss-appropriation-transaction.component';
import { LoanDefaulterReportComponent } from './pages/reports/loan-defaulter-report/loan-defaulter-report.component';
import { AutoManualTransactionComponent } from './pages/auto-manual-transaction/auto-manual-transaction.component';
import { YeGlTransactionsListComponent } from './pages/reports/ye-gl-transactions-list/ye-gl-transactions-list.component';
import { YeGlTrialBalanceReportComponent } from './pages/reports/ye-gl-trial-balance-report/ye-gl-trial-balance-report.component';
import { MonthlyMonitoringReportComponent } from './pages/reports/monthly-monitoring-report/monthly-monitoring-report.component';
import { AuditReportsComponent } from './pages/reports/audit-reports/audit-reports.component';
import { BoothCsVoucherWiseTransactionReportComponent } from './pages/reports/booth-cs-voucher-wise-transaction-report/booth-cs-voucher-wise-transaction-report.component';
import { BoothJournalReportComponent } from './pages/reports/booth-journal-report/booth-journal-report.component';
import { BoothReceivedAndPaymentReportComponent } from './pages/reports/booth-received-and-payment-report/booth-received-and-payment-report.component';
import { StrengthAnalysisReportComponent } from './pages/reports/strength-analysis-report/strength-analysis-report.component';
import { SavenDaysWithdrawalNoticeComponent } from './pages/saven-days-withdrawal-notice/saven-days-withdrawal-notice.component';
import { ExcelCollectionSheetComponent } from './pages/excel-collection-sheet/excel-collection-sheet.component';
import { CollectorTransferComponent } from './pages/collector-transfer/collector-transfer.component';
import { LoanDisbRecoveryAnalysisReportComponent } from './pages/reports/loan-disb-recovery-analysis-report/loan-disb-recovery-analysis-report.component';
import { LoanApplicationReport2Component } from './pages/reports/loan-application-report2/loan-application-report2.component';
import { DetailListReportComponent } from './pages/reports/detail-list-report/detail-list-report.component';
import { StandardAccountIntReportComponent } from './pages/reports/standard-account-int-report/standard-account-int-report.component';
import { OpenMemberInformationsComponent } from './pages/open-member-informations/open-member-informations.component';
import { AutoAccountOpenMemberInformationComponent } from './pages/open-member-informations/auto-account-open-member-information/auto-account-open-member-information.component';
import { ChequeBookCounterModalComponent } from './pages/counter-cheque-book/cheque-book-counter-modal/cheque-book-counter-modal.component';
import { GlToGlTransferComponent } from './pages/gl-to-gl-transfer/gl-to-gl-transfer.component';

@NgModule({
  declarations: [
    AccountingComponent,
    ChartOfAccountReportComponent,
    NewMemberApplicationComponent,
    EditMemberApplicationComponent,
    AccountOpeningMaintenanceComponent,
    NewLoanApplicationComponent,
    LoanReceivableAmountReportComponent,
    MemberRegisterReportComponent,
    MemberRegisterReportByAccountComponent,
    GuarantorSurityReportComponent,
    GenerateNewMemberNumberListComponent,
    LoanInformationReportComponent,
    ChequeBookRegisterComponent,
    LoanApplicationInfoComponent,
    LoanShareGuarantorComponent,
    LoanDepositGuarantorComponent,
    LoanPropertyGuarantorComponent,
    VerifyMemberApplicationComponent,
    ApproveMemberApplicationComponent,
    DepositAccountListComponent,
    OnlyNumberDirective,
    AutoNewAccountOpenningComponent,
    DepositAccountListComponent,
    AddNomineeComponent,
    PostOfficeCodeMaintenanceComponent,
    EditMemberInformationsComponent,
    DivisionCodeMaintenanceComponent,
    VillageCodeMaintenanceComponent,
    DistrictCodeMaintenanceComponent,
    UpazilaCodeMaintenanceComponent,
    ThanaCodeMaintenanceComponent,
    PaymentTransactionWithdrawalComponent,
    CashDepositComponent,
    RiskyNonriskyLoanReportComponent,
    EstimatedMaturityIntReportComponent,
    LoanReturnScheduleComponent,
    CashDepositComponent,
    DailyTransactionSummaryReportComponent,
    CashDisbursementReportComponent,
    AccountStatusChangeComponent,
    NewGroupMaintenaceComponent,
    NewCollectorsMaintenanceComponent,
    CounterChequeBookComponent,
    TransferDepositComponent,
    ChequeBookIssueComponent,
    MemberStatementReportComponent,
    MemberStatusChangeComponent,
    AutoRenewalProcessComponent,
    AutoProvisionProcessComponent,
    AutoAnniversaryProcessingComponent,
    AutoInstructionDepositProcessComponent,
    GroupSummaryStatementReportComponent,
    DepositMaturityReportComponent,
    AccountTransferReportComponent,
    ProvisionBalanceReportComponent,
    NewFixedDepositComponent,
    LoanExpiryReportComponent,
    AutoBenefitTransferComponent,
    BudgetParameterMaintenanceComponent,
    OnlyNumberWithoutDecimalDirective,
    LoanTimeAllotmentReportComponent,
    ProfitLossAppropriationComponent,
    MemberNomineeStatementReportComponent,
    AccountTransferComponent,
    AccountToAccountBalanceTransferComponent,
    PreviousTransactionTransferReportComponent,
    ReceivedPaymentRegisterByidReportComponent,
    DailyReverseGlTransactionComponent,
    AccountStatementReportComponent,
    GlVerifyDailyTransactionComponent,
    GeneralJournalTransactionComponent,
    LoanSettlementComponent,
    ChequeStatusChangeComponent,
    ReverseChequeBookComponent,
    YeGeneralJournalTransactionComponent,
    AccountEditMaintenanceComponent,
    MemberCardAuthorizationComponent,
    BenefitWithdrawalComponent,
    EditLoanAccountComponent,
    EditLoanAccountInfoComponent,
    ModifyChartOfAccountComponent,
    ChequeBookCounterComponent,
    MemberPersonnalLedgerDetailReportComponent,
    SearchChequeBookComponent,
    MemberRelationInformationReportComponent,
    LoanDisbursementReportComponent,
    IbwAccountDetailsLongTermComponent,
    IbwAccountDetailsShortTermComponent,
    EditLoanAccShareGuarantorComponent,
    EditLoanAccDepositGuarantorComponent,
    EditLoanAccPropertyGuarantorComponent,
    LoanDisbursementComponent,
    LoanDisbursementAccountDetailsComponent,
    JournalReportComponent,
    VerifyLoanApplicationComponent,
    CashBookReportComponent,
    ProfitAndLossAppropriationComponent,
    AdjustmentTransactionsComponent,
    AdjustmentAccountDetailsComponent,
    EncashmentComponent,
    EncashmentAccountInfoComponent,
    ApproveLoanApplicationComponent,
    DailyTransactionVoucherReportComponent,
    EncashmentComponent,
    MemberDepositQueryComponent,
    OpenChartOfAccountComponent,
    LoanApplicationRejectComponent,
    EditLoanApplicationComponent,
    EditLoanApplicationInfoComponent,
    BoothGlCodeControlMaintenanceComponent,
    CsVoucherWiseTransactionReportComponent,
    CsDailyTransactionReportComponent,
    LoanPaymentScheduleComponent,
    CsVerifyDailyTransactionComponent,
    DailyReverseCsTransactionComponent,
    DayEndProcessComponent,
    DayEndProcessTestComponent,
    MemberPictureAuthorizationComponent,
    MemberSignatureAuthorizationComponent,
    MemberReferancePictureAuthorizationComponent,
    VerifyMemberSignatureCardComponent,
    VoucherSearchReportComponent,
    CsLoanRescheduleComponent,
    FinalAccountsReportComponent,
    DayEndProcessComponent,
    DayEndProcessTestComponent,
    CashCollectionReportByACTypeComponent,
    LoanTimeAllowanceComponent,
    SuretyReleaseTransactionComponent,
    StandardProcessComponent,
    PensionProcessComponent,
    TimeDepositProcessComponent,
    DividendProcessComponent,
    ShareProtectionProcessComponent,
    RebateProcessComponent,
    ServiceChargeProcessComponent,
    SuretyRefundTransactionComponent,
    YearEndReverseTransactionComponent,
    YearEndPostTranscationComponent,
    YeProfitLossAppropriationTransactionComponent,
    LedgerBalanceReportComponent,
    GlAccountStatementReportsComponent,
    AccountLedgerBalanceSmsServiceComponent,
    RebateVerifyListComponent,
    MemberGreetingSmsServiceComponent,
    CsDailyTransactionVoucherReportComponent,
    VoterIdListComponent,
    BackUpProcessComponent,
    AccountBalanceTransferComponent,
    BudgetReportsComponent,
    IdentityCardListComponent,
    AccountTransactionTransferComponent,
    LoanApplicationReportComponent,
    MemberLoanPerformanceReportComponent,
    CashCollectionReportComponent,
    ReceivedAndPaymentReportsComponent,
    MemberImageInformationReportComponent,
    MemberAdmissionFormComponent,
    AccountOpenAndCloseRegisterComponent,
    MemberTransferComponent,
    BlankCollectionSheetComponent,
    LoanRecoveryReportComponent,
    LoanApprovedAndRejectedReportComponent,
    DepositDefaulterReportComponent,
    InoperativeOperativeAccountReportComponent,
    PersonnalLedgerComponent,
    MutualAidServiceReportComponent,
    LedgerBalanceReportByCtrlComponent,
    ProfitAndLossAppropriationTransactionComponent,
    LoanDefaulterReportComponent,
    AutoManualTransactionComponent,
    YeGlTransactionsListComponent,
    YeGlTrialBalanceReportComponent,
    MonthlyMonitoringReportComponent,
    AuditReportsComponent,
    BoothCsVoucherWiseTransactionReportComponent,
    BoothJournalReportComponent,
    BoothReceivedAndPaymentReportComponent,
    StrengthAnalysisReportComponent,
    SavenDaysWithdrawalNoticeComponent,
    ExcelCollectionSheetComponent,
    CollectorTransferComponent,
    LoanDisbRecoveryAnalysisReportComponent,
    LoanApplicationReport2Component,
    DetailListReportComponent,
    StandardAccountIntReportComponent,
    OpenMemberInformationsComponent,
    AutoAccountOpenMemberInformationComponent,
    ChequeBookCounterModalComponent,
    DayEndProcessTestComponent,
    GlToGlTransferComponent,
  ],
  imports: [
    CommonModule,
    AccountingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [DatePipe],
  bootstrap: [NewMemberApplicationComponent],
})
export class AccountingModule {}
