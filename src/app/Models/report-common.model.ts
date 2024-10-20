
export class ReportCommonModel{
    ReportName:string;
    Values: ReportKeyValue[]
}

export class ReportKeyValue{
    Key:string;
    Value:string;
    constructor(x: string, y: string) {
        this.Key = x;
        this.Value = y;
    }
}

export interface IReportResponse{
    id:string,
    token:string
}