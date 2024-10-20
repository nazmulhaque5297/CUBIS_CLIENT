import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseKeepingComponent } from './Home/house-keeping.component';
import { ProfessionalCodeComponent } from './pages/professional-code/professional-code.component';
import { NationalityCodeComponent } from './pages/nationality-code/nationality-code.component';

//components

import { AccountStatusComponent } from './pages/account-status/account-status.component';
import { TransactionTypeComponent } from './pages/transaction-type/transaction-type.component';
import { NatureCodeComponent } from './pages/nature-code/nature-code.component';
import { LoanSecurityCodeComponent } from './pages/loan-security-code/loan-security-code.component';
import { LoanPurposeComponent } from './pages/loan-purpose/loan-purpose.component';
import { TransactionPayTypeComponent } from './pages/transaction-pay-type/transaction-pay-type.component';
import { ParameterSlabReportComponent } from './pages/parameter-slab-report/parameter-slab-report.component';
import { SectionCodeComponent } from './pages/section-code/section-code.component';
import { DepartmentCodeComponent } from './pages/department-code/department-code.component';
import { LoanRejectedNoteComponent } from './pages/loan-rejected-note/loan-rejected-note.component';
import { LoanVerifyNoteComponent } from './pages/loan-verify-note/loan-verify-note.component';
import { LoanApprovedNoteComponent } from './pages/loan-approved-note/loan-approved-note.component';
import { MemberRejectNoteComponent } from './pages/member-reject-note/member-reject-note.component';
import { MemberVerifyNoteComponent } from './pages/member-verify-note/member-verify-note.component';
import { MemberApprovedNoteComponent } from './pages/member-approved-note/member-approved-note.component';
import { AddNewUserComponent } from './pages/add-new-user/add-new-user.component';
import { UserModuleControlComponent } from './pages/user-module-control/user-module-control.component';
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
import { RecordsControlMaintenanceComponent } from './pages/records-control-maintenance/records-control-maintenance.component';
import { FieldsSetupMaintenanceComponent } from './pages/fields-setup-maintenance/fields-setup-maintenance.component';
import { AccountOpenControlMaintenanceComponent } from './pages/account-open-control-maintenance/account-open-control-maintenance.component';
import { ParameterControlMaintenanceComponent } from './pages/parameter-control-maintenance/parameter-control-maintenance.component';
import { TransactionCodeMaintenanceComponent } from './pages/transaction-code-maintenance/transaction-code-maintenance.component';
import { ParameterMaintenanceCustomerServiceComponent } from './pages/parameter-maintenance-customer-service/parameter-maintenance-customer-service.component';
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
import { CashReportControlByACTypeComponent } from './pages/cash-report-control-by-a-c-type/cash-report-control-by-a-c-type.component';

