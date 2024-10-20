export class DailyGLTransactionVchReportPageLoadModel {
  ProcessDate: string = '';
}

export class DailyGLTransactionVchReportVchInfoModel {
  Success: boolean;
  Message: boolean;
  FromDate: string = '';
  ProcessDate: string = '';
  ToDate: string = '';

  TrnTypeTitle: string = '';
  BoothNo: string = '';
  BoothName: string = '';

  VchFlag: string = '';
  VchYear: string = '';
}
