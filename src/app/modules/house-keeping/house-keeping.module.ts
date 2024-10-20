import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HouseKeepingRoutingModule,
  routingComponents,
} from './house-keeping-routing.module';
import { ProfessionalCodeComponent } from './pages/professional-code/professional-code.component';
import { NationalityCodeComponent } from './pages/nationality-code/nationality-code.component';
import { AccountStatusComponent } from './pages/account-status/account-status.component';
import { TransactionTypeComponent } from './pages/transaction-type/transaction-type.component';
import { NatureCodeComponent } from './pages/nature-code/nature-code.component';
import { LoanSecurityCodeComponent } from './pages/loan-security-code/loan-security-code.component';
import { LoanPurposeComponent } from './pages/loan-purpose/loan-purpose.component';
import { TransactionPayTypeComponent } from './pages/transaction-pay-type/transaction-pay-type.component';
import { SectionCodeComponent } from './pages/section-code/section-code.component';
import { DepartmentCodeComponent } from './pages/department-code/department-code.component';
import { LoanRejectedNoteComponent } from './pages/loan-rejected-note/loan-rejected-note.component';
import { LoanVerifyNoteComponent } from './pages/loan-verify-note/loan-verify-note.component';
import { LoanApprovedNoteComponent } from './pages/loan-approved-note/loan-approved-note.component';
import { MemberRejectNoteComponent } from './pages/member-reject-note/member-reject-note.component';
import { MemberVerifyNoteComponent } from './pages/member-verify-note/member-verify-note.component';
import { MemberApprovedNoteComponent } from './pages/member-approved-note/member-approved-note.component';
import { AddNewUserComponent } from './pages/add-new-user/add-new-user.component';
import { ParameterSlabReportComponent } from './pages/parameter-slab-report/parameter-slab-report.component';
import { GenerateUserMenuAccessibilityComponent } from './pages/generate-user-menu-accessibility/generate-user-menu-accessibility.component';
import { InitializeUserIdComponent } from './pages/initialize-user-id/initialize-user-id.component';
import { ResetUserPasswardComponent } from './pages/reset-user-passward/reset-user-passward.component';
import { UserTransactionLimitAccessibilityComponent } from './pages/user-transaction-limit-accessibility/user-transaction-limit-accessibility.component';
import { AccountTypeMaintenanceComponent } from './pages/account-type-maintenance/account-type-maintenance.component';
import { EditUserIdComponent } from './pages/edit-user-id/edit-user-id.component';
import { ParameterMaintenanceGLComponent } from './pages/parameter-maintenance-gl/parameter-maintenance-gl.component';
import { ServiceTypeCodeMaintenanceComponent } from './pages/service-type-code-maintenance/service-type-code-maintenance.component';
import { ParameterMaintenanceSysComponent } from './pages/parameter-maintenance-sys/parameter-maintenance-sys.component';
import { ParameterMaintenanceGledgerComponent } from './pages/parameter-maintenance-gledger/parameter-maintenance-gledger.component';
import { ParameterMaintenanceEmailComponent } from './pages/parameter-maintenance-email/parameter-maintenance-email.component';
import { FieldsSetupMaintenanceComponent } from './pages/fields-setup-maintenance/fields-setup-maintenance.component';
import { RecordsControlMaintenanceComponent } from './pages/records-control-maintenance/records-control-maintenance.component';
import { AccountOpenControlMaintenanceComponent } from './pages/account-open-control-maintenance/account-open-control-maintenance.component';
import { TransactionCodeMaintenanceComponent } from './pages/transaction-code-maintenance/transaction-code-maintenance.component';
import { ParameterControlMaintenanceComponent } from './pages/parameter-control-maintenance/parameter-control-maintenance.component';
import { ParameterMaintenanceCustomerServiceComponent } from './pages/parameter-maintenance-customer-service/parameter-maintenance-customer-service.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SlabMaintainLoanComponent } from './pages/slab-maintain/slab-maintain-loan/slab-maintain-loan.component';
import { SlabMaintainDepositAndSchemeComponent } from './pages/slab-maintain/slab-maintain-deposit-and-scheme/slab-maintain-deposit-and-scheme.component';
import { ParameterMaintenanceLoanSuretyComponent } from './pages/parameter-maintenance-loan-surety/parameter-maintenance-loan-surety.component';
import { ParameterMaintenanceMutualAidServiceComponent } from './pages/parameter-maintenance-mutual-aid-service/parameter-maintenance-mutual-aid-service.component';
import { ParameterMaintenanceSmsControlComponent } from './pages/parameter-maintenance-sms-control/parameter-maintenance-sms-control.component';
import { ParameterMaintenanceInterestCalculationComponent } from './pages/parameter-maintenance-interest-calculation/parameter-maintenance-interest-calculation.component';
import { ParameterMaintenanceDividendCalculationComponent } from './pages/parameter-maintenance-dividend-calculation/parameter-maintenance-dividend-calculation.component';
import { ParameterMaintenanceRebateCalculationComponent } from './pages/parameter-maintenance-rebate-calculation/parameter-maintenance-rebate-calculation.component';
import { HolidayTypeComponent } from './pages/holiday-setup/holiday-type/holiday-type.component';
import { OthersACCashCollectionReportControlComponent } from './pages/others-a-c-cash-collection-report-control/others-a-c-cash-collection-report-control.component';
import { SmsMassageMaintenanceControlComponent } from './pages/sms-massage-maintenance-control/sms-massage-maintenance-control.component';
import { VoucherSignatureMaintenanceControlComponent } from './pages/voucher-signature-maintenance-control/voucher-signature-maintenance-control.component';
import { NationalHolidayComponent } from './pages/holiday-setup/national-holiday/national-holiday.component';
import { WeeklyHolidayComponent } from './pages/holiday-setup/weekly-holiday/weekly-holiday.component';
import { AutoVoucherPrintComponent } from './pages/system-setup/auto-voucher-print/auto-voucher-print.component';
import { MasterTransactionControlComponent } from './pages/system-setup/master-transaction-control/master-transaction-control.component';
import { CreateLogoImageComponent } from './pages/create-logo-image/create-logo-image.component';
import { RestoreDatabaseComponent } from './pages/restore-database/restore-database.component';
import { MigrateOldUserComponent } from './pages/migrate-old-user/migrate-old-user.component';
import { PersonnalLedgerReportControlComponent } from './pages/personnal-ledger-report-control/personnal-ledger-report-control.component';
import { ResetUnitDayEndConfirmationComponent } from './pages/reset-unit-day-end-confirmation/reset-unit-day-end-confirmation.component';
import { SmsConfigurationComponent } from './pages/sms-configuration/sms-configuration.component';
import { DesignationCodeMaintenanceComponent } from './pages/designation-code-maintenance/designation-code-maintenance.component';
import { BankCodeMaintenanceComponent } from './pages/bank-code-maintenance/bank-code-maintenance.component';
import { OnlyNumberWithoutDecimalDirective } from './services/only-number-without-decimal.directive';
import { OnlyNumberDirective } from './services/only-number.directive';
import { CashReportControlByACTypeComponent } from './pages/cash-report-control-by-a-c-type/cash-report-control-by-a-c-type.component';