const routes: Routes = [
  { path: '', component: HouseKeepingComponent },

  { path: 'user-migration', component: MigrateOldUserComponent },
  { path: 'restore-database', component: RestoreDatabaseComponent },
  { path: 'profession-code-maintenance', component: ProfessionalCodeComponent },
  { path: 'nationality-code-maintenance', component: NationalityCodeComponent },
  { path: 'account-status-maintenance', component: AccountStatusComponent },
  { path: 'transaction-type-maintenance', component: TransactionTypeComponent },
  {
    path: 'transaction-pay-type-maintenance',
    component: TransactionPayTypeComponent,
  },
  { path: 'nature-code-maintenance', component: NatureCodeComponent },

  { path: 'parameter-slab-reports', component: ParameterSlabReportComponent },
  {
    path: 'loan-security-code-maintenance',
    component: LoanSecurityCodeComponent,
  },
  { path: 'loan-purpose-code-maintenance', component: LoanPurposeComponent },
  {
    path: 'loan-rejected-note-maintenance',
    component: LoanRejectedNoteComponent,
  },
  { path: 'loan-verify-note-maintenance', component: LoanVerifyNoteComponent },
  {
    path: 'loan-approved-note-maintenance',
    component: LoanApprovedNoteComponent,
  },
  {
    path: 'member-rejected-note-maintenance',
    component: MemberRejectNoteComponent,
  },
  {
    path: 'member-verify-note-maintenance',
    component: MemberVerifyNoteComponent,
  },
  {
    path: 'member-approved-note-maintenance',
    component: MemberApprovedNoteComponent,
  },
  { path: 'section-code-maintenance', component: SectionCodeComponent },
  { path: 'department-code-maintenance', component: DepartmentCodeComponent },
  {
    path: 'service-type-code-maintenance',
    component: ServiceTypeCodeMaintenanceComponent,
  },
  { path: 'add-new-user', component: AddNewUserComponent },
  { path: 'edit-user-id', component: EditUserIdComponent },
  { path: 'user-module-control', component: UserModuleControlComponent },
  {
    path: 'generate-user-menu-accessibility',
    component: GenerateUserMenuAccessibilityComponent,
  },
  { path: 'initialize-user-id', component: InitializeUserIdComponent },
  { path: 'reset-user-passward', component: ResetUserPasswardComponent },
  { path: 'reset-user-passward', component: ResetUserPasswardComponent },
  {
    path: 'user-transaction-limit-accessibility',
    component: UserTransactionLimitAccessibilityComponent,
  },
  {
    path: 'account-type-maintenance',
    component: AccountTypeMaintenanceComponent,
  },
  {
    path: 'parameter-maintenance---general',
    component: ParameterMaintenanceGLComponent,
  },
  {
    path: 'parameter-maintenance---system',
    component: ParameterMaintenanceSysComponent,
  },
  {
    path: 'parameter-maintenance---general-ledger',
    component: ParameterMaintenanceGledgerComponent,
  },
  {
    path: 'parameter-maintenance---email-control',
    component: ParameterMaintenanceEmailComponent,
  },
  {
    path: 'account-open-control-maintenance',
    component: AccountOpenControlMaintenanceComponent,
  },
  {
    path: 'parameter-control-maintenance',
    component: ParameterControlMaintenanceComponent,
  },
  {
    path: 'records-control-maintenance',
    component: RecordsControlMaintenanceComponent,
  },
  {
    path: 'fields-setup-maintenance',
    component: FieldsSetupMaintenanceComponent,
  },
  {
    path: 'transaction-code-maintenance',
    component: TransactionCodeMaintenanceComponent,
  },
  {
    path: 'parameter-maintenance---customer-service',
    component: ParameterMaintenanceCustomerServiceComponent,
  },
  {
    path: 'parameter-maintenance---loan-surety',
    component: ParameterMaintenanceLoanSuretyComponent,
  },
  {
    path: 'parameter-maintenance---mutual-aid-service',
    component: ParameterMaintenanceMutualAidServiceComponent,
  },
  {
    path: 'parameter-maintenance---sms-control',
    component: ParameterMaintenanceSmsControlComponent,
  },
  {
    path: 'parameter-maintenance---interest-cal.',
    component: ParameterMaintenanceInterestCalculationComponent,
  },
  {
    path: 'parameter-maintenance---dividend-cal.',
    component: ParameterMaintenanceDividendCalculationComponent,
  },
  {
    path: 'parameter-maintenance---rebate-cal.',
    component: ParameterMaintenanceRebateCalculationComponent,
  },
  { path: 'holidaytype-maintenance', component: HolidayTypeComponent },
  {
    path: 'others-a-c-cash-collection-report-control',
    component: OthersACCashCollectionReportControlComponent,
  },
  {
    path: 'sms-massage-maintenance-control',
    component: SmsMassageMaintenanceControlComponent,
  },
  {
    path: 'voucher-signature-maintenance-control',
    component: VoucherSignatureMaintenanceControlComponent,
  },
  {
    path: 'personnal-ledger-report-control',
    component: PersonnalLedgerReportControlComponent,
  },
  { path: 'weekly-holiday-maintenance', component: WeeklyHolidayComponent },
  { path: 'national-holiday-maintenance', component: NationalHolidayComponent },
  { path: 'auto-voucher-print-control', component: AutoVoucherPrintComponent },
  {
    path: 'master-transaction-control-setup',
    component: MasterTransactionControlComponent,
  },
  { path: 'create-logo-image', component: CreateLogoImageComponent },
  {
    path: 'reset-unit-day-end-confirmation',
    component: ResetUnitDayEndConfirmationComponent,
  },
  { path: 'sms-configuration', component: SmsConfigurationComponent },
  { path: 'designation-code-maintenance', component: DesignationCodeMaintenanceComponent },
  { path: 'bank-code-maintenance', component: BankCodeMaintenanceComponent },
  { path: 'cash-report-control-by-a-c-type', component: CashReportControlByACTypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HouseKeepingRoutingModule {}

export const routingComponents = [
  HouseKeepingComponent,
  ProfessionalCodeComponent,
  NationalityCodeComponent,
  AccountStatusComponent,
  TransactionTypeComponent,
  NatureCodeComponent,
  LoanSecurityCodeComponent,
  LoanPurposeComponent,
  SectionCodeComponent,
  DepartmentCodeComponent,
  LoanRejectedNoteComponent,
  LoanVerifyNoteComponent,
  LoanApprovedNoteComponent,
  MemberRejectNoteComponent,
  MemberVerifyNoteComponent,
  MemberApprovedNoteComponent,
  AddNewUserComponent,
  EditUserIdComponent,
  ParameterSlabReportComponent,
  UserModuleControlComponent,
  GenerateUserMenuAccessibilityComponent,
  InitializeUserIdComponent,
  ResetUserPasswardComponent,
  UserTransactionLimitAccessibilityComponent,
  ParameterMaintenanceGLComponent,
  ParameterMaintenanceSysComponent,
  ParameterMaintenanceGledgerComponent,
  ParameterMaintenanceEmailComponent,
  FieldsSetupMaintenanceComponent,
  TransactionCodeMaintenanceComponent,
];
