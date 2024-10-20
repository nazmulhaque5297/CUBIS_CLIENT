import { Routes } from '@angular/router';
import { AuthGuard } from '../guard';
import { Path } from '../@core/structs/path.enum';


export const PRIVATE_ROUTES: Routes = [
    {
      path: Path.HouseKeeping,
      loadChildren: () => import('../modules/house-keeping/house-keeping.module').then(m => m.HouseKeepingModule)
    },

    {
      path: Path.Accounting ,
      loadChildren: () => import('../modules/accounting/accounting.module').then(m => m.AccountingModule)
    },
    {
      path: Path.Booth ,
      loadChildren: () => import('../modules/booth/booth.module').then(m => m.BoothModule)
    }

 ]


export const PRIVATE_ROUTING_COMPONENTS = [];
