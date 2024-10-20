export class MonthlyMonitoringPreviewGetModel{
  Id?: number;
  SLNO?: number;
  AccType?: number;
  Perticulars?: string;
  Numbers?: number;
  Amount?: number;
  CSGLFlag?: number;
}

export class GvDtlHeaderModel
{
    Id?: number;
    SLNO?: number;
    MemNo?: number;
    MemName?: number;
    AccNo?: number;
    Amount?: number;
    Amount1?: number;
    TrnDate?: number;
    DueNos?: number;
    GLAccNo?: number;
    GLAccName?: number;
    VchNo?: number;
}

export class MonthlyMonitoringFinalHeadDataModel{
  GvDtlHeaderInfo1Visible: boolean = false;
  GvDtlHeaderInfo2Visible: boolean = false;
  GvDtlHeaderInfo3Visible: boolean = false;
  GvDtlHeaderInfo4Visible: boolean = false;
  GvDtlHeaderInfoVisible: boolean = false;
  SubList: MonthlyMonitoringPreviewGetModel[] = [];
  MainList: MonthlyMonitoringPreviewGetModel[] = [];
  GvDtlHeader?: GvDtlHeaderModel[] = [];
  GvDtlHeader1?: GvDtlHeaderModel[] = [];
  GvDtlHeader2?: GvDtlHeaderModel[] = [];
  GvDtlHeader3?: GvDtlHeaderModel[] = [];
  GvDtlHeader4?: GvDtlHeaderModel[] = [];
}
