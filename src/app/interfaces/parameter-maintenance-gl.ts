import { IdDescription } from './id-description';

export class EnableDisableParameterMainGLField {
  ShowCSAutoVch: boolean = true;
  ShowGLAutoVch: boolean = true;
  ShowInitializedCSAutoVchNo: boolean = true;
  ShowInitializedGLAutoVchNo: boolean = true;
}

export class ParameterMainGLInputHelp extends EnableDisableParameterMainGLField {
  cculbcsparamdto: ParameterMainGLViewModel;
  CorrAccountTypeList: IdDescription[];
  SMSFontTypeList: IdDescription[];
  YesNoList: IdDescription[];
  CSAutoVchList: IdDescription[];
  GLAutoVchList: IdDescription[];
  InitializedAutoVchCSGLList: IdDescription[];
  ManualAccNo:number;
}

export class ParameterMainGLViewModel extends EnableDisableParameterMainGLField {
  MemCollectorFlag: number;
  MemGroupFlag: number = 0;
  OldAccNoFlag: number = 0;
  PrmMemApplication1: number = 0;
  PrmMemApplication2: number = 0;
  PrmLoanApplication1: number = 0;
  PrmLoanApplication2: number = 0;
  PrmCorrAccType: number = 0;
  PrmSMSFont: number = 0;
  PrmCSAutoVchCtrl: number = 0;
  PrmGLAutoVchCtrl: number = 0;
  PrmAutoVchInitializedCS: number = 0;
  PrmAutoVchInitializedGL: number = 0;
}
