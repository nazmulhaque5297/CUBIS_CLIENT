import { IdDescription } from "../interfaces/id-description";

export abstract class ListFilterAbstract {
    constructor() {
    }
    abstract getItem(data: IdDescription[], value: number):IdDescription;
}