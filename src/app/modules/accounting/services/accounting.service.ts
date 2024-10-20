import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AccountingService {
  showHideDiv: boolean = true;
  showDiv: boolean = false;
  constructor(private httpClient: HttpClient) {}

  public getPostOfficeInfo() {
    return this.httpClient.get(createUrl(`Accounting/PostOfficeCode/GetAll`));
  }
  public insert(body) {
    return this.httpClient.post(
      createUrl(`Accounting/PostOfficeCode/Insert`),
      body
    );
  }
  public getDivisionCodeInfo() {
    return this.httpClient.get(createUrl(`Accounting/DivisionCode/GetAll`));
  }

  public insertDivi(body) {
    return this.httpClient.post(
      createUrl(`Accounting/DivisionCode/Insert`),
      body
    );
  }

  public getVillageCodeInfo() {
    return this.httpClient.get(
      createUrl(`Accounting/VillageCode/GetVillageDetails`)
    );
  }

  public getDistCodeInfo() {
    return this.httpClient.get(
      createUrl(`Accounting/VillageCode/GetDistrictDetails`)
    );
  }

  public getUpzilaCodeInfo() {
    return this.httpClient.get(
      createUrl(`Accounting/VillageCode/GetUpzilaDetails`)
    );
  }

  public getThanaCodeInfo() {
    return this.httpClient.get(
      createUrl(`Accounting/VillageCode/GetThanaDetails`)
    );
  }

  public getDivisionInfo() {
    return this.httpClient.get(
      createUrl(`Accounting/VillageCode/GetDivisionDetails`)
    );
  }

  public sentVillageCode(body) {
    return this.httpClient.post(
      createUrl(
        `Accounting/VillageCode/GetInfoByVillageCode?villageCode=` + body
      ),
      body
    );
  }

  public getDistByDiv(body) {
    return this.httpClient.get(
      createUrl(`Accounting/VillageCode/GetInfoByDivCode?divCode=` + body),
      body
    );
  }
  public getUpzByDist(body) {
    return this.httpClient.get(
      createUrl(`Accounting/VillageCode/GetInfoByDistCode?distCode=` + body),
      body
    );
  }
  public getThByUpz(body) {
    return this.httpClient.get(
      createUrl(`Accounting/VillageCode/GetInfoByUpzCode?upzCode=` + body),
      body
    );
  }
  // Update and Insert Village Information
  public insertAndUpdate(body) {
    return this.httpClient.post(
      createUrl(`Accounting/VillageCode/Insert`),
      body
    );
  }

  public sentDiviCode(body) {
    return this.httpClient.post(
      createUrl(`Accounting/District/GetInfoByDiviCode?divicode=` + body),
      body
    );
  }

  public getUpizila(body) {
    return this.httpClient.post(
      createUrl(`Accounting/Upizila/GetInfoByCode`),
      body
    );
  }

  public getMemberInformation(body) {
    return this.httpClient.post(
      createUrl(`Accounting/EditMember/GetMemberInfo?Memno=` + body),
      body
    );
  }

  public editMemberInformation(body) {
    return this.httpClient.post(
      createUrl(`Accounting/EditMember/UpdateMemberInfo`),
      body
    );
  }

  public getRelationInfo(MemNo: any) {
    return this.httpClient.get(
      createUrl(`Accounting/EditMember/RelaMemNoChanged?MemNo=` + MemNo)
    );
  }

  public getAllInformation(MemNo: any) {
    return this.httpClient.get(
      createUrl(`Accounting/EditMember/ViewRelation?MemNo=` + MemNo)
    );
  }
  public getmemInfo(body) {
    console.log('Here');
    return this.httpClient.get(
      createUrl(`Accounting/EditMember/GetMemInfo?MemNo=` + body)
    );
  }

  public insertInfo(body) {
    return this.httpClient.post(createUrl(`Accounting/District/Insert`), body);
  }

  public insertUpzilizaInfo(body) {
    return this.httpClient.post(createUrl(`Accounting/Upizila/Insert`), body);
  }

  public getThana(body) {
    return this.httpClient.post(
      createUrl(`Accounting/Thana/GetInfoByCode`),
      body
    );
  }
  public insertThanaInfo(body) {
    return this.httpClient.post(createUrl(`Accounting/Thana/Insert`), body);
  }
  // GL Code Maintenance
  // Get GLCodeList
  public getGlCodeList() {
    return this.httpClient.get(
      createUrl(`Accounting/GLCodeMaintenance/GLCode`)
    );
  }
  public getGlCodeDetails(id) {
    return this.httpClient.get(
      createUrl(`Accounting/GLCodeMaintenance/OnGLCodeChange?GLCode=${id}`)
    );
  }
  public UpdateGLCode(data) {
    return this.httpClient.post(
      createUrl(`Accounting/GLCodeMaintenance/Update`),
      data
    );
  }
  //

  // ***************Special Function***************

  // Account Status
  public getAccountTypeListInfo() {
    return this.httpClient.get(
      createUrl(`Accounting/AccountStatusChange/AccountType`)
    );
  }

  public getAccountStatusListInfo() {
    return this.httpClient.get(
      createUrl(`Accounting/AccountStatusChange/AccountStatus`)
    );
  }

  public GetMemberInformation(id) {
    return this.httpClient.get(
      createUrl(`Accounting/AccountStatusChange/MemberName?MemNo=${id}`)
    );
  }

  public GetAccountNumber(MemType, MemId, AccType) {
    return this.httpClient.get(
      createUrl(
        `Accounting/AccountStatusChange/AccountNo?MemType=${MemType}&&MemId=${MemId}&&AccType=${AccType}`
      )
    );
  }

  public GetAccountNumbers(MemType, MemId, AccType) {
    return this.httpClient.get(
      createUrl(
        `Accounting/AccountStatusChange/AccountNos?MemType=${MemType}&&MemId=${MemId}&&AccType=${AccType}`
      )
    );
  }

  public GetAccountInfo(Id) {
    return this.httpClient.get(
      createUrl(`Accounting/AccountStatusChange/AccountInfo?AccountNo=${Id}`)
    );
  }

  public UpdateAccountStatus(data) {
    return this.httpClient.post(
      createUrl(`Accounting/AccountStatusChange/UpdateAccountStatus`),
      data
    );
  }

  // Member Status

  public getMemberTypeListInfo() {
    return this.httpClient.get(
      createUrl(`Accounting/MemberStatusChange/MemberStatus`)
    );
  }

  public UpdateMemberStatus(data) {
    return this.httpClient.post(
      createUrl(`Accounting/MemberStatusChange/UpdateMemberStatus`),
      data
    );
  }

  // Auto Renewal Process

  public getAccountTypeForAutoRenewal() {
    return this.httpClient.get(
      createUrl(`Accounting/AutoProcessing/AccountType`)
    );
  }

  public getAutoRenewalList(ClassType, AccType) {
    return this.httpClient.get(
      createUrl(
        `Accounting/AutoProcessing/RenewalList?ClassType=${ClassType}&&AccType=${AccType}`
      )
    );
  }

  public UpdateRenewal(ClassType, Id, RecordMark) {
    return this.httpClient.get(
      createUrl(
        `Accounting/AutoProcessing/UpdateRenewal?ClassType=${ClassType}&&Id=${Id}&&RecordMark=${RecordMark}`
      )
    );
  }

  public Post(ClassType, VchNo, AccType, GlCode) {
    return this.httpClient.get(
      createUrl(
        `Accounting/AutoProcessing/PostRenewal?ClassType=${ClassType}&&VchNo=${VchNo}&&AccType=${AccType}&&GlCode=${GlCode}`
      )
    );
  }

  public BulkUpdateRenewal(data, ClassType) {
    return this.httpClient.post(
      createUrl(
        `Accounting/AutoProcessing/BulkUpdateRenewal?ClassType=${ClassType}`
      ),
      data
    );
  }

  public GetAccountInfoForAutoRenewal(id) {
    return this.httpClient.get(
      createUrl(`Accounting/AutoProcessing/AccountInfo?Id=${id}`)
    );
  }

  // Auto Provision Process

  public getAccountTypeForAutoProvision() {
    return this.httpClient.get(
      createUrl(`Accounting/AutoProcessing/AccountTypeProvision`)
    );
  }
  public getAccountInfoAndFieldControlForProvision(id) {
    return this.httpClient.get(
      createUrl(`Accounting/AutoProcessing/AccountInfoControl?AccType=${id}`)
    );
  }
  public calculateAndGetProvisionList(data) {
    return this.httpClient.post(
      createUrl(`Accounting/AutoProcessing/ProvisionList`),
      data
    );
  }
  public PostProvision(data) {
    return this.httpClient.post(
      createUrl(`Accounting/AutoProcessing/PostProvision`),
      data
    );
  }
  public ReverseProvision(data) {
    return this.httpClient.post(
      createUrl(`Accounting/AutoProcessing/ReverseProvision`),
      data
    );
  }

  // Auto Anniversary Process

  public getAccountTypeForAutoAnniversary() {
    return this.httpClient.get(
      createUrl(`Accounting/AutoProcessing/AccountTypeAnniversary`)
    );
  }

  // Auto Instruction Deposit Process

  public getAccountInfoAndFieldControl(id) {
    return this.httpClient.get(
      createUrl(
        `Accounting/AutoTransferTransaction/AccountInfoControl?AccType=${id}`
      )
    );
  }
  public getAccountTypeForAutoInstruction() {
    return this.httpClient.get(
      createUrl(`Accounting/AutoTransferTransaction/AccountTypeInstruction`)
    );
  }

  public GetInstructionDepositList(ClassType, AccType) {
    return this.httpClient.get(
      createUrl(
        `Accounting/AutoTransferTransaction/InstructionDepositList?ClassType=${ClassType}&&AccType=${AccType}`
      )
    );
  }

  public CalculateInstructionDepositList(data) {
    return this.httpClient.post(
      createUrl(
        `Accounting/AutoTransferTransaction/CalculateInstructionDeposit`
      ),
      data
    );
  }

  public PostDeposit(data) {
    return this.httpClient.post(
      createUrl(`Accounting/AutoTransferTransaction/PostDeposit`),
      data
    );
  }
  public ReverseDeposit(data) {
    return this.httpClient.post(
      createUrl(`Accounting/AutoTransferTransaction/ReverseDeposit`),
      data
    );
  }

  public UpdateDeposit(data) {
    return this.httpClient.post(
      createUrl(`Accounting/AutoTransferTransaction/UpdateInstructionDeposit`),
      data
    );
  }

  public DeleteInstructionAccount(Id) {
    return this.httpClient.get(
      createUrl(
        `Accounting/AutoTransferTransaction/DeleteInstructionAccount?Id=${Id}`
      )
    );
  }

  // Account Balance Transfer
  public getAccountTypeForBalanceTransfer() {
    return this.httpClient.get(
      createUrl(`Accounting/TransferFunction/AccountTypeForBalanceTransfer`)
    );
  }

  public GetGLDebitCode(Id) {
    return this.httpClient.get(
      createUrl(`Accounting/TransferFunction/GLCode?AccType=${Id}`)
    );
  }

  public GetParameterValue() {
    return this.httpClient.get(
      createUrl(`HouseKeeping/ParameterMainGLedger/GetParameterValue`)
    );
  }

  public ProcessAccountBalanceTransfer(data) {
    return this.httpClient.post(
      createUrl(`Accounting/TransferFunction/ProcessAccountBalanceTransfer`),
      data
    );
  }
  public PostAccountBalanceTransfer(data) {
    return this.httpClient.post(
      createUrl(`Accounting/TransferFunction/PostAccountBalanceTransfer`),
      data
    );
  }
  public ReverseAccountBalanceTransfer(data) {
    return this.httpClient.post(
      createUrl(`Accounting/TransferFunction/ReverseAccountBalanceTransfer`),
      data
    );
  }
  // *****************Special Function End********************

  // Get Collectors
  public pageCLoadInfo() {
    return this.httpClient.get(createUrl(`Accounting/Collector/PageLoad`));
  }
  public getCollectors() {
    return this.httpClient.get(createUrl(`Accounting/GroupCode/GetCollectors`));
  }

  // Get group info
  public pageLoadInfo() {
    return this.httpClient.get(createUrl(`Accounting/GroupCode/PageLoad`));
  }
  public getGroupInfo(body) {
    return this.httpClient.get(
      createUrl(`Accounting/GroupCode/GetGroupInfo?RegNo=` + body)
    );
  }
  public getCollectorsInfo() {
    return this.httpClient.get(createUrl(`Accounting/GroupCode/GetCollectorsInfo`));
  }

  public getCollectorsInfoAfter(body) {
    return this.httpClient.get(createUrl(`Accounting/GroupCode/GetCollectorsInfoAfter?RegNo=`+body));
  }
  public insertGrpInfo(body) {
    return this.httpClient.post(createUrl(`Accounting/GroupCode/Insert`), body);
  }
  public updateGrpInfo(body) {
    return this.httpClient.post(createUrl(`Accounting/GroupCode/Update`), body);
  }

  // Get Collectors Info

  public getCollectorsinfo() {
    return this.httpClient.get(
      createUrl(`Accounting/Collector/GetCollectorsInfo`)
    );
  }

  // Get All  info of collectors
  public getAllCollectorsinfo(body) {
    return this.httpClient.get(
      createUrl(`Accounting/Collector/GetAllInfo?CollectorNo=` + body)
    );
  }

  //Collectors Insert update

  public collectorsInsertUpdate(body) {
    return this.httpClient.post(createUrl(`Accounting/Collector/Insert`), body);
  }

  //Get ChequeBook Counter Data

  public GetChequeBookDetails() {
    return this.httpClient.get(
      createUrl(`Accounting/ChequeBookCounter/GetAllInfo`)
    );
  }

  //inter cheque book counter details

  public InsertChequeBookDetails(body) {
    return this.httpClient.post(
      createUrl(`Accounting/ChequeBookCounter/InsertData`),
      body
    );
  }

  // Get Account Information for Cheque book Issue
  public GetChequeBookIssueAccDetails() {
    return this.httpClient.get(
      createUrl(`Accounting/ChequeBookIssue/GetAccInfo`)
    );
  }

  //Get Member Information with old AccNo
  public GetMemberInfoByOldAcc(body) {
    return this.httpClient.post(
      createUrl(`Accounting/ChequeBookIssue/GetMemAccInfo`),
      body
    );
  }

  // Get Cheque Information

  public ChequeInformation(body) {
    return this.httpClient.post(
      createUrl(`Accounting/ChequeBookIssue/ChequeDetails`),
      body
    );
  }

  public PreviousChqBook(body) {
    return this.httpClient.post(
      createUrl(`Accounting/ChequeBookIssue/PreviousAccNo`),
      body
    );
  }

  public CheckBtnState(body) {
    return this.httpClient.post(
      createUrl(`Accounting/ChequeBookIssue/CheckBtnValue`),
      body
    );
  }

  public BeginNoChk(body) {
    console.log('THis is api');
    return this.httpClient.post(
      createUrl(`Accounting/ChequeBookIssue/CheckBeginningNo`),
      body
    );
  }

  //Cheque book status change

  public GetMemInformation(body) {
    return this.httpClient.get(
      createUrl(`Accounting/ChequeBookStatusChange/GetMemInfo?MemNo=` + body)
    );
  }

  public AccTypeChanged(body) {
    console.log('THis is api');
    return this.httpClient.post(
      createUrl(`Accounting/ChequeBookStatusChange/AccTypeChanged`),
      body
    );
  }

  public MainGrid(body) {
    return this.httpClient.post(
      createUrl(`Accounting/ChequeBookStatusChange/MainGrid`),
      body
    );
  }
  public SelectedValue(body) {
    return this.httpClient.post(
      createUrl(`Accounting/ChequeBookStatusChange/SelectedValueDetails`),
      body
    );
  }
  public updatePValue(body) {
    return this.httpClient.post(
      createUrl(`Accounting/ChequeBookStatusChange/SubmitPValue`),
      body
    );
  }
  public updateBValue(body) {
    return this.httpClient.post(
      createUrl(`Accounting/ChequeBookStatusChange/SubmitMain`),
      body
    );
  }
  public PageLoad() {
    return this.httpClient.get(
      createUrl(`Accounting/ChequeBookStatusChange/PageLoad`)
    );
  }

  // Cheque Book Reverse
  public GetChequeInfoGrid(body) {
    return this.httpClient.post(
      createUrl(`Accounting/ChequeBookReverse/GetChequeGridInfo`),
      body
    );
  }

  // Check book Search
  public GetChequeDetails(body) {
    return this.httpClient.post(
      createUrl(`Accounting/SearchChequeNumber/ChequeInfo`),
      body
    );
  }

  // Profit Loos Maintenance

  // GLProvCode
  public GetGlProvCode() {
    return this.httpClient.get(createUrl(`Accounting/ProvLoss/GetGlProvCode`));
  }

  public Delete(Id) {
    return this.httpClient.get(
      createUrl(`Accounting/ProvLoss/Delete?Id=${Id}`)
    );
  }

  // GLProvCode
  public GetGlExpCode() {
    return this.httpClient.get(createUrl(`Accounting/ProvLoss/GetGlExpCode`));
  }

  // Insert Profit loss info
  public SaveInfo(body) {
    return this.httpClient.post(
      createUrl(`Accounting/ProvLoss/InsertInfo`),
      body
    );
  }
  //Update Data
  public UpdateInfo(body) {
    return this.httpClient.post(
      createUrl(`Accounting/ProvLoss/UpdateInfo`),
      body
    );
  }

  // Get All Profit Loss stored Data
  public GetStoredData() {
    return this.httpClient.get(createUrl(`Accounting/ProvLoss/GetStoredData`));
  }

  // Get Open Chart Of Account Header Dropdown Information

  public GetHeaderInfo() {
    return this.httpClient.get(
      createUrl(`Accounting/OpenChartOfAccount/GetHeaderDetails`)
    );
  }

  // Get Open Chart Of Account Main Header Dropdown Information

  public GetMainHeaderInfo(GlAccNo) {
    return this.httpClient.get(
      createUrl(
        `Accounting/OpenChartOfAccount/GetMainHeaderDetails?GlAccNo=${GlAccNo}`
      )
    );
  }

  // Get Open Chart Of Account Sub Header Dropdown Information

  public GetSubHeaderInfo(body) {
    return this.httpClient.post(
      createUrl(`Accounting/OpenChartOfAccount/GetSubHeaderDetails`),
      body
    );
  }

  public GetDeatilsCode(data: any) {
    return this.httpClient.get(
      createUrl(
        `Accounting/OpenChartOfAccount/GetSubHeadChange?selectedValue=` +
          data
      )
    );
  }

  // Get Open Chart Of Account Submit Information

  public SubmitInfo(body) {
    return this.httpClient.post(
      createUrl(`Accounting/OpenChartOfAccount/SubmitInfo`),
      body
    );
  }
  //check book reverse service
  public ReverseData(data: any) {
    console.log(data);
    return this.httpClient.post(
      createUrl('Accounting/ChequeBookReverse/Reverse'),
      data
    );
  }

  // Booth GL Code Control Maintenance
  public GetAllData() {
    return this.httpClient.get(
      createUrl(`Accounting/BoothGlControl/GetAllInfo`)
    );
  }
  public GetSelectedItems() {
    return this.httpClient.get(
      createUrl(`Accounting/BoothGlControl/GetSelectedValue`)
    );
  }

  public Submit(body) {
    return this.httpClient.post(
      createUrl(`Accounting/BoothGlControl/Submit`),
      body
    );
  }

  public PictureCardPageLoad() {
    return this.httpClient.get(
      createUrl(`ImageProcessing/PictureCardLoadData`)
    );
  }

  public MemberPictureLoadData() {
    return this.httpClient.get(
      createUrl(`ImageProcessing/MemberPictureLoadData`)
    );
  }

  public MemberSignatureLoadData() {
    return this.httpClient.get(
      createUrl(`ImageProcessing/MemberSignatureLoadData`)
    );
  }

  public PictureCardSubmitData(data) {
    return this.httpClient.post(
      createUrl(`ImageProcessing/MemberCardUpload`),
      data
    );
  }

  public PictureCardUpdateData(data) {
    return this.httpClient.post(
      createUrl(`ImageProcessing/MemberCardUpdate`),
      data
    );
  }

  public MemberPictureSubmitData(data) {
    return this.httpClient.post(
      createUrl(`ImageProcessing/MemberPictureUpload`),
      data
    );
  }

  public MemberPictureUpdateData(data) {
    return this.httpClient.post(
      createUrl(`ImageProcessing/MemberPictureUpdate`),
      data
    );
  }

  public MemberSignatureSubmitData(data) {
    return this.httpClient.post(
      createUrl(`ImageProcessing/MemberSignatureUpload`),
      data
    );
  }

  public MemberSignatureUpdateData(data) {
    return this.httpClient.post(
      createUrl(`ImageProcessing/MemberSignatureUpdate`),
      data
    );
  }

  public MemberRefPictureSubmitData(data) {
    return this.httpClient.post(
      createUrl(`ImageProcessing/MemberRefPictureUpload`),
      data
    );
  }

  public MemberRefPictureUpdateData(data) {
    return this.httpClient.post(
      createUrl(`ImageProcessing/MemberRefPictureUpdate`),
      data
    );
  }

  public VerifyMemSignaturePageLoad() {
    return this.httpClient.get(
      createUrl(`ImageProcessing/VerifyMemSignaturePageLoad`)
    );
  }

  public VerifyMemSignatureOldAcc(data: any, data2: any) {
    return this.httpClient.get(
      createUrl(
        `ImageProcessing/VerifyMemSignatureOldAcc?oldAcc=` +
          data +
          `&accType=` +
          data2
      )
    );
  }

  public GetMemberImages(data: any, data2: any) {
    return this.httpClient.get(
      createUrl(
        `ImageProcessing/GetMemberImages?memNo=` + data + `&memType=` + data2
      )
    );
  }

  // Check book Counter
  public BegNoChanged(data) {
    return this.httpClient.post(
      createUrl(`Accounting/ChequeBookCounter/BegNoChanged`),
      data
    );
  }

  // date check
  public DateChanged(ChqBIssDt: any) {
    return this.httpClient.get(
      createUrl(`Accounting/ChequeBookCounter/DateCheck?ChqBIssDt=` + ChqBIssDt)
    );
  }

  public monthlyMonitoringReportInputHelpData() {
    return this.httpClient.get(
      createUrl(`Accounting/CSMonthlyMonitoringReport/GetInputHelpData`)
    );
  }

  public monthlyMonitoringBtnPreviewData(data: any) {
    return this.httpClient.post(
      createUrl(`Accounting/CSMonthlyMonitoringReport/PreviewData`),
      data
    );
  }

  public monthlyMonitoringSubHeadData(data: any) {
    return this.httpClient.post(
      createUrl(`Accounting/CSMonthlyMonitoringReport/SubHeadData`),
      data
    );
  }

  public monthlyMonitoringFullHeadData(data: any) {
    return this.httpClient.post(
      createUrl(`Accounting/CSMonthlyMonitoringReport/FullHeadData`),
      data
    );
  }

  public CollectorTransferPageLoad() {
    return this.httpClient.get(
      createUrl(`Accounting/SpecialFunction/CollectorTransfer/CollectorTransferPageLoad`)
    );
  }

  public FromCollectorChangeData(data:any) {
    return this.httpClient.get(
      createUrl(`Accounting/SpecialFunction/CollectorTransfer/FromCollectorChangeData?fromCollector=`+data)
    );
  }

  public ToCollectorChangeData() {
    return this.httpClient.get(
      createUrl(`Accounting/SpecialFunction/CollectorTransfer/ToCollectorChangeData`)
    );
  }

  public CollectorTransfer(data:any) {
    return this.httpClient.post(
      createUrl(`Accounting/SpecialFunction/CollectorTransfer/CollectorTransfer`),
      data
    );
  }

}
