import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoothRoutingModule } from './booth-routing.module';
import { BoothComponent } from './Home/booth.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { BoothCsVoucherWiseTransactionReportComponent } from '../accounting/pages/reports/booth-cs-voucher-wise-transaction-report/booth-cs-voucher-wise-transaction-report.component';

@NgModule({
  declarations: [BoothComponent],
  imports: [CommonModule, BoothRoutingModule, SharedComponentsModule],
})
export class BoothModule {}
