// export interface IDayEndProcessWrongAccount {
//       VoucherNo?: string;	
//       MemNo?: number;	
//       MemType?: number;	
//       AccType?: number;	
//       AccNo?: string;	
//       TrnDate?: number;	
//       TrnCode?: number;	
//       FuncOpt?: number;	
//       FuncOptDesc?: string;	
//       TrnDebit?: number;	
//       TrnCredit?: number;	
//       TrnDescription?: string;	
//       TnrInterestAmt?: number;	
//       OrginalMemNo?: number;	
//       OrginalAccNo?: string;
//       MemNoHere?: string;
//       UserId?: number;
// }

export interface IDayEndProcessWrongAccount {
    VoucherNo?: string;	
    UserId?: number;
}

export const WrongAccounts = [
    {
        VoucherNo: "1",
        UserId: 1
    },
    {
        VoucherNo: "1",
        UserId: 1
    },
    {
        VoucherNo: "1",
        UserId: 1
    },
];

// export class IDayEndProcessWrongAccount{
//     WrongAccountList?: IDayEndProcessWrongAccount[];
// }