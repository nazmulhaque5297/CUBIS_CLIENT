import { FormGroup } from "@angular/forms";
import { SelectListFilter } from "src/app/filters/select-list-filter";
import { IdDescription } from "src/app/interfaces/id-description";
import { MemberApplicationInputHelp, MemberApplicationModel } from "../models/member-application.model";

export interface IMemberDdlSelectionService{
    setMemberType(value:number):void;
    setGender(value:number):void;
}

export class CreateMemberDdlService implements IMemberDdlSelectionService{
    private readonly inputHelpData:MemberApplicationInputHelp;
    memberApplicationForm: FormGroup;
    inputFieldValue:string='';
    ddlValue:number=0;

    constructor(_memberApplicationForm: FormGroup,_inputHelp:MemberApplicationInputHelp,){
        this.inputHelpData=_inputHelp;
        this.memberApplicationForm=_memberApplicationForm;
    }

    public setMemberType(value:number){
        var item= new SelectListFilter().getItem(this.inputHelpData.MemberType,value);
        this.checkAndSetValue(item);
        this.memberApplicationForm.controls['MemType'].setValue(this.ddlValue);
        this.memberApplicationForm.controls['MemTypeCode'].setValue(this.inputFieldValue);
    }

    public setGender(value:number){
        var item= new SelectListFilter().getItem(this.inputHelpData.Gender,value);
        this.checkAndSetValue(item);
        this.memberApplicationForm.controls['Gender'].setValue(this.ddlValue);
        this.memberApplicationForm.controls['GenderCode'].setValue(this.inputFieldValue);
    }

    public setReligion(value:number){
        var item= new SelectListFilter().getItem(this.inputHelpData.Religion,value);
        this.checkAndSetValue(item);
        this.memberApplicationForm.controls['Religion'].setValue(this.ddlValue);
        this.memberApplicationForm.controls['ReligionCode'].setValue(this.inputFieldValue);
    }

    public setMaritalStatus(value:number){
        var item= new SelectListFilter().getItem(this.inputHelpData.MaritalStatus,value);
        this.checkAndSetValue(item);
        this.memberApplicationForm.controls['MaritalStatus'].setValue(this.ddlValue);
        this.memberApplicationForm.controls['MaritalStatusCode'].setValue(this.inputFieldValue);
    }

    public setMemberGroup(value:number){
        var item= new SelectListFilter().getItem(this.inputHelpData.Regions,value);
        this.checkAndSetValue(item);
        this.memberApplicationForm.controls['MemRegNo'].setValue(this.ddlValue);
        this.memberApplicationForm.controls['MemRegNoCode'].setValue(this.inputFieldValue);
    }
    public setCollector(value:number){
        console.log('=====',value)
        var item= this.inputHelpData.Collector?.find(e=> e.CollectorNo == value)
        this.memberApplicationForm.controls['MemColNo'].setValue(item!=null?item.CollectorNo:0);
        this.memberApplicationForm.controls['MemColCode'].setValue(item!=null?item.CollectorNo.toString():'');
    }

    public setAge(value:any){
        if(value==null) value="";
        let num = value;
        num = num.toString();
        if(num[2]=='/') num = num.split("/");
        else num = num.split("-");
        let date = num[0];
        let month = num[1];
        let year = num[2];
        let result = month + "-" + date + "-" + year;
        let convertAge = new Date(year,month,date);
        const timeDiff = Math.abs(Date.now() - (convertAge.getTime()));
        const showAge = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
        this.memberApplicationForm.controls['Age'].setValue(showAge);
    }



    private checkAndSetValue(item:IdDescription){
        this.ddlValue=item!=null?item.Id:0;
        this.inputFieldValue=item!=null?item.Id.toString():'';
    }

}
