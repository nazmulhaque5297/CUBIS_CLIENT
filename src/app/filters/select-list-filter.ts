import { IdDescription } from "../interfaces/id-description";
import { ListFilterAbstract } from "./abstract-filter-builder";

export class SelectListFilter extends ListFilterAbstract  
{
    getItem(data: IdDescription[], value: number): IdDescription {
        var result= data.filter(x=>x.Id==value);
        if(result!=null && result.length>0)
         return result[0];
        return null;  
    }
    
}