@NgModule({
  declarations: [
    routingComponents,
    ProfessionalCodeComponent,
    NationalityCodeComponent,
    AccountStatusComponent,
    TransactionTypeComponent,
    NatureCodeComponent,
    LoanSecurityCodeComponent,
    LoanPurposeComponent,
    TransactionPayTypeComponent,
    SectionCodeComponent,
    DepartmentCodeComponent,
    LoanRejectedNoteComponent,
    LoanVerifyNoteComponent,
    LoanApprovedNoteComponent,
    MemberRejectNoteComponent,
    MemberVerifyNoteComponent,
    MemberApprovedNoteComponent,
    AddNewUserComponent,
    ParameterSlabReportComponent,
    GenerateUserMenuAccessibilityComponent,
    InitializeUserIdComponent,
    ResetUserPasswardComponent,
    UserTransactionLimitAccessibilityComponent,
    AccountTypeMaintenanceComponent,
    EditUserIdComponent,
    ParameterMaintenanceGLComponent,
    ServiceTypeCodeMaintenanceComponent,
    ParameterMaintenanceSysComponent,
    ParameterMaintenanceGledgerComponent,
    ParameterMaintenanceEmailComponent,
    RecordsControlMaintenanceComponent,
    FieldsSetupMaintenanceComponent,
    AccountOpenControlMaintenanceComponent,
    ParameterControlMaintenanceComponent,
    TransactionCodeMaintenanceComponent,
    ParameterMaintenanceCustomerServiceComponent,
    SlabMaintainLoanComponent,
    SlabMaintainDepositAndSchemeComponent,
    ParameterMaintenanceLoanSuretyComponent,
    ParameterMaintenanceMutualAidServiceComponent,
    ParameterMaintenanceSmsControlComponent,
    ParameterMaintenanceInterestCalculationComponent,
    ParameterMaintenanceDividendCalculationComponent,
    ParameterMaintenanceRebateCalculationComponent,
    HolidayTypeComponent,
    OthersACCashCollectionReportControlComponent,
    SmsMassageMaintenanceControlComponent,
    VoucherSignatureMaintenanceControlComponent,
    NationalHolidayComponent,
    WeeklyHolidayComponent,
    AutoVoucherPrintComponent,
    MasterTransactionControlComponent,
    CreateLogoImageComponent,
    RestoreDatabaseComponent,
    MigrateOldUserComponent,
    PersonnalLedgerReportControlComponent,
    ResetUnitDayEndConfirmationComponent,
    SmsConfigurationComponent,
    DesignationCodeMaintenanceComponent,
    BankCodeMaintenanceComponent,
    OnlyNumberDirective,
    OnlyNumberWithoutDecimalDirective,
    CashReportControlByACTypeComponent,
  ],
  imports: [
    CommonModule,
    HouseKeepingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class HouseKeepingModule {}
