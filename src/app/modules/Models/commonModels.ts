

export interface UserMenu {
  ModuleNo: Number,
  MenuNo: Number,
  MenuName: String,
  MenuParentNo: Number
}


export interface UserInfo{
    IdsNo: Number,
    IdsPass: String,
    IdsLevel: Number,
    IdsLogInFlag: Number,
    IdsLockFlag: Number,
    IdsName: String,
    IdsFlag: Number,
    IdsType: Number,
    IdsStatus: Number,
    EmpCode: Number,
    UserId: any,
    GLCashCode: Number,
    GLCashCodeDescription: any,
    UserBranchNo: Number,
    CreateDate: any,
    module: any,
    SODflag: Boolean,
    CSVPrintflag: Boolean,
    GLVPrintflag: Boolean,
    AutoVchflag: Boolean,
    IdsLogInTable: Number,
    SMSflag: Boolean,
    CompanyId: Number,
    LIdsCashCredit: any,
    LIdsCashDebit: any,
    LIdsTrfCredit: any,
    LIdsTrfDebit: any
    ResetPassword?:boolean
}

