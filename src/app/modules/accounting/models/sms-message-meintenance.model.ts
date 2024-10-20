import { ApiResponse } from "src/app/interfaces/api-response";
import { IdDescription } from "src/app/interfaces/id-description"
//import * as internal from "stream";

export class SmsMessageMaintenancePageLoadModel{
    FunctionOptionDropDown:IdDescription[] = [];
    LanguageFlag:number;

}
export class SmsMessageMaintenanceTextDataModel{

    Success:boolean;
    Success2:boolean;
    Message1:string='';
    Message2:string='';
    Message3:string='';
    WriteFlag:string='';
    MessageFlag:number;
    TextMessage1:string='';
    TextMessage2:string='';
    TextMessage3:string='';
    TextMessage1B:string='';
    TextMessage2B:string='';
    TextMessage3B:string='';

}