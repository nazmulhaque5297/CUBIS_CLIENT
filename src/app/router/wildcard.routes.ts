import { Route } from '@angular/router';

import { NotFoundPageComponent } from '../pages/public/not-found-page/not-found-page.component';

export const WILDCARD_ROUTE: Route = {
  path: '**',
  loadChildren: () =>
    import('../../app/pages/public/not-found-page/not-found-page.component').then(
      (m) => m.NotFoundPageComponent,
    ),
  component: NotFoundPageComponent,
};
