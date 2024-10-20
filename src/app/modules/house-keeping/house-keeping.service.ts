import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { createUrl } from '../../utility/common';
import { UserMenu, UserInfo } from '../Models/commonModels';
import { environment } from 'src/environments/environment';
import { ILockedUser } from 'src/app/Models/locked-user.model';
import { JsonResponseModel } from 'src/app/Models/user-manager.model';
@Injectable({
  providedIn: 'root',
})
export class HouseKeepingService {
  private headers: any = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  constructor(private httpClient: HttpClient) {}

  public getReportToken(data) {
    return this.httpClient.get(
      createUrl(`ReportToken/GetReportDetails?name=${data}`)
    );
  }

  // Get data from API
  // public getAccTypes(data) {
  //   return this.httpClient.get(
  //     createUrl(`InputHelp/${data}/GetAccountTypes`),
  //     this.createHeader()
  //   );
  // }

  public getAccTypes(url) {
    return this.httpClient.get(createUrl(`InputHelp/${url}`));
  }

  public getAccType(data) {
    return this.httpClient.get(createUrl(`HouseKeeping/${data}/GetAllAcc`));
  }

  public migrateUsers() {
    return this.httpClient.get(createUrl(`Account/MigrateUsers`));
  }

  public getDataList(data) {
    return this.httpClient.get(createUrl(`HouseKeeping/${data}/getall`));
  }

  public GetLockedUsers() {
    return this.httpClient.get<ILockedUser[]>(
      environment.baseUrl + 'Accounting/DayEndProcess/GetLockedUsers'
    );
  }

  public UnlockUser(id: number) {
    return this.httpClient.get<any>(
      environment.baseUrl + 'Account/UnlockUser?id=' + id
    );
  }

  public ResetPassword(id: number) {
    return this.httpClient.get<JsonResponseModel>(
      environment.baseUrl + 'Account/ResetPassword?id=' + id
    );
  }

  public insert(data, body) {
    return this.httpClient.post(createUrl(`HouseKeeping/${data}/Insert`), body);
  }

  public updateSection(data, body) {
    return this.httpClient.post(createUrl(`HouseKeeping/${data}/Update`), body);
  }

  public UpdateLSCode(data, body) {
    return this.httpClient.post(createUrl(`HouseKeeping/${data}/Update`), body);
  }

  public updateAccStatus(data, body) {
    return this.httpClient.post(createUrl(`HouseKeeping/${data}/Update`), body);
  }
  public update(data, body) {
    return this.httpClient.post(createUrl(`HouseKeeping/${data}/Update`), body);
  }

  public getAccountTypeList(data) {
    return this.httpClient.get(
      createUrl(`HouseKeeping/${data}/GetAccountTypeList`)
    );
  }

  public getTransactionPayTypeList(data) {
    return this.httpClient.get(
      createUrl(`HouseKeeping/PayTypeMaintenance/GetAll?id=${data}`)
    );
  }

