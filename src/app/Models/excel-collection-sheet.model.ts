import { IdDescription } from "../interfaces/id-description"

export class ExcelCollectionSheetModel{
    ProcessDate?:string
    UserList?:IdDescription[]
    ExcelCollectionType?:IdDescription[]
}

export class ExcelSheetCollectionDataViewModel{
    Success?:boolean
    Message?:string
    Data?:ExcelSheetCollectionDataModel[]
}

export interface ExcelSheetCollectionDataModel{
    GlAccountNo?:number
    AccountDescription?:string
    ColumnNo?:number
}

export class ExcelSheetCollectionVerifyParam{
    BranchNo?:number
    FromDate?:string
    ToDate?:string
    OptionId?:number
    UserId?:number
    ChkOldMemNo?:boolean
    Data?:ExcelSheetCollectionDataModel[]
}