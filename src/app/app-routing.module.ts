import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { PRIVATE_ROUTES,  PUBLIC_ROUTES, WILDCARD_ROUTE, PUBLIC_ROUTING_COMPONENTS } from './router/index';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [...PUBLIC_ROUTES, ...PRIVATE_ROUTES,
      { path: 'modules/booth', loadChildren: () => import('./modules/booth/booth.module').then(m => m.BoothModule) },],
      {
        preloadingStrategy: PreloadAllModules,
      },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export const routingComponents = [PUBLIC_ROUTING_COMPONENTS]
