export class GLCodeDetailsModel {
    Success?: boolean
    Message?: string
    GLRecType?: number
    GLAccNo?: number
    GLAccDesc?: string
    GLAccDescB?: string
    GLSubHead?: number
    GLPrtPos?: number
    GLBalanceType?: number
    GLMiscAcc?: number
    GLAccMode?: number
    Status?: number
    OverDraft?: boolean
    ShowOverDraft?: boolean = false
    MsicAcc?: boolean
    ShowMsicAcc?: boolean = false
}