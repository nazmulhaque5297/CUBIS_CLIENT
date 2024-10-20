import { Injectable } from '@angular/core';
import { SlabMaintainHelpModel } from '../../Models/HoseKeepingModel';

@Injectable({
  providedIn: 'root'
})
export class SlabMaintainService {
  data: SlabMaintainHelpModel = new SlabMaintainHelpModel();
  constructor() { }
}
