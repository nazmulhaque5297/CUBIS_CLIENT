import { FormGroup } from "@angular/forms";
import { MemberApplicationInputHelp, MemberApplicationModel } from "../models/member-application.model";
import { CreateMemberDdlService } from "./create-member-control-events";


export class EditMemberApplicationService{
    private readonly inputHelpData:MemberApplicationInputHelp;
    memberApplicationForm: FormGroup;
    createMemberDdlService:any;
    constructor(_memberApplicationForm: FormGroup,_inputHelp:MemberApplicationInputHelp){
        this.inputHelpData=_inputHelp;
        this.memberApplicationForm=_memberApplicationForm;
        this.createMemberDdlService=new CreateMemberDdlService(this.memberApplicationForm,this.inputHelpData)
    }

    public setApplicationDetails(data:MemberApplicationModel){
        this.memberApplicationForm.patchValue(data);
        this.createMemberDdlService.setMemberType(data.MemType);
        this.createMemberDdlService.setGender(data.Gender);
        this.createMemberDdlService.setReligion(data.Religion);
        this.createMemberDdlService.setMaritalStatus(data.MaritalStatus);
        this.createMemberDdlService.setMemberGroup(data.MemRegNo);
    }
}