  public getAllAccount() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/PayTypeMaintenance/GetAllAcc`)
    );
  }

  public getMenuList(moduleId, from?) {
    return this.httpClient.get<UserMenu[]>(
      createUrl(`SystemControl/Menu/GetUserMenuList?module=${moduleId}`)
    );
  }

  public getUserInfo(data) {
    return this.httpClient.get(createUrl(`Account/${data}`));
  }

  public GetUserIdLevels(data) {
    return this.httpClient.get(
      createUrl(`SystemControl/${data}/GetUserIdLevels`)
    );
  }
  public GetGLCashCodeList(data) {
    return this.httpClient.get(
      createUrl(`SystemControl/${data}/GetGLCashCodeList`)
    );
  }
  public GetUserList(data) {
    return this.httpClient.get(createUrl(`SystemControl/${data}/GetUserList`));
  }

  public InsertUserInfo(data, body) {
    return this.httpClient.post(
      createUrl(`SystemControl/${data}/Insert`),
      body
    );
  }

  //SMS Configuration Page
  public GetExisting() {
    return this.httpClient.get(createUrl(`HouseKeeping/SMSConfig/PageLoad`));
  }

  public InsertSMSInfo(data) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/SMSConfig/Insert`),
      data
    );
  }

  public UpdateSMSInfo(data) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/SMSConfig/Update`),
      data
    );
  }

  public GetModulesByUserId(data) {
    return this.httpClient.get(
      createUrl(`SystemControl/Module/GetModulesByUserId?userId=${data}`)
    );
  }

  public GetSelectedMenuesByModuleId(uid, mid) {
    return this.httpClient.get(
      createUrl(
        `SystemControl/Menu/GetAssignedMenuListByModuleId?sUserId=${uid}&&moduleId=${mid}`
      )
    );
  }

  public AssignMenuToUser(data, url, mid) {
    return this.httpClient.post(
      createUrl(
        `SystemControl/Menu/AssignMenuToUser?userId=${url}&&moduleId=${mid}`
      ),
      data
    );
  }

  public GetAllModule() {
    return this.httpClient.get(createUrl(`SystemControl/Module/GetAllModule`));
  }
  public AssignModuleToUser(data, url) {
    return this.httpClient.post(
      createUrl(`SystemControl/Module/AssignedModules?userId=${url}`),
      data
    );
  }

  // Get User Reset Password
  public GetUserPassword(user) {
    return this.httpClient.get(
      createUrl(
        `SystemControl/UserMaintenance/UserResetPassword?userId=${user}`
      )
    );
  }

  public GetTransactionLimit(user) {
    return this.httpClient.get(
      createUrl(
        `SystemControl/TransactionLimit/GetTransactionLimit?userId=${user}`
      )
    );
  }

  public UserInfoUpdate(data, body) {
    return this.httpClient.post(
      createUrl(`SystemControl/${data}/Update`),
      body
    );
  }

  public GetUserInformationById(user) {
    return this.httpClient.get(
      createUrl(
        `SystemControl/UserMaintenance/GetUserInformation?userId=${user}`
      )
    );
  }

  //Module wise menu by user
  public AllMenuListByModule(module) {
    return this.httpClient.get(
      createUrl(`SystemControl/Menu/GetModuleMenuList?moduleId=${module}`)
    );
  }

  // Get All Record Control Maintenance Data
  public GetAllInformation() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/SystemControl/RecordControl/GetAll`)
    );
  }

  // Insert Data In Record Control Maintenance
  public InsertRecordControl(body) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/SystemControl/RecordControl/Insert`),
      body
    );
  }

  // Update Data In Record Control Maintenance
  public UpdateRecordControl(body) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/SystemControl/RecordControl/Update`),
      body
    );
  }

  // Get dropdown value
  public getdropdownvalue() {
    return this.httpClient.get(
      createUrl(
        `HouseKeeping/SystemControl/AccTypeControl/GetAccTypeClassDescDropdown`
      )
    );
  }

  // Get All information of Account type ctrl
  public getAllinfo() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/SystemControl/AccTypeControl/GetAll`)
    );
  }

  // Get All information of Account type ctrl
  public getAllAssignedSelectedAndReadonlyinfo(id) {
    return this.httpClient.get(
      createUrl(
        `HouseKeeping/SystemControl/AccTypeControl/GetAssignedSelectedAndReadonlyList?accountId=${id}`
      )
    );
  }
  public UpdateSelectedAndReadOnlyList(data) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/SystemControl/AccTypeControl/UpdateInfo`),
      data
    );
  }
  //Report Setup Maintenance

  //Others Cash Collection Report
  public PayTypeList() {
    return this.httpClient.get(createUrl(`HouseKeeping/CashCollection/GetAll`));
  }

  public ExistingList(data) {
    return this.httpClient.get(
      createUrl(`HouseKeeping/CashCollection/GetExisting?ColumnValue=${data}`)
    );
  }
  //Value Submit
  public Submit(body) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/CashCollection/Submit`),
      body
    );
  }

  // Personnal Legder Report Control
  public ExistingListPR(data) {
    return this.httpClient.get(
      createUrl(`HouseKeeping/PersonnalLRCtrl/GetExisting?ColumnValue=${data}`)
    );
  }
  public SubmitPR(body) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/PersonnalLRCtrl/Submit`),
      body
    );
  }
  // Perameter Control
  public getAllAssignedSelectedinfo(id) {
    return this.httpClient.get(
      createUrl(
        `HouseKeeping/SystemControl/ParameterControl/GetAssignedSelectedAndReadonlyList?accountId=${id}`
      )
    );
  }
  public UpdateSelectedList(data, data2: any) {
    return this.httpClient.post(
      createUrl(
        `HouseKeeping/SystemControl/ParameterControl/UpdateInfo?productType=` +
          data2
      ),
      data
    );
  }
  // Dropdown value for perameter control
  public getparameterdropdownvalue() {
    return this.httpClient.get(
      createUrl(
        `HouseKeeping/SystemControl/ParameterControl/GetAccTypeClassDescDropdown`
      )
    );
  }
  // Get All information of Parameter type ctrl
  public ParameterCtrlgetAllinfo() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/SystemControl/ParameterControl/GetAll`)
    );
  }

  public GetPerameterControlCustomerServiceInputHelpData() {
    return this.httpClient.get(
      createUrl(
        `HouseKeeping/ParameterMaintenanceCustomerService/GetInputHelpData`
      )
    );
  }
  public GetPerameterControlCustomerServiceAccTypeData(data: any) {
    return this.httpClient.get(
      createUrl(
        `HouseKeeping/ParameterMaintenanceCustomerService/GetAccTypeData?accTypeCode=` +
          data
      )
    );
  }
  public GetPerameterControlCustomerServiceEnumData() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/ParameterMaintenanceCustomerService/GetEnumData`)
    );
  }
  public PerameterControlCustomerServiceSubmit(data: any) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/ParameterMaintenanceCustomerService/SubmitData`),
      data
    );
  }
  public PerameterControlCustomerServiceUpdate(data: any) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/ParameterMaintenanceCustomerService/UpdateData`),
      data
    );
  }
  public SlabMaintainHelpDataGet(data: any) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/SlabMaintain/GetInputHelpData`),
      data
    );
  }
  public SubmitSlabData(data: any) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/SlabMaintain/SubmitSlabData`),
      data
    );
  }
  public UpdateSlabData(data: any) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/SlabMaintain/UpdateSlabData`),
      data
    );
  }
  public DeleteSlabData(data: any) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/SlabMaintain/DeleteSlabData`),
      data
    );
  }
  public SubmitPrematureSlabData(data: any) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/SlabMaintain/SubmitPrematureSlabData`),
      data
    );
  }
  public UpdatePrematureSlabData(data: any) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/SlabMaintain/UpdatePrematureSlabData`),
      data
    );
  }
  public SlabMaintainEnumData() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/SlabMaintain/SlabMaintainEnumData`)
    );
  }
  public LoanSuretyHelpData() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/ParameterMaintenanceLoanSurety/GetInputHelpData`)
    );
  }
  public LoanSuretyUpdateData(data: any) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/ParameterMaintenanceLoanSurety/UpdateData`),
      data
    );
  }
  public MutualAidServiceHelpData() {
    return this.httpClient.get(
      createUrl(
        `HouseKeeping/ParameterMaintenanceMutualAidService/GetInputHelpData`
      )
    );
  }
  public MutualAidServiceAccTypeTextChange(data: any) {
    return this.httpClient.get(
      createUrl(
        `HouseKeeping/ParameterMaintenanceMutualAidService/AccTypeTextChange?accType=` +
          data
      )
    );
  }

  public MutualAidServiceAccTypeChange(data: any) {
    return this.httpClient.get(
      createUrl(
        `HouseKeeping/ParameterMaintenanceMutualAidService/AccTypeChange?accType=` +
          data
      )
    );
  }

  public MutualAidServiceSubmitData(data: any) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/ParameterMaintenanceMutualAidService/SubmitData`),
      data
    );
  }
  public SMSControlHelpData() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/ParameterMaintenanceSMSControl/LoadData`)
    );
  }
  public SMSControlSubmitData(data: any) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/ParameterMaintenanceSMSControl/SubmitData`),
      data
    );
  }
  public EmailControlHelpData() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/ParameterMaintenanceEmailControl/LoadData`)
    );
  }
  public SubmitEmailToAddressData(data: any) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/ParameterMaintenanceEmailControl/SubmitData`),
      data
    );
  }
  public UpdateEmailFromAddressData(data: any) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/ParameterMaintenanceEmailControl/UpdateData`),
      data
    );
  }
  public DeleteEmailData(data: any) {
    return this.httpClient.get(
      createUrl(
        `HouseKeeping/ParameterMaintenanceEmailControl/DeleteData?id=` + data
      )
    );
  }
  public InterestCalculationLoadData() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/ParameterMaintenanceInterestCalculation/LoadData`)
    );
  }
  public InterestCalculationAccTypeData(data: number) {
    return this.httpClient.get(
      createUrl(
        `HouseKeeping/ParameterMaintenanceInterestCalculation/AccTypeChange?accType=` +
          data
      )
    );
  }
  public InsertInterestCalculationData(data: any) {
    return this.httpClient.post(
      createUrl(
        `HouseKeeping/ParameterMaintenanceInterestCalculation/SubmitData`
      ),
      data
    );
  }
  public UpdateInterestCalculationData(data: any) {
    return this.httpClient.post(
      createUrl(
        `HouseKeeping/ParameterMaintenanceInterestCalculation/UpdateData`
      ),
      data
    );
  }
  public DividendCalculationLoadData() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/ParameterMaintenanceDividendCalculation/LoadData`)
    );
  }
  public ShareProtGLCodeChange(data: any) {
    return this.httpClient.get(
      createUrl(
        `HouseKeeping/ParameterMaintenanceDividendCalculation/ChangeShareProtection?protectionCode=` +
          data
      )
    );
  }
  public RebateCalculationLoadData() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/ParameterMaintenanceRebateCalculation/LoadData`)
    );
  }
  public RebateCalculationAccTypeData(data: number) {
    return this.httpClient.get(
      createUrl(
        `HouseKeeping/ParameterMaintenanceRebateCalculation/GetRebateParameterData?accType=` +
          data
      )
    );
  }
  public RebateCalculationSubmitData(data: any) {
    return this.httpClient.post(
      createUrl(
        `HouseKeeping/ParameterMaintenanceRebateCalculation/SubmitData`
      ),
      data
    );
  }
  public RebateCalculationUpdateData(data: any) {
    return this.httpClient.post(
      createUrl(
        `HouseKeeping/ParameterMaintenanceRebateCalculation/UpdateData`
      ),
      data
    );
  }
  public RebateGLCodeChange(data: any) {
    return this.httpClient.get(
      createUrl(
        `HouseKeeping/ParameterMaintenanceRebateCalculation/GLCodeChange?glCode=` +
          data
      )
    );
  }
  public CreateLogoSubmitData(data) {
    return this.httpClient.post(
      createUrl(`ImageProcessing/CreateLogoSubmitData`),
      data
    );
  }

  public getDesignationCode() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/DesignationCode/GetAll`)
    );
  }

  public InserDesignationData(data) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/DesignationCode/Insert`),
      data
    );
  }

  public getBankCode() {
    return this.httpClient.get(createUrl(`HouseKeeping/BankCode/GetAll`));
  }

  public InserBankData(data) {
    return this.httpClient.post(
      createUrl(`HouseKeeping/BankCode/Insert`),
      data
    );
  }


  public GetCashReport() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/CashReportControl/GetAll`)
    );
  }
}
