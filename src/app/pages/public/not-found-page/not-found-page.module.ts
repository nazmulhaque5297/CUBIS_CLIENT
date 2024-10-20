import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Path } from '../../../@core/structs/path.enum';
import { NotFoundPageComponent } from './not-found-page.component';

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: Path.NotFound,
        component: NotFoundPageComponent,
        data: {
          title: 'The page you were looking for could not be found',
          robots: 'noindex, nofollow',
        },
      },
    ]),
  ],
})
export class NotFoundModule {